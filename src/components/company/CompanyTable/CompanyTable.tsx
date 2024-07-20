"use client";
import { z } from "zod";

import { useState } from "react";
import { DataTable } from "@/components/task/data-table";
import AddCompany from "../AddNewCompany/AddNewCompany";
import { Task } from "@/app/(protected)/item/data/schema";
import { DataTableColumnHeader } from "@/components/task/data-table-column-header";
import { DataTableRowActions } from "@/components/task/data-table-row-actions";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(100, {
      message: "Name must not be longer than 30 characters.",
    }),
  address: z
    .string()
    .min(1, {
      message: "Address is required.",
    })
    .max(100, {
      message: "Address must not be longer than 30 characters.",
    }),
  pincode: z
    .string()
    .min(1, {
      message: "Pincode is required.",
    })
    .max(100, {
      message: "Pincode must not be longer than 30 characters.",
    }),
  state: z
    .string()
    .min(1, {
      message: "State is required.",
    })
    .max(100, {
      message: "State must not be longer than 30 characters.",
    }),
  city: z
    .string()
    .min(1, {
      message: "City is required.",
    })
    .max(100, {
      message: "City must not be longer than 30 characters.",
    }),
  gst: z
    .string()
    .min(15, {
      message: "GST should be 15 characters long.",
    })
    .max(15, {
      message: "GST should be 15 characters long.",
    }),
  description: z.string().max(160).min(4),
});

type FormValues = z.infer<typeof formSchema>;

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  name: "",
  address: "",
  gst: "",
  pincode: "",
  city: "",
  state: "",
  description: "",
};

const CompanyTable = ({ data }: { data: any }) => {
  const [companies, setCompanies] = useState<FormValues[]>([]);
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
      accessorKey: "gst",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GST" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("gst")}</div>,
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue("address")}</div>
      ),
    },

    {
      accessorKey: "pincode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pincode" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue("pincode")}</div>
      ),
    },

    {
      accessorKey: "city",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="City " />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> {row.getValue("city")}</div>
      ),
    },
    {
      accessorKey: "State",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> {row.getValue("State")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]"> -{row.getValue("description")}</div>
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
  const onAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsCreateItemDialogVisible(!isCreateItemDialogVisible);
  };

  const handleSubmit = (data: FormValues) => {};
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <AddCompany
        isOpen={isCreateItemDialogVisible}
        setOpen={setIsCreateItemDialogVisible}
        defaultValues={companyForm}
        onSubmit={handleSubmit}
      />
      <DataTable data={companies} columns={columns} onAddRow={onAddRow} />
    </div>
  );
};
export default CompanyTable;
