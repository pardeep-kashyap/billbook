import { Metadata } from "next";
import Image from "next/image";
import CompanyTable from "@/components/company/CompanyTable";
export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.
async function getCompanies() {
  const data = await fetch(`${process.env.URL}/api/company`, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.8_3wpqehzTXfBzUmhgusfhUNDo15mi0EejjdlNqHwn4",
    },
  });

  return JSON.stringify(data);
}

export default async function Company() {
  const data = await getCompanies();

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
        <CompanyTable data={data} />
      </div>
    </>
  );
}
