'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/task/data-table'
import { Task } from '@/app/(protected)/item/data/schema'
import { DataTableColumnHeader } from '@/components/task/data-table-column-header'
import { DataTableRowActions } from '@/components/task/data-table-row-actions'
import { Checkbox } from '@radix-ui/react-checkbox'
import { ColumnDef } from '@tanstack/react-table'
import { useMutation } from '@tanstack/react-query'
import * as actions from '@/app/actions/company'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { ROUTE_CONSTANTS } from '@/constants/routeConstants'

const InvoiceList = ({ data }: { data: any[] }) => {
  console.log("data",data)
  const [isCreateItemDialogVisible, setIsCreateItemDialogVisible] =
    useState(false)


  // Mutations
  const deleteCompany = useMutation({
    mutationFn: actions.remove,
    onSuccess: async ({ index }: { index: number }) => {
      toast({
        title: 'Updated!',
        description: 'Row deleted successfully',
        variant: 'destructive',
      })
    },
    onError: () => {
      toast({
        title: 'Something went wrong.',
        description: 'Please refresh the page and try again.',
        variant: 'destructive',
      })
    },
  })

  const editRow = (row: any, index: number) => {
    setIsCreateItemDialogVisible(true)
  }
  const handleDeleteRow = ({ id }: { id: string }, index: number) => {
    deleteCompany.mutate(id)
  }

  const columns: ColumnDef<Task>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="w-[200px]">
         <Link className="underline" href= {`${ROUTE_CONSTANTS.INVOICE}/${row.getValue('id')}`}> {row.getValue('id')} </Link>
        </div>
      ),
    },
    {
      accessorKey: 'invoiceNo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Invoice No" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] line-clamp-1">
          {row.getValue('invoiceNo')}
        </div>
      ),
    },
    {
      accessorKey: 'company',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] line-clamp-1">{row.getValue('company')}</div>
      ),
    },
    {
      accessorKey: 'ewayNo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="E way No." />
      ),
      cell: ({ row }) => (
        <div className="w-[50px] line-clamp-1">
          {row.getValue('ewayNo')}
        </div>
      ),
    },
    // {
    //   accessorKey: 'totalAmount',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Address" />
    //   ),
    //   cell: ({ row }) => (
    //     <div className="w-[80px] line-clamp-1">
    //       {row.getValue('totalAmount')}
    //     </div>
    //   ),
    // },

    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px] line-clamp-1">
          {row.getValue('createdAt')}
        </div>
      ),
    },
    {
      id: 'actions',
      enablePinning: true,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onDelete={handleDeleteRow}
          editRow={editRow}
        />
      ),
    },
  ]

  const onAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsCreateItemDialogVisible(!isCreateItemDialogVisible)
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <DataTable data={data} columns={columns} onAddRow={onAddRow} />
    </div>
  )
}
export default InvoiceList
