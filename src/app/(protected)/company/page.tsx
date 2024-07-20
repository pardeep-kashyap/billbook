import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";
import { taskSchema } from "@/app/(protected)/item/data/schema";
import AddCompany from "@/components/company/CompanyTable/CompanyTable";
import Company from "@/components/company/CompanyTable/CompanyTable";
export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.
async function getCompanies() {
  return await fetch("/api/company", {
    method: "GET",
  });

  // const tasks = JSON.parse(data.toString());

  // return z.array(taskSchema).parse(tasks);
}

export default async function Company() {
  const data = await getCompanies();
  console.log("data", data);

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <Company data={data} />
      </div>
    </>
  );
}
