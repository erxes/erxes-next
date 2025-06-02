import { z } from "zod"

export const ProductFormSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    code: z.string().optional(),
    barcodes: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    uom: z.string().optional(),
    shortName: z.string().optional(),
    description: z.string().optional(),
    barcodeDescription: z.string().optional(),
    vendorId: z.string().optional(),
    scopeBrandIds: z.array(z.string()).optional(),
    unitPrice: z.number().optional(),
    attachment: z.object({
      url: z.string().optional(),
      name: z.string().optional(),
      type: z.string().optional(),
      size: z.number().optional(),
    }).optional(),
  })
  
  export type ProductFormValues = z.infer<typeof ProductFormSchema>