'use client'
import pdfMake from 'pdfmake/build/pdfmake'
import { ToWords } from 'to-words';
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Button } from './ui/button'
import { Icons } from './icons'
import { getInvoiceTemplate } from '@/template/invoice-template'
import { ItemFormFields } from './FormWithTable/AddItemForm/AddItemForm'
import { CompanyFormFields } from './company/AddNewCompany/AddNewCompany'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export type InvoiceItem = {
  items?: ItemFormFields[]
  total?: string
  invoiceNo?: string
  invoiceDate: Date
  discountedPrice?: string
  totalPayableAmount?: string
  gstTaxAmount?: string
  company?: CompanyFormFields,
  vehicleNo: string,
  transport: string,
  ewayNo: string,
}
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    },
  },
});



const PrintInvoice = ({
  items,
  total,
  invoiceDate,
  invoiceNo,
  discountedPrice,
  totalPayableAmount,
  gstTaxAmount,
  company,
  vehicleNo,
  transport,
  ewayNo,

}: InvoiceItem) => {
  const printInvoice = () => {
    const invoiceData = {
      companyName: company?.name ,
      companyGSTIN: company?.gstin ,
      customerName: company?.name ,
      customerAddress: company?.address ,
      placeOfSupply: company?.address ,
      companyAddress: company?.address ,
      customerPhone: company?.contactNo ,
      contactNo: company?.contactNo,
      customerGSTIN: company?.gstin,
      invoiceNo: invoiceNo,
      invoiceDate: invoiceDate.toDateString(),
      items: items?.map((item) => ({
        name: item.name,
        hsn: item.hsn,
        quantity: item.quantity,
        unit: item.quantity,
        rate: item.rate,
        taxableValue: item.amount,
        tax: item.tax,
      })),
      total: total ? parseFloat(total.replace(/,/g, '')) : 0,
      igst: gstTaxAmount ? parseFloat(gstTaxAmount.replace(/,/g, '')) : 0,
      grandTotal: totalPayableAmount ? parseFloat(totalPayableAmount.replace(/,/g, '')) : 0,
      totalInWords: total ? toWords.convert(parseFloat(total.replace(/,/g, ''))) : 'Zero',
      taxSummary: [
        {
          hsn: items?.map((item) => item.hsn).join(', '),
          taxableValue: total ? parseFloat(total.replace(/,/g, '')) : 0,
          igstRate: 18,
          igstAmount: gstTaxAmount ? parseFloat(gstTaxAmount.replace(/,/g, '')) : 0,
          total: gstTaxAmount ? parseFloat(gstTaxAmount.replace(/,/g, '')) : 0,
        },
      ],
      totalTaxableValue: total ? parseFloat(total.replace(/,/g, '')) : 0,
      totalIGST: gstTaxAmount ? parseFloat(gstTaxAmount.replace(/,/g, '')) : 0,
      totalTax: gstTaxAmount ? parseFloat(gstTaxAmount.replace(/,/g, '')) : 0,
      bankName: company?.bankName,
      branchName: company?.branchName,
      accountNumber:company?.accountNumber,
      ifscCode:company?.ifscCode,
      vehicleNo,
      transport,
      ewayNo,
    }

    pdfMake.createPdf(getInvoiceTemplate(invoiceData)).print()
  }

  return (
    <Button variant={'ghost'} onClick={printInvoice} disabled={!company || items?.length === 0}>
      <Icons.print className="mr-2 h-4 w-4" />
    </Button>
  )
}

export default PrintInvoice
