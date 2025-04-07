import { revalidateTag } from "next/cache";

const AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.8_3wpqehzTXfBzUmhgusfhUNDo15mi0EejjdlNqHwn4"

// Use absolute URL with proper protocol
const baseUrl = process.env.URL || 'http://localhost:3000';
const endpoint = `${baseUrl}/api/invoices`;

export const generateInvoiceNumber = async () => {
  const invoiceNo = 'INV-' + Math.floor(Math.random() * 10000);
  return Promise.resolve({ invoiceNo })
}

export const saveInvoice = async (invoiceData:any) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      throw new Error(`Failed to save invoice: ${response.statusText}`);
    }
    
    revalidateTag('invoices');
    const text = await response.text();
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
};

export async function getInvoices() {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
      next: { tags: ['Invoices'] },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error('Error in getInvoices:', error);
    throw error;
  }
}

export async function getInvoicesById(id:string) {
  try {
    const response = await fetch(`${endpoint}/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error('Error in getInvoicesById:', error);
    throw error;
  }
}

export async function getInvoiceItemsByInvoiceId(id:string) {
  try {
    const response = await fetch(`${endpoint}/items/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error('Error in getInvoiceItemsByInvoiceId:', error);
    throw error;
  }
}
