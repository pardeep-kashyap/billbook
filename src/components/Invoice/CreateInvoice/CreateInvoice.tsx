"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { toast } from "../../ui/use-toast";
import { Button } from "../../ui/button";
import { DataTable } from "../../task/data-table";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Task } from "@/app/(protected)/item/data/schema";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../task/data-table-column-header";
import { DataTableRowActions } from "../../task/data-table-row-actions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { DatePicker } from "../../ui/date-picker";
import { TableFooter, TableRow, TableCell, TableHead } from "../../ui/table";
import PrintInvoice from "../../print-invoice";
import {
  ItemFormValues,
  itemFormSchema,
} from "@/components/FormWithTable/ItemTable/ItemTable";

const profileFormSchema = z.object({
  company: z
    .string({
      required_error: "Company name is required.",
    })
    .min(1, {
      message: "Company is required.",
    })
    .max(30, {
      message: "Company must not be longer than 30 characters.",
    }),
  invoiceNo: z
    .string({
      required_error: "Invoice No is required.",
    })
    .min(1, {
      message: "Invoice No is required.",
    })
    .max(30, {
      message: "Invoice No must not be longer than 30 characters.",
    }),

  invoiceDate: z.date({
    required_error: "Invoice Date is required.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultInvoiceValues: Partial<ProfileFormValues> = {
  company: "",
  invoiceDate: new Date(),
  invoiceNo: "",
};

const AddItemForm = ({
  isOpen,
  setOpen,
  onSubmit,
  defaultValues,
}: {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSubmit: (data: ItemFormValues) => void;
  defaultValues: Partial<ItemFormValues>;
}) => {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues,
    mode: "onChange",
  });
  const quantityRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (data: ItemFormValues) => {
    form.reset();
    onSubmit(data);
  };

  const getAmount = ({
    quantityType,
    rate,
    discount,
  }: {
    quantityType: number;
    rate: number;
    discount: number;
  }) => {
    if (discount && !isNaN(quantityType) && !isNaN(rate) && !isNaN(discount)) {
      const discountedPrice = (quantityType * rate * discount) / 100;
      if (!isNaN(discountedPrice)) {
        return discountedPrice;
      } else {
        return 0; // Default to 0 if the calculation is invalid
      }
    } else {
      return 0; // Default to 0 if any of the values are invalid
    }
  };

  useEffect(() => {
    const quantityType = Number(quantityRef?.current?.value) ?? 0;
    const rate = Number(rateRef?.current?.value) ?? 0;
    const discount = Number(discountRef?.current?.value) ?? 0;
    form.setValue("grossTotalAmount", rate * quantityType);

    if (quantityType && rate && discount) {
      const discountAmount = Number(
        getAmount({
          quantityType,
          rate,
          discount,
        }).toFixed(2)
      );
      form.setValue("discountAmount", discountAmount);
      form.setValue("amount", quantityType * rate - discountAmount);
    }
  }, [
    rateRef?.current?.value,
    discountRef?.current?.value,
    quantityRef?.current?.value,
    form,
  ]);
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle>Add Items</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-2 gap-5"
          >
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={defaultValues.itemName}
                      placeholder="Enter an item name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hsnCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN Code</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={defaultValues.hsnCode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select HSN Code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="kg">123</SelectItem>
                      <SelectItem value="perItem">1234</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      defaultValue={defaultValues.quantityType}
                      placeholder="Enter Quantity"
                      {...field}
                      ref={quantityRef}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount(%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Discount"
                      defaultValue={defaultValues.discount}
                      {...field}
                      ref={discountRef}
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
                      defaultValue={defaultValues.rate}
                      {...field}
                      ref={rateRef}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grossTotalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gross Total Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled
                      defaultValue={defaultValues.grossTotalAmount}
                      placeholder="Amount"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discounted Amount</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="number"
                      defaultValue={defaultValues.discountAmount}
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="number"
                      defaultValue={defaultValues.amount}
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div></div>
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const CreateInvoice = ({ tasks }: { tasks: any }) => {
  const [items, setItems] = useState<ItemFormValues[]>([]);
  const [editIndex, setEditIndex] = useState<undefined | number>();

  const [isCreateItemDialogVisible, setIsCreateItemDialogVisible] =
    useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultInvoiceValues,
    mode: "onChange",
  });

  const editRow = (row: any, index: number) => {
    setEditIndex(index);
    setIsCreateItemDialogVisible(true);
  };
  const handleDeleteRow = (index: number) => {
    const tempItems = [...items];
    tempItems.splice(index, 1);
    setItems(tempItems);
  };

  const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
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
      accessorKey: "itemNo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="No." />
      ),
      cell: ({ row }) => <div className="w-[20px]">{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "itemName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue("itemName")}</div>
      ),
    },
    {
      accessorKey: "hsnCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="HSN Code" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue("hsnCode")}</div>
      ),
    },
    {
      accessorKey: "quantityType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Qty" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue("quantityType")}</div>
      ),
    },

    {
      accessorKey: "rate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rate ₹" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> {row.getValue("rate")}</div>
      ),
    },
    {
      accessorKey: "grossTotalAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gross Amt ₹" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> {row.getValue("grossTotalAmount")}</div>
      ),
    },
    {
      accessorKey: "discountAmount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Discount Amt ₹" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> -{row.getValue("discountAmount")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount ₹" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> {row.getValue("amount")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onDelete={handleDeleteRow}
          editRow={editRow}
        />
      ),
    },
  ];

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const onAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsCreateItemDialogVisible(!isCreateItemDialogVisible);
  };

  const handleAddItemSubmit = (data: ItemFormValues) => {
    setEditIndex(undefined);
    setIsCreateItemDialogVisible(!isCreateItemDialogVisible);
    setItems([data, ...items]);
  };

  const calculateTotal = (
    dateItems: ItemFormValues[],
    property: keyof ItemFormValues
  ) => {
    return Number(
      dateItems
        .reduce((total, row) => {
          const value = row[property];
          return total + (typeof value === "number" ? value : 0); // Ensure value is a number
        }, 0)
        .toFixed(2)
    );
  };

  const totalAmount = calculateTotal(items, "amount");
  const totalRate = calculateTotal(items, "rate");
  const totalQuantity = calculateTotal(items, "quantityType");
  const totalDiscount = calculateTotal(items, "discountAmount");
  const totalGrossAmt = calculateTotal(items, "grossTotalAmount");

  const gstTaxAmount = (totalAmount * 18) / 100;

  const totalPayableAmount = Number((totalAmount + gstTaxAmount).toFixed(2));

  return (
    <div className="flex flex-col	w-full">
      <AddItemForm
        defaultValues={
          editIndex !== undefined
            ? items[editIndex]
            : {
                itemName: undefined,
                quantityType: undefined,
                hsnCode: undefined,
                unit: undefined,
                rate: undefined,
                description: undefined,
                amount: undefined,
                discount: undefined,
                discountAmount: undefined,
                grossTotalAmount: undefined,
              }
        }
        isOpen={isCreateItemDialogVisible}
        onSubmit={handleAddItemSubmit}
        setOpen={setIsCreateItemDialogVisible}
      />
      <div className="flex justify-end">
        <PrintInvoice
          items={items}
          total={new Intl.NumberFormat("en-IN").format(totalAmount)}
          invoiceNo={Math.random().toString()}
          date={new Date().toDateString()}
          discountedPrice={new Intl.NumberFormat("en-IN").format(totalDiscount)}
          totalPayableAmount={new Intl.NumberFormat("en-IN").format(
            totalAmount
          )}
          gstTaxAmount={new Intl.NumberFormat("en-IN").format(totalAmount)}
          company={"TEST"}
        />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full "
        >
          <div>
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Company Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="kg">KG</SelectItem>
                      <SelectItem value="perItem">Per Item</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2		">
            <FormField
              control={form.control}
              name="invoiceNo"
              render={({ field }) => (
                <FormItem className="w-3/6">
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
                        {new Intl.NumberFormat("en-IN").format(totalQuantity)}
                      </TableCell>
                      <TableCell className="font-normal">
                        {new Intl.NumberFormat("en-IN").format(totalRate)}
                      </TableCell>
                      <TableCell className="font-normal">
                        -{new Intl.NumberFormat("en-IN").format(totalGrossAmt)}
                      </TableCell>
                      <TableCell className="font-normal">
                        -{new Intl.NumberFormat("en-IN").format(totalDiscount)}
                      </TableCell>
                      <TableCell className="font-normal">
                        {new Intl.NumberFormat("en-IN").format(totalAmount)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={columns.length - 3}></TableCell>
                      <TableHead className="text-right">
                        GST @18%<span className="text-xs block	">cgst @9%</span>
                        <span className="text-xs block	">sgst @9%</span>
                      </TableHead>
                      <TableCell className="font-normal">
                        {new Intl.NumberFormat("en-IN").format(gstTaxAmount)}
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
                        {new Intl.NumberFormat("en-IN").format(
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
  );
};

export default CreateInvoice;
