import * as z from "zod";

export const productFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .default(''),
  shortName: z.string()
    .min(2, "Short name must be at least 2 characters")
    .max(50, "Short name must be less than 50 characters")
    .default(''),
  type: z.string()
    .min(1, "Please select a type")
    .nonempty("Please select a type")
    .default(''),
  categoryId: z.string()
    .min(1, "Please select a category")
    .nonempty("Please select a category")
    .default(''),
  description: z.string().optional().default(''),
  barcodes: z.array(z.string()).default([]),
  variants: z.any().default({}),
  barcodeDescription: z.string().optional().default(''),
  unitPrice: z.number({
    required_error: "Unit price is required",
  }).min(0, "Price cannot be negative"),
  code: z.string()
    .min(2, "Code must be at least 2 characters")
    .max(50, "Code must be less than 50 characters")
    .default(''),
  customFieldsData: z.any().default({}),
  attachment: z.any().optional().default(null),
  attachmentMore: z.any().optional().default(null),
  pdfAttachment: z.object({
    name: z.string().optional(),
    url: z.string().optional(),
    type: z.string().optional(),
    size: z.number().optional(),
  }).optional().default({}),
  vendorId: z.string().optional().default(''),
  scopeBrandIds: z.array(z.string()).default([]),
  uom: z.string()
    .min(1, "UOM is required")
    .nonempty("UOM is required")
    .default(''),
  subUoms: z.any().default([]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
