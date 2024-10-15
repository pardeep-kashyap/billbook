'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form'
import { Input } from '../../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { toast } from '../../ui/use-toast'
import { Button } from '../../ui/button'
import { DataTable } from '../../task/data-table'
import { useCallback, useMemo, useState } from 'react'
import { Task } from '@/app/(protected)/item/data/schema'
import { Checkbox } from '@radix-ui/react-checkbox'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../../task/data-table-column-header'
import { DataTableRowActions } from '../../task/data-table-row-actions'

import { DatePicker } from '../../ui/date-picker'
import { TableFooter, TableRow, TableCell, TableHead } from '../../ui/table'
import PrintInvoice from '../../print-invoice'
import AddItemForm, {
  ItemFormFields,
} from '@/components/FormWithTable/AddItemForm/AddItemForm'
import { useQuery } from '@tanstack/react-query'
import { getCompanies } from '@/app/actions/company'
import { CompanyFormFields } from '@/components/company/AddNewCompany/AddNewCompany'
import { Loader2 } from 'lucide-react'

const profileFormSchema = z.object({
  company: z
    .string({
      required_error: 'Company name is required.',
    })
    .min(1, {
      message: 'Company is required.',
    }),
  invoiceNo: z
    .string({
      required_error: 'Invoice No is required.',
    })
    .min(1, {
      message: 'Invoice No is required.',
    })
    .max(30, {
      message: 'Invoice No must not be longer than 30 characters.',
    }),

  invoiceDate: z.date({
    required_error: 'Invoice Date is required.',
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultInvoiceValues: Partial<ProfileFormValues> = {
  company: '',
  invoiceDate: new Date(),
  invoiceNo: '',
}

const CreateInvoice = ({ tasks }: { tasks: any }) => {
  const [items, setItems] = useState<ItemFormFields[]>([])
  const [company, setCompany] = useState<CompanyFormFields | null>(null)
  const [editIndex, setEditIndex] = useState<undefined | number>()

  const [isCreateItemDialogVisible, setIsCreateItemDialogVisible] =
    useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultInvoiceValues,
    mode: 'onChange',
  })

  const { data, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: () => getCompanies(),
  })

  const editRow = (row: any, index: number) => {
    setEditIndex(index)
    setIsCreateItemDialogVisible(true)
  }
  const handleDeleteRow = (index: number) => {
    const tempItems = [...items]
    tempItems.splice(index, 1)
    setItems(tempItems)
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
      accessorKey: 'itemNo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="No." />
      ),
      cell: ({ row }) => <div className="w-[20px]">{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue('name')}</div>,
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
        <DataTableColumnHeader column={column} title="Qty" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue('quantity')}</div>
      ),
    },

    {
      accessorKey: 'rate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rate ₹" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> {row.getValue('rate')}</div>
      ),
    },
    {
      accessorKey: 'grossTotalAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gross Amt ₹" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> {row.getValue('grossTotalAmount')}</div>
      ),
    },
    {
      accessorKey: 'discountAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Discount Amt ₹" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> -{row.getValue('discountAmount')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount ₹" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> {row.getValue('amount')}</div>
      ),
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

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const onAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditIndex(undefined)
    event.preventDefault()
    setIsCreateItemDialogVisible(!isCreateItemDialogVisible)
  }

  const handleAddItemSubmit = (data: ItemFormFields) => {
    setEditIndex(undefined)
    setIsCreateItemDialogVisible(!isCreateItemDialogVisible)
    setItems([data, ...items])
  }

  const calculateTotal = (
    dateItems: ItemFormFields[],
    property: keyof ItemFormFields
  ) => {
    return Number(
      dateItems
        .reduce((total, row) => {
          const value = row[property]
          return total + (typeof value === 'number' ? value : 0) // Ensure value is a number
        }, 0)
        .toFixed(2)
    )
  }

  const totalAmount = calculateTotal(items, 'amount')
  const totalRate = calculateTotal(items, 'rate')
  const totalQuantity = calculateTotal(items, 'quantity')
  const totalDiscount = calculateTotal(items, 'discountAmount')
  const totalGrossAmt = calculateTotal(items, 'grossTotalAmount')

  const gstTaxAmount = (totalAmount * 18) / 100

  const totalPayableAmount = Number((totalAmount + gstTaxAmount).toFixed(2))

  const companies = useMemo(() => {
    if (data && data.length) {
      return JSON.parse(data)
    }
    return []
  }, [data])

  const handleCompanyChange = useCallback(
    (id: string) => {
      if (companies?.length) {
        const selectedCompany = companies.find(
          (item: CompanyFormFields) => item.id === id
        )
        setCompany(selectedCompany || null)
      }
    },
    [companies]
  )

  return (
    <div className="flex flex-col	w-full">
      <AddItemForm
        value={editIndex !== undefined ? items[editIndex] : undefined}
        readOnly={true}
        isOpen={isCreateItemDialogVisible}
        onSubmit={handleAddItemSubmit}
        setOpen={setIsCreateItemDialogVisible}
      />
      <div className="flex justify-end">
        <PrintInvoice
          items={items}
          total={new Intl.NumberFormat('en-IN').format(totalAmount)}
          invoiceNo={'123'}
          date={new Date().toDateString()}
          discountedPrice={new Intl.NumberFormat('en-IN').format(totalDiscount)}
          totalPayableAmount={new Intl.NumberFormat('en-IN').format(
            totalAmount
          )}
          gstTaxAmount={new Intl.NumberFormat('en-IN').format(totalAmount)}
          company={company}
        />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full "
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4	">
            <FormField
              control={form.control}
              name="invoiceNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice No</FormLabel>
                  <FormControl>
                    <Input className="w-full" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <Select
                    onValueChange={handleCompanyChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isCompanyLoading ? (
                        <div className="flex justify-center items-center h-28">
                          <Loader2 className="h-5 w-5 text-primary/60 animate-spin" />
                        </div>
                      ) : (
                        companies.map((company: CompanyFormFields) => (
                          <SelectItem
                            key={company.id}
                            value={company.id as string}
                          >
                            {company.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem className="w-3/6">
                  <FormLabel>Invoice Date</FormLabel>
                  <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="hidden flex-1 flex-col space-y-8  md:flex h-auto">
            <DataTable
              data={items}
              columns={columns}
              onAddRow={onAddRow}
              tableFooter={
                items.length > 0 ? (
                  <TableFooter className="">
                    <TableRow>
                      <TableCell colSpan={3}></TableCell>
                      <TableHead>Total </TableHead>
                      <TableCell className="font-normal">
                        {new Intl.NumberFormat('en-IN').format(totalQuantity)}
                      </TableCell>
                      <TableCell className="font-normal">
                        {new Intl.NumberFormat('en-IN').format(totalRate)}
                      </TableCell>
                      <TableCell className="font-normal">
                        -{new Intl.NumberFormat('en-IN').format(totalGrossAmt)}
                      </TableCell>
                      <TableCell className="font-normal">
                        -{new Intl.NumberFormat('en-IN').format(totalDiscount)}
                      </TableCell>
                      <TableCell className="font-normal">
                        {new Intl.NumberFormat('en-IN').format(totalAmount)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={columns.length - 3}></TableCell>
                      <TableHead className="text-right">
                        GST @18%<span className="text-xs block	">cgst @9%</span>
                        <span className="text-xs block	">sgst @9%</span>
                      </TableHead>
                      <TableCell className="font-normal">
                        {new Intl.NumberFormat('en-IN').format(gstTaxAmount)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={columns.length - 4}></TableCell>
                      <TableHead
                        className="text-right text-normal "
                        colSpan={2}
                      >
                        Total Payable Amount
                      </TableHead>
                      <TableCell className="text-bold">
                        ₹
                        {new Intl.NumberFormat('en-IN').format(
                          totalPayableAmount
                        )}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                ) : undefined
              }
            />
          </div>
          <div className="w-full flex justify-end gap-2	">
            <Button variant="outline" type="submit">
              Save as draft
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateInvoice
