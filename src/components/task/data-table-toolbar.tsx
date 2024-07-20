"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { Icons } from "../icons";
import { ROUTE_CONSTANTS } from "@/constants/routeConstants";
import { useRouter } from "next/navigation";
const routes = {
  [ROUTE_CONSTANTS.INVOICE]: ROUTE_CONSTANTS.NEW_INVOICE,
};
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onAddRow: (evt: React.MouseEvent<HTMLButtonElement>) => void;
}

export function DataTableToolbar<TData>({
  table,
  onAddRow,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const router = useRouter();

  const handleAddNewItem = (evt: React.MouseEvent<HTMLButtonElement>) => {
    if (routes[window.location.pathname]) {
      router.push(routes[window.location.pathname]);
      return;
    }
    onAddRow(evt);
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          // value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          // onChange={(event) =>
          //   table.getColumn("title")?.setFilterValue(event.target.value)
          // }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )} */}
        {/* {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />

      <Button
        variant="outline"
        size="sm"
        className="ml-auto hidden h-8 lg:flex ml-2"
        onClick={handleAddNewItem}
      >
        <Icons.addCircle className="mr-2 h-4 w-4" />
        Add
      </Button>
    </div>
  );
}
