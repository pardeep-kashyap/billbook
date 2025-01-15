import { Metadata } from 'next'
import {  getInvoices } from '@/app/actions/invoice'
import { InvoiceList } from '@/components/Invoice'

export const metadata: Metadata = {
  title: 'Invoice',
  description: 'A task and issue tracker build using Tanstack Table.',
}

export default async function Page() {
const data = JSON.parse(await getInvoices())

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <InvoiceList data={data??[]} />
    </div>
  )
}
