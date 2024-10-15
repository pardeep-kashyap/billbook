'use-client'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Button } from './ui/button'
import { Icons } from './icons'
import { getInvoiceTemplate } from '@/template/invoice-template'
import { ItemFormFields } from './FormWithTable/AddItemForm/AddItemForm'
import { CompanyFormFields } from './company/AddNewCompany/AddNewCompany'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export type InvoiceItem = {
  items: ItemFormFields[]
  total: string
  invoiceNo: string
  date: string
  discountedPrice: string
  totalPayableAmount: String
  gstTaxAmount: String
  company: any
}
const PrintInvoice = ({
  items,
  total,
  date,
  invoiceNo,
  discountedPrice,
  totalPayableAmount,
  gstTaxAmount,
  company,
}: {
  items: any[]
  total: string
  invoiceNo: string
  date: string
  discountedPrice: string
  totalPayableAmount: String
  gstTaxAmount: String
  company: CompanyFormFields
}) => {
  const printInvoice = () => {
    pdfMake.createPdf(getInvoiceTemplate()).print()
  }

  return (
    <Button variant={'ghost'} onClick={printInvoice}>
      <Icons.print className="mr-2 h-4 w-4" />
    </Button>
  )
}

export default PrintInvoice
