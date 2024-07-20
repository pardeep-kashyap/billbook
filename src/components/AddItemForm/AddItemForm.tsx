"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Table } from "../FormWithTable";

export const itemFormSchema = z.object({
  itemName: z.string().min(1, {
    message: "Item Name is required.",
  }),
  quantityType: z.coerce.number().positive().min(1),
  hsnCode: z.string({
    required_error: "Hsn code is required.",
  }),
  rate: z.coerce
    .number({
      required_error: "Rate is required",
    })
    .positive()
    .min(1),
  description: z.string().optional(),
  discount: z.coerce.number().positive().min(1).max(100).optional(),
  unit: z.coerce.number().positive().min(1).optional(),
  amount: z.coerce.number().positive().min(0).optional(),
  grossTotalAmount: z.coerce.number().positive().min(0).optional(),
  discountAmount: z.coerce.number().positive().min(0).optional(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ItemFormValues> = {
  itemName: undefined,
  quantityType: undefined,
  hsnCode: undefined,
  unit: undefined,
  rate: undefined,
  description: undefined,
};

const Item = ({ data }) => {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ItemFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Table data={data} column={} />
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-3/5">
    //     <FormField
    //       control={form.control}
    //       name="itemName"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Item Name</FormLabel>
    //           <FormControl>
    //             <Input placeholder="Enter an item name" {...field} />
    //           </FormControl>

    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <FormField
    //       control={form.control}
    //       name="description"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Description</FormLabel>
    //           <FormControl>
    //             <Textarea
    //               placeholder="Tell us a little bit about the item"
    //               className="resize-none"
    //               {...field}
    //             />
    //           </FormControl>

    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <FormField
    //       control={form.control}
    //       name="quantityType"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Quantity Type</FormLabel>
    //           <Select onValueChange={field.onChange} defaultValue={field.value}>
    //             <FormControl>
    //               <SelectTrigger>
    //                 <SelectValue placeholder="Select Quantity Type" />
    //               </SelectTrigger>
    //             </FormControl>
    //             <SelectContent>
    //               <SelectItem value="kg">KG</SelectItem>
    //               <SelectItem value="perItem">Per Item</SelectItem>
    //             </SelectContent>
    //           </Select>
    //           {/* <FormDescription>
    //             You can manage verified email addresses in your{" "}
    //             <Link href="/examples/forms">email settings</Link>.
    //           </FormDescription> */}
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <FormField
    //       control={form.control}
    //       name="hsnCode"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>HSN Code</FormLabel>
    //           <Select onValueChange={field.onChange} defaultValue={field.value}>
    //             <FormControl>
    //               <SelectTrigger>
    //                 <SelectValue placeholder="Select HSN Code" />
    //               </SelectTrigger>
    //             </FormControl>
    //             <SelectContent>
    //               <SelectItem value="kg">123</SelectItem>
    //               <SelectItem value="perItem">1234</SelectItem>
    //             </SelectContent>
    //           </Select>
    //           {/* <FormDescription>
    //             You can manage verified email addresses in your{" "}
    //             <Link href="/examples/forms">email settings</Link>.
    //           </FormDescription> */}
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <FormField
    //       control={form.control}
    //       name="unit"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Unit</FormLabel>
    //           <FormControl>
    //             <Input type="string" placeholder="Enter unit" {...field} />
    //           </FormControl>

    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <FormField
    //       control={form.control}
    //       name="rate"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Rate</FormLabel>
    //           <FormControl>
    //             <Input type="number" placeholder="Enter Rate" {...field} />
    //           </FormControl>

    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <div></div>
    //     <Button type="submit">Save</Button>
    //   </form>
    // </Form>
  );
};

export default Item;
//
