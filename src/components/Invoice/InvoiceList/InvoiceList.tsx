"use client";
import { Task } from "@/app/(protected)/item/data/schema";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../task/data-table";
import { DataTableColumnHeader } from "../../task/data-table-column-header";
import { DataTableRowActions } from "../../task/data-table-row-actions";

const InvoiceList = ({ data }: { data: any }) => {
  const editRow = (row: any, index: number) => {};
  const handleDeleteRow = (index: number) => {};

  const AddNew = () => {
    console.log("New Added");
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
      accessorKey: "company",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company Name" />
      ),
      cell: ({ row }) => <div className="w-[20px]">{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "gstNo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GST" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px]">{row.getValue("gstNo")}</div>
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

  return <DataTable data={data} columns={columns} onAddRow={AddNew} />;
};

export default InvoiceList;
