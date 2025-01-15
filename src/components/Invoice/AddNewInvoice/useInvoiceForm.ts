import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from '../../ui/use-toast'

const invoiceFormSchema = z.object({
  company: z.string({ required_error: 'Company name is required.' })
    .min(1, { message: 'Company is required.' }),
    ewayNo: z.string(),
    id: z.string().optional(),
    transport: z.string(),
    vehicleNo: z.string(),
    invoiceNo: z.string({ required_error: 'Invoice No is required.' }),
    invoiceDate: z.date({ required_error: 'Invoice Date is required.' }),
})

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

const defaultInvoiceValues: Partial<InvoiceFormValues> = {
  company: '',
  invoiceDate: new Date(),
  invoiceNo: '',
  vehicleNo: '',
  transport: '',
  ewayNo: '',
}

export const useInvoiceForm = ({invoice}:{invoice?:InvoiceFormValues}) => {
  console.log(invoice)
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: invoice? {
      ...invoice,
      invoiceDate:new Date(invoice.invoiceDate),
    }:defaultInvoiceValues,
    mode: 'onChange',
  })

  const onSubmit = (data: InvoiceFormValues) => {
    toast({
      title: 'You submitted the following values:',
      description: `
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">${JSON.stringify(data, null, 2)}</code>
        </pre>
      `,
    })
  }

  return { form, onSubmit }
}
