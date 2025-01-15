'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Button } from '../../ui/button'
import { DatePicker } from '../../ui/date-picker'
import { TableFooter, TableRow, TableCell, TableHead } from '../../ui/table'

import { DataTable } from '../../task/data-table'
import PrintInvoice, { InvoiceItem } from '../../print-invoice'
import AddItemForm, { ItemFormFields } from '@/components/FormWithTable/AddItemForm/AddItemForm'
import { getCompanies } from '@/app/actions/company'
import { CompanyFormFields } from '@/components/company/AddNewCompany/AddNewCompany'

import { InvoiceFormValues, useInvoiceForm } from './useInvoiceForm'
import { useInvoiceCalculations } from './useInvoiceCalculations'
import { generateInvoiceNumber, getInvoiceItemsByInvoiceId } from '@/app/actions/invoice'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/task/data-table-column-header'
import { DataTableRowActions } from '@/components/task/data-table-row-actions'
import { saveInvoice } from '@/app/actions/invoice';

const CreateInvoice = ({invoice,invoiceId}:{invoice?:InvoiceFormValues,invoiceId?:string}) => {
  const [company, setCompany] = useState<CompanyFormFields | null>(null)
  const [editIndex, setEditIndex] = useState<undefined | number>()
  const [isCreateItemDialogVisible, setIsCreateItemDialogVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { form, onSubmit: handleFormSubmit } = useInvoiceForm({ invoice })

  const columns: ColumnDef<ItemFormFields>[] = [
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
        <DataTableColumnHeader column={column} title="No" />
      ),    
      cell: ({ row }) => (
        <div className="w-[10px]">{row.index+1}</div>
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
        <div className="w-[150px]">{row.getValue('name')}</div>
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
        <DataTableColumnHeader column={column} title="Qty." />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue('quantity')}</div>
      ),
    },
    // {
    //   accessorKey: 'discount',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Discount %" />
    //   ),
    //   cell: ({ row }) => (
    //     <div className="w-[80px]">{row.getValue('discount')}</div>
    //   ),
    // },
    {
      accessorKey: 'rate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rate" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue('rate')}</div>,
    },
    {
      accessorKey: 'tax',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tax (%)" />
      ),
      cell: ({ row }) =>{
        const rate = row.getValue('rate') as number;
        const quantity = row.getValue('quantity') as number;
        const tax = row.getValue('tax') as number;
        const taxAmount = (rate * quantity) * (tax / 100); // Calculate tax amount
        return <div className="w-[130px]"> {taxAmount.toFixed(2)} ({row.getValue('tax')}%)</div>; 
      },
    },
   
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Taxable Amt" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue('amount')}</div>,
    },
    {
      id: 'actions',
      enablePinning: true,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onDelete={(index)=> {
            setItems((prevItems) => {
              const newItems = [...prevItems]
              newItems.splice(index, 1)
              return newItems
            })}}
          editRow={(index) => {
            setEditIndex(index)
          }}
        />
      ),
    },
  ]

  const companyQuery = useQuery({
    queryKey: ['companies'],
    queryFn: () => getCompanies(),
  })

  const invoiceItemQuery = useQuery({
    queryKey: ['invoice-items'],
    queryFn: () => getInvoiceItemsByInvoiceId(invoiceId as string),
    enabled: !!invoiceId,
  });
  
  const [items, setItems] = useState<ItemFormFields[]>([]);
  
  useEffect(() => {
    if (invoiceItemQuery.data) {
      setItems(JSON.parse(invoiceItemQuery.data));
    }
  }, [invoiceItemQuery.data]);
  
  const { 
    totalAmount, totalRate, totalQuantity, tax:totalTax, totalGrossAmt, 
    gstTaxAmount, totalPayableAmount 
  } = useInvoiceCalculations(items)


  const companies = useMemo(() => {
    if (companyQuery?.data && companyQuery?.data?.length) {
      return JSON.parse(companyQuery.data)
    }
    return []
  }, [companyQuery.data])

  const handleCompanyChange = useCallback(
    (id: string) => {
      const selectedCompany = companies.find((item: CompanyFormFields) => item.id === id)
      setCompany(selectedCompany || null)
      form.setValue('company',selectedCompany.name)
    },
    [companies,form]
  )

  const {  isLoading: isInvoiceLoading } = useQuery<string, Error>({
    queryKey: ['generateInvoiceNumber'],
    queryFn: async () => {
      const response = await generateInvoiceNumber();
      form.setValue('invoiceNo', response.invoiceNo);
      return Promise.resolve(response.invoiceNo);
    },
    enabled: !invoice
  });

  const onAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEditIndex(undefined)
    event.preventDefault()
    setIsCreateItemDialogVisible(true)
  }

  const handleAddItemSubmit = (data: ItemFormFields) => {
    setEditIndex(undefined)
    setIsCreateItemDialogVisible(false)
    setItems([data, ...items])
  }

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsSaving(true);
    setError(null);

    try {
      const invoiceData = {
        ...data,
        company:company?.id as string,
        items,
      };
      await saveInvoice(invoiceData);
      // console.log('Invoice saved successfully:', result);
    } catch (err) {
      console.error('Error saving invoice:', err);
      setError('Failed to save invoice. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
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
          invoiceNo={form.getValues('invoiceNo')}
          ewayNo={form.getValues('ewayNo')}
          transport={form.getValues('transport')}
          vehicleNo={form.getValues('vehicleNo')}
          invoiceDate={form.getValues('invoiceDate')}
          discountedPrice={new Intl.NumberFormat('en-IN').format(totalTax)}
          totalPayableAmount={new Intl.NumberFormat('en-IN').format(totalPayableAmount)}
          gstTaxAmount={new Intl.NumberFormat('en-IN').format(gstTaxAmount)}
          company={company || undefined}
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="invoiceNo"
              render={({ field }) => (
                <FormItem className='relative '> 
                  <FormLabel>Invoice No</FormLabel>
                  <FormControl>
                    <Input className="w-full" {...field} disabled={isInvoiceLoading} />
                  </FormControl>
                  {isInvoiceLoading && <Loader2 className="h-5 w-5 text-primary/60 animate-spin absolute top-1/2 right-2" />}

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
                      {companyQuery.isLoading ? (
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
            <FormField
              control={form.control}
              name="ewayNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>eWay No</FormLabel>
                  <FormControl>
                    <Input className="w-full" {...field} placeholder="Enter eWay No" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle No</FormLabel>
                  <FormControl>
                    <Input className="w-full" {...field} placeholder="Enter Vehicle No" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transport</FormLabel>
                  <FormControl>
                    <Input className="w-full" {...field} placeholder="Enter Transport Details" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="hidden flex-1 flex-col space-y-8 md:flex h-auto">
            <DataTable
              data={items}
              columns={columns}
              onAddRow={onAddRow}
              tableFooter={
                items.length > 0 ? (
                  <TableFooter>
                    <InvoiceTotalsRow
                      totalQuantity={totalQuantity}
                      totalAmount={totalAmount}
                      totalTax={totalTax}
                    />
                    {/* <GSTRow gstTaxAmount={gstTaxAmount} columnsLength={columns.length} /> */}
                    <TotalPayableRow
                      totalPayableAmount={totalPayableAmount}
                      columnsLength={columns.length}
                    />
                  </TableFooter>
                ) : null
              }
            />
          </div>
          <div className="w-full flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => {/* handle draft save */}}>
              Save as draft
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

const InvoiceTotalsRow = ({ totalQuantity, totalAmount,totalTax }:{
  totalQuantity:number
  totalAmount:number
  totalTax:number
}) => (
  <TableRow>
    <TableCell colSpan={3}></TableCell>
    <TableHead>Total </TableHead>
    <TableCell className="font-normal">{new Intl.NumberFormat('en-IN').format(totalQuantity)}</TableCell>
    <TableCell className="font-normal"></TableCell>
    <TableCell className="font-normal">+{new Intl.NumberFormat('en-IN').format(totalTax)}</TableCell>
    <TableCell className="font-normal">{new Intl.NumberFormat('en-IN').format(totalAmount)}</TableCell>
  </TableRow>
)

// const GSTRow = ({ gstTaxAmount, columnsLength }) => (
//   <TableRow>
//     <TableCell colSpan={columnsLength - 3}></TableCell>
//     <TableCell className="font-normal">
//       {new Intl.NumberFormat('en-IN').format(gstTaxAmount)}
//     </TableCell>
//   </TableRow>
// )

const TotalPayableRow = ({ totalPayableAmount, columnsLength }:{totalPayableAmount:number, columnsLength:number}) => (
  <TableRow>
    <TableCell colSpan={columnsLength - 4}></TableCell>
    <TableHead className="text-right text-normal" colSpan={2}>
      Total Payable Amount
    </TableHead>
    <TableCell className="text-bold">
      ₹{new Intl.NumberFormat('en-IN').format(totalPayableAmount)}
    </TableCell>
  </TableRow>
)

export default CreateInvoice
