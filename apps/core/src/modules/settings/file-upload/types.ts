import { z } from "zod";
import { filesValidationSchema } from "@/settings/file-upload/schema";

type UploadConfigFormT = z.infer<typeof filesValidationSchema>;
type DynamicFieldsT = Omit<UploadConfigFormT, 'UPLOAD_FILE_TYPES' | 'WIDGETS_UPLOAD_FILE_TYPES' | 'FILE_SYSTEM_PUBLIC'>

type serviceTypeT = {
  name: string,
  fields?: {
    label: string;
    name: string;
    type: string;
  },
  form?: any;
}

interface fileMimeTypes {
  value: string;
  label: string;
  extension: string;
}

export {
  UploadConfigFormT,
  DynamicFieldsT,
  serviceTypeT,
  fileMimeTypes
}