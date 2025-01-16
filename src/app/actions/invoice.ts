import { revalidateTag } from "next/cache";

const AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.8_3wpqehzTXfBzUmhgusfhUNDo15mi0EejjdlNqHwn4"

const endpoint = `${process.env.URL}/api/invoices`
console.log("endpoint",endpoint)

export const generateInvoiceNumber = async () => {
  const invoiceNo = 'INV-' + Math.floor(Math.random() * 10000); // Example logic
  return Promise.resolve({ invoiceNo })
}

export const saveInvoice = async (invoiceData:any) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(invoiceData),
  });

  if (!response.ok) {
    throw new Error('Failed to save invoice');
  }
    revalidateTag('invoices')
    const text = await response.text(); // Get the response as text
    return text ? JSON.parse(text) : []; // Parse JSON if text is not empty
 
}; 


export async function getInvoices() {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
      next: { tags: ['Invoices'] },
    })
 if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${process.env.URL}`);
    }


    const text = await response.text();
    const data = text ? JSON.parse(text) : [];
    return JSON.stringify(data ?? [])
  } catch (error) {
    console.error('Error in getInvoices:', error)
    throw error
  }
}

export async function getInvoicesById(id:string) {
  try {
    const response = await fetch(`${endpoint}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      }
    })
 if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${process.env.URL}`);
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : [];
    return JSON.stringify(data ?? [])
  } catch (error) {
    console.error('Error in getInvoices:', error)
    throw error
  }
}

export async function getInvoiceItemsByInvoiceId(id:string) {
  try {
    const response = await fetch(`${endpoint}/items/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      }
    })
    console.log("response---",response)
 if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${process.env.URL}`);
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : [];
    return JSON.stringify(data ?? [])
  } catch (error) {
    console.error('Error in getInvoices:', error)
    throw error
  }
}
