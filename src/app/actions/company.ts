'use server'

import { ROUTE_CONSTANTS } from "@/constants/routeConstants";
import { revalidatePath } from "next/cache";

const endpoint = `${process.env.URL}/api/company`

export const save = async (body: string) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization:
        `Bearer ${process.env.AUTH_TOKEN}`,
    },
    body,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok",);
  } else {
    revalidatePath(ROUTE_CONSTANTS.COMPANY)
  }

  return response.json();

}

export const update = async (body: string) => {
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      Authorization:
        `Bearer ${process.env.AUTH_TOKEN}`,
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  else {
    revalidatePath(ROUTE_CONSTANTS.COMPANY)
  }
  return response.json();
}


// Simulate a database read for tasks.
export const getCompanies = async () => {
  const data = await fetch(`${process.env.URL}/api/company`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization:
        `Bearer ${process.env.AUTH_TOKEN}`,
    },
  }).then((response) => response.json());
  return JSON.stringify(data ?? []);
}


export const remove = async (id: string) => {
  const response = await fetch(`${endpoint}?id=${id}`, {
    method: "DELETE",
    headers: {
      Authorization:
        `Bearer ${process.env.AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  } else {
    revalidatePath(ROUTE_CONSTANTS.COMPANY)
  }

  return response.json();

}