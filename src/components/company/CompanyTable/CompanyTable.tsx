'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/task/data-table'
import AddCompany, { CompanyFormFields } from '../AddNewCompany/AddNewCompany'
import { Task } from '@/app/(protected)/item/data/schema'
import { DataTableColumnHeader } from '@/components/task/data-table-column-header'
import { DataTableRowActions } from '@/components/task/data-table-row-actions'
import { Checkbox } from '@radix-ui/react-checkbox'
import { ColumnDef } from '@tanstack/react-table'
import { useMutation } from '@tanstack/react-query'
import * as actions from '@/app/actions/company'
import { toast } from '@/components/ui/use-toast'

const CompanyTable = ({ data }: { data: any[] }) => {
  const [companies, setCompanies] = useState<CompanyFormFields[]>([])

  const [editIndex, setEditIndex] = useState<undefined | number>()

  const [isCreateItemDialogVisible, setIsCreateItemDialogVisible] =
    useState(false)

  // Mutations
  const save = useMutation({
    mutationFn: actions.save,
    onSuccess: async () => {
      toast({
        title: 'Saved!',
        description: 'Company saved successfully',
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

  const update = useMutation({
    mutationFn: actions.update,
    onSuccess: async () => {
      setIsCreateItemDialogVisible(false)
      setEditIndex(undefined)
      toast({
        title: 'Updated!',
        description: 'Row saved successfully',
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
    setEditIndex(index)
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] line-clamp-1">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'gstin',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GST" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] line-clamp-1">{row.getValue('gstin')}</div>
      ),
    },
    {
      accessorKey: 'contactNo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact No." />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] line-clamp-1">
          {row.getValue('contactNo')}
        </div>
      ),
    },
    {
      accessorKey: 'address',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px] line-clamp-1">{row.getValue('address')}</div>
      ),
    },

    {
      accessorKey: 'pincode',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pincode" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px] line-clamp-1">{row.getValue('pincode')}</div>
      ),
    },

    {
      accessorKey: 'city',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="City" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px] line-clamp-1"> {row.getValue('city')}</div>
      ),
    },
    {
      accessorKey: 'state',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px] line-clamp-1"> {row.getValue('state')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px] line-clamp-1">
          {row.getValue('description')}
        </div>
      ),
    },
    {
      accessorKey: 'bankName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bank Name" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] line-clamp-1">{row.getValue('bankName')}</div>
      ),
    },
    {
      accessorKey: 'branchName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Branch Name" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] line-clamp-1">{row.getValue('branchName')}</div>
      ),
    },
    {
      accessorKey: 'accountNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account Number" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] line-clamp-1">{row.getValue('accountNumber')}</div>
      ),
    },
    {
      accessorKey: 'ifscCode',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="IFSC Code" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] line-clamp-1">{row.getValue('ifscCode')}</div>
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
    setEditIndex(undefined)
    setIsCreateItemDialogVisible(!isCreateItemDialogVisible)
  }

  const handleSubmit = (data: CompanyFormFields) => {
    if (editIndex !== undefined) {
      update.mutate(JSON.stringify({ ...data, id: companies[editIndex].id }))
      return
    }
    save.mutate(JSON.stringify({ ...data }))
    setIsCreateItemDialogVisible(false)
  }

  useEffect(() => {
    setCompanies(data)
  }, [data])

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <AddCompany
        isOpen={isCreateItemDialogVisible}
        setOpen={setIsCreateItemDialogVisible}
        value={editIndex !== undefined ? companies[editIndex] : undefined}
        onSubmit={handleSubmit}
        isSubmitting={update.isPending || save.isPending}
      />
      <DataTable data={companies} columns={columns} onAddRow={onAddRow} />
    </div>
  )
}
export default CompanyTable
