import { Metadata } from 'next'
import { getItems } from '@/app/actions/item'
import { InvoiceList } from '@/components/Invoice'

export const metadata: Metadata = {
  title: 'Invoice',
  description: 'A task and issue tracker build using Tanstack Table.',
}

export default async function Page() {
  const data = JSON.parse(await getItems())

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <InvoiceList data={data} />
    </div>
  )
}
