// pages/login.js

import React from 'react'
import { CreateInvoice } from '@/components/Invoice'
import { Metadata } from 'next'
import { getInvoicesById } from '@/app/actions/invoice'

export const metadata: Metadata = {
  title: 'Invoice',
  description: 'A task and issue tracker build using Tanstack Table.',
}



const NewInvoice=async ({ params }: { params: { id: string } })=> {
const invoice = JSON.parse(await getInvoicesById(params.id))

  return (
    <div className="min-h-screen flex   bg-gray-50 py-2 px-2 sm:px-2 lg:px-5">
      <CreateInvoice invoiceId={params.id} invoice={invoice?.length > 0?invoice[0]:undefined} />
    </div>
  )
}

export default NewInvoice
