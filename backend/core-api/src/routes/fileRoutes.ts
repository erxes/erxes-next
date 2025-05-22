import {
  getEnv,
  getSubdomain,
  isImage,
  sanitizeKey,
} from 'erxes-api-shared/utils';
import { NextFunction, Request, Response, Router } from 'express';
import * as formidable from 'formidable';
import { filterXSS } from 'xss';
import { generateModels } from '~/connectionResolvers';
import { checkFile, deleteFile, resizeImage, uploadFile } from '~/utils/file';
import { readFileRequest } from '~/utils/file/read';

const router: Router = Router();

const DOMAIN = getEnv({ name: 'DOMAIN' });

router.get(
  '/read-file',
  async (req: Request, res: Response, next: NextFunction) => {
    const subdomain = getSubdomain(req);
    const models = await generateModels(subdomain);

    try {
      const { key, inline, name, width = 0 } = req.query || {};

      const sanitizedKey = sanitizeKey(String(key));

      if (!sanitizedKey) {
        return res.send('Invalid key');
      }

      const response = await readFileRequest({
        key: sanitizedKey,
        models,
        userId: String(req.headers.userid),
        width: Number(width),
      });

      if (inline && inline === 'true') {
        const extension = sanitizedKey.split('.').pop();

        res.setHeader(
          'Content-disposition',
          'inline; filename="' + sanitizedKey + '"',
        );
        res.setHeader('Content-type', `application/${extension}`);

        return res.send(response);
      }

      const attachment = String(name) || sanitizedKey;

      res.attachment(attachment);

      return res.send(response);
    } catch (e) {
      if ((e as Error).message.includes('key does not exist')) {
        return res.status(404).send('Not found');
      }

      // debugError(e);

      return next(e);
    }
  },
);

router.post('/upload-file', async (req: Request, res: Response) => {
  const subdomain = getSubdomain(req);
  const domain = DOMAIN.replace('<subdomain>', subdomain);
  const models = await generateModels(subdomain);

  const maxHeight = Number(req.query.maxHeight);
  const maxWidth = Number(req.query.maxWidth);

  const form = new formidable.IncomingForm();

  form.parse(req, async (error, _fields, files) => {
    if (error) {
      return res
        .status(400)
        .send(`File upload parsing error: ${error.message}`);
    }

    const uploaded = files.file || files.upload;

    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    const mimetype = file?.mimetype;

    if (!mimetype) {
      return res
        .status(400)
        .send('One or more files have unrecognized MIME type');
    }

    let fileResult = file;

    if (isImage(mimetype) && maxHeight && maxWidth) {
      fileResult = await resizeImage(file, maxWidth, maxHeight);
    }

    const status = await checkFile(models, fileResult, req.headers.source);

    if (status !== 'ok') {
      return res.status(400).send(status);
    }

    try {
      const result = await uploadFile(
        `${domain}/gateway`,
        fileResult,
        !!files.upload,
        models,
      );

      res.send(result);
    } catch (e) {
      return res.status(500).send(filterXSS(e.message));
    }
  });
});

router.post('/delete-file', async (req: Request, res: Response) => {
  // require login
  if (!req.headers.userid) {
    return res.end('forbidden');
  }

  const subdomain = getSubdomain(req);
  const models = await generateModels(subdomain);

  const status = await deleteFile(models, req.body.fileName);

  if (status === 'ok') {
    return res.send(status);
  }

  return res.status(500).send(status);
});

export { router };
