// pages/login.js

import React from 'react'
import { CreateInvoice } from '@/components/Invoice'
import { taskSchema } from '../item/data/schema'
import path from 'path'
import { promises as fs } from 'fs'
import { Metadata } from 'next'
import { z } from 'zod'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.',
}

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/(protected)/item/data/tasks.json'),
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

const NewItem = async () => {
  const tasks = await getTasks()

  return (
    <div className="min-h-screen flex   bg-gray-50 py-2 px-2 sm:px-2 lg:px-5">
      <CreateInvoice tasks={tasks} />
    </div>
  )
}

export default NewItem
