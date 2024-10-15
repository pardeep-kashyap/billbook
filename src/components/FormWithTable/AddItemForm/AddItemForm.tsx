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
import { Button } from '../../ui/button'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { getItems } from '@/app/actions/item'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { HSN_CODES } from '@/constants/micx'

export const itemFormSchema = z.object({
  name: z.string({ required_error: 'Please provide name' }).min(1, {
    message: 'Please provide name',
  }),
  quantity: z.coerce
    .number({
      required_error: 'Please provide quantity',
    })
    .min(1, 'Please provide quantity'),
  hsn: z.string({
    required_error: 'Please provide HSN code',
  }),
  rate: z.coerce
    .number({
      required_error: 'Please provide Rate',
    })
    .positive({
      message: 'Please provide Rate',
    })
    .min(1, 'Please provide Rate'),
  description: z.string().optional(),
  discount: z.coerce
    .number({
      required_error: 'Please provide discount',
    })
    .positive({
      message: 'Please provide discount',
    })
    .min(1, 'Please provide discount')
    .min(0, 'Please provide discount')
    .max(100)
    .optional(),
  amount: z.number().positive().min(0).optional(),
  grossTotalAmount: z.number().positive().min(0).optional(),
  discountAmount: z.number().optional(),
  tax: z.number().optional(),
  id: z.string().optional(),
})

export type ItemFormFields = z.infer<typeof itemFormSchema>

const defaultValues: Partial<ItemFormFields> = {
  name: undefined,
  id: '',
  quantity: 0,
  hsn: undefined,
  rate: undefined,
  tax: undefined,
  description: undefined,
}

const AddItemForm = ({
  isOpen,
  isSubmitting,
  setOpen,
  onSubmit,
  value,
  readOnly,
}: {
  isOpen?: boolean
  readOnly: boolean
  isSubmitting?: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onSubmit: (data: ItemFormFields) => void
  value: Partial<ItemFormFields> | undefined
}) => {
  const form = useForm<ItemFormFields>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: value ?? defaultValues,
    mode: 'onBlur',
    disabled: isSubmitting,
  })

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(),
    enabled: readOnly,
  })

  const items = useMemo(() => {
    if (data && data.length) {
      return JSON.parse(data)
    }
    return []
  }, [data])

  const getAmount = useCallback(
    ({
      rate,
      discount,
      quantity,
    }: {
      rate: number
      discount: number
      quantity: number
    }) => {
      if (!isNaN(rate) && !isNaN(discount) && !isNaN(quantity)) {
        const grossAmount = rate * quantity
        const discountAmount = (grossAmount * discount) / 100
        return {
          grossTotalAmount: grossAmount,
          discountAmount: discountAmount,
          amount: grossAmount - discountAmount,
        }
      }
      return { grossTotalAmount: 0, discountAmount: 0, amount: 0 }
    },
    []
  )

  const handleSubmit = (data: ItemFormFields) => {
    // if (!data.name) {
    onSubmit(data)
    // }
  }

  const updateCalculations = useCallback(() => {
    const rate = Number(form.getValues('rate')) || 0
    const discount = Number(form.getValues('discount')) || 0
    const quantity = Number(form.getValues('quantity')) || 0
    const { grossTotalAmount, discountAmount, amount } = getAmount({
      rate,
      discount,
      quantity,
    })
    form.setValue('grossTotalAmount', grossTotalAmount)
    form.setValue('discountAmount', discountAmount)
    form.setValue('amount', amount)
  }, [form, getAmount])

  const handleCompanyChange = useCallback(
    (id: string) => {
      const selectedItem = items.find((item: ItemFormFields) => item.id === id)
      if (selectedItem) {
        form.reset({ ...selectedItem, quantity: 0 })
        updateCalculations()
      }
    },
    [items, form, updateCalculations]
  )

  useEffect(() => {
    if (value) {
      form.reset(value)
      updateCalculations()
    }
  }, [form, value, updateCalculations])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Items</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Name</FormLabel>
                  {readOnly ? (
                    <Select
                      onValueChange={handleCompanyChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Item Name" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoading ? (
                          <div className="flex justify-center items-center h-28">
                            <Loader2 className="h-5 w-5 text-primary/60 animate-spin" />
                          </div>
                        ) : (
                          items.map((item: ItemFormFields) => (
                            <SelectItem key={item.id} value={item.id as string}>
                              {item.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl>
                      <Input placeholder="Enter an item name" {...field} />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hsn"
              disabled={readOnly}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN Code</FormLabel>
                  {readOnly ? (
                    <FormControl>
                      <Input type="text" {...field} value={field.value} />
                    </FormControl>
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={readOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select HSN Code" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HSN_CODES.map((code) => (
                          <SelectItem value={code} key={code}>
                            {code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Quantity"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        updateCalculations()
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Rate"
                      {...field}
                      disabled={readOnly}
                      onChange={(e) => {
                        field.onChange(e)
                        updateCalculations()
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              disabled={readOnly}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount(%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      disabled={readOnly}
                      onChange={(e) => {
                        field.onChange(e)
                        updateCalculations()
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {readOnly && (
              <FormField
                control={form.control}
                name="discountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {readOnly && (
              <FormField
                control={form.control}
                name="grossTotalAmount"
                disabled={readOnly}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross Total Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {readOnly && (
              <FormField
                control={form.control}
                name="amount"
                disabled={readOnly}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              disabled={readOnly}
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about item" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              <Button variant="secondary" className="col-span-full w-20">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="col-span-full w-20"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddItemForm
