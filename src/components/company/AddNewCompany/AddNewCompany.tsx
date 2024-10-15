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
import { Textarea } from '../../ui/textarea'
import { Button } from '../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog'
import { Dispatch, SetStateAction, useEffect } from 'react'

const schema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name is required.',
    })
    .max(100, {
      message: 'Name must not be longer than 30 characters.',
    }),
  address: z
    .string()
    .min(1, {
      message: 'Address is required.',
    })
    .max(100, {
      message: 'Address must not be longer than 30 characters.',
    }),
  pincode: z
    .string()
    .min(1, {
      message: 'Pincode is required.',
    })
    .max(100, {
      message: 'Pincode must not be longer than 30 characters.',
    }),
  state: z
    .string()
    .min(1, {
      message: 'State is required.',
    })
    .max(100, {
      message: 'State must not be longer than 30 characters.',
    }),
  city: z.string().min(1, {
    message: 'City is required.',
  }),
  gst: z
    .string()
    .min(15, {
      message: 'GST should be 15 characters long.',
    })
    .max(15, {
      message: 'GST should be 15 characters long.',
    }),
  contactNo: z.string().min(10, {
    message: 'Contact should be 10 characters long.',
  }),
  description: z.string().optional(),
  id: z.string().optional(),
})

export type CompanyFormFields = z.infer<typeof schema>

// This can come from your database or API.
const defaultValues: Partial<CompanyFormFields> = {
  id: '',
  name: '',
  contactNo: '',
  address: '',
  gst: '',
  pincode: '',
  city: '',
  state: '',
  description: '',
}

const AddCompanyDialog = ({
  isOpen,
  isSubmitting,
  setOpen,
  onSubmit,
  value,
}: {
  isOpen: boolean
  isSubmitting?: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onSubmit: (data: CompanyFormFields) => void
  value: Partial<CompanyFormFields> | undefined
}) => {
  const form = useForm<CompanyFormFields>({
    resolver: zodResolver(schema),
    defaultValues: value ?? defaultValues,
    mode: 'onBlur',
    disabled: isSubmitting,
  })

  const handleSubmit = (data: CompanyFormFields) => {
    onSubmit(data)
  }

  useEffect(() => {
    form.reset(value)
  }, [form, value])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl ">
        <DialogHeader>
          <DialogTitle> Company Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-0 grid grid-cols-2	 w-full gap-3	"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gst"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> GST</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an GST no" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Contant No.</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an Contact no" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an Pincode" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an City" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> State</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an State" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us company address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about company"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div></div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default AddCompanyDialog
