import { Metadata } from "next";
import Image from "next/image";
import CompanyTable from "@/components/company/CompanyTable";
import { getCompanies } from "@/app/actions/company";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default async function Company() {
  const data = JSON.parse(await getCompanies());

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <CompanyTable data={data} />
    </div>
  );
}
