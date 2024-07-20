"use client";
import { useState } from "react";
import { DataTable } from "@/components/task/data-table";
import AddItemForm from "../AddItemForm/AddItemForm";
import { Task } from "@/app/(protected)/item/data/schema";
import { DataTableColumnHeader } from "@/components/task/data-table-column-header";
import { DataTableRowActions } from "@/components/task/data-table-row-actions";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

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
const ItemTable = ({ data }: { data: any }) => {
  const [companies, setCompanies] = useState<ItemFormValues[]>([]);
  const [editIndex, setEditIndex] = useState<undefined | number>();

  const [isCreateItemDialogVisible, setIsCreateItemDialogVisible] =
    useState(false);
  const [companyForm, setCompanyForm] = useState(defaultValues);

  const editRow = (row: any, index: number) => {
    setEditIndex(index);
    setIsCreateItemDialogVisible(true);
  };
  const handleDeleteRow = (index: number) => {
    const tempItems = [...companies];
    tempItems.splice(index, 1);
    setCompanies(tempItems);
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div className="w-[20px]">{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
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
      accessorKey: "unit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("unit")}</div>,
    },
    {
      accessorKey: "rate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rate" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("rate")}</div>,
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
  const onAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsCreateItemDialogVisible(!isCreateItemDialogVisible);
  };

  const handleSubmit = (data: ItemFormValues) => {};
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <AddItemForm
        isOpen={isCreateItemDialogVisible}
        setOpen={setIsCreateItemDialogVisible}
        defaultValues={companyForm}
        onSubmit={handleSubmit}
      />
      <DataTable data={companies} columns={columns} onAddRow={onAddRow} />
    </div>
  );
};
export default ItemTable;
