import { Metadata } from 'next'
import ItemTable from '@/components/FormWithTable/ItemTable/ItemTable'
import { getItems } from '@/app/actions/item'

export const metadata: Metadata = {
  title: 'Item',
  description: 'A task and issue tracker build using Tanstack Table.',
}

export default async function Page() {
  const data = JSON.parse(await getItems())

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <ItemTable data={data} />
    </div>
  )
}
