import { z } from 'zod'

export const InvoiceSchema = z.object({
  id: z.string().optional(),
  invoiceNo: z.string(),
  companyId: z.string(),
  invoiceDate: z.date(),
  items: z.array(z.object({
    name: z.string(),
    hsn: z.string(),
    quantity: z.number(),
    rate: z.number(),
    discount: z.number().optional(),
    amount: z.number(),
    grossTotalAmount: z.number(),
    discountAmount: z.number(),
  })),
  totalAmount: z.number(),
  gstTaxAmount: z.number(),
  totalPayableAmount: z.number(),
  status: z.enum(['draft', 'sent', 'paid', 'cancelled']),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type Invoice = z.infer<typeof InvoiceSchema>
