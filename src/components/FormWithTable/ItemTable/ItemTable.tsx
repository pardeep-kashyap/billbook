'use client'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/task/data-table'
import AddItemForm from '../AddItemForm/AddItemForm'
import { Task } from '@/app/(protected)/item/data/schema'
import { DataTableColumnHeader } from '@/components/task/data-table-column-header'
import { DataTableRowActions } from '@/components/task/data-table-row-actions'
import { Checkbox } from '@radix-ui/react-checkbox'
import { ColumnDef } from '@tanstack/react-table'
import { ItemFormFields } from '@/components/FormWithTable/AddItemForm/AddItemForm'
import { toast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import * as actions from '@/app/actions/item'

const ItemTable = ({ data }: { data: any }) => {
  const [items, setItems] = useState<ItemFormFields[]>([])

  const [editIndex, setEditIndex] = useState<undefined | number>()

  const [isCreateItemDialogVisible, setIsCreateItemDialogVisible] =
    useState(false)

  // Mutations
  const save = useMutation({
    mutationFn: actions.save,
    onSuccess: async () => {
      toast({
        title: 'Saved!',
        description: 'Item saved successfully',
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
        <div className="w-[100px]">{row.getValue('name')}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'hsn',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="HSN Code" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue('hsn')}</div>,
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue('quantity')}</div>
      ),
    },
    {
      accessorKey: 'discount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Discount (%)" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue('discount')}</div>
      ),
    },
    {
      accessorKey: 'rate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rate" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue('rate')}</div>,
    },
    {
      id: 'actions',
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

  const handleSubmit = (data: ItemFormFields) => {
    if (editIndex !== undefined) {
      update.mutate(JSON.stringify({ ...data, id: items[editIndex].id }))
      return
    }
    save.mutate(JSON.stringify({ ...data }))
    setIsCreateItemDialogVisible(false)
  }

  useEffect(() => {
    setItems(data)
  }, [data])

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <AddItemForm
        isOpen={isCreateItemDialogVisible}
        setOpen={setIsCreateItemDialogVisible}
        value={editIndex !== undefined ? items[editIndex] : undefined}
        onSubmit={handleSubmit}
        isSubmitting={update.isPending || save.isPending}
      />
      <DataTable data={items} columns={columns} onAddRow={onAddRow} />
    </div>
  )
}
export default ItemTable
