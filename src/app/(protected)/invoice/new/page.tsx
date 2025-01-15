// pages/login.js

import React from 'react'
import { CreateInvoice } from '@/components/Invoice'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.',
}



const NewItem = async () => {

  return (
    <div className="min-h-screen flex   bg-gray-50 py-2 px-2 sm:px-2 lg:px-5">
      <CreateInvoice  />
    </div>
  )
}

export default NewItem
