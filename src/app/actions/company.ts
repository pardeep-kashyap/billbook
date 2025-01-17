'use server'

import { revalidateTag } from 'next/cache'

const endpoint = `${process.env.URL}/api/company`

export async function save(body: string) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body,
    })

     if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${JSON.stringify(response)}`);
    }
    revalidateTag('companies')
    return response.json() // Consume the response body
  } catch (error) {
    console.error('Error in save:', error)
    throw error
  }
}

export async function update(body: string) {
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body,
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  revalidateTag('companies')
  return response.json() // Consume the response body
}

export async function getCompanies() {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
      next: { tags: ['companies'] },
    })

     if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${JSON.stringify(response)}`);
    }

    const data = await response.json()
    return JSON.stringify(data ?? [])
  } catch (error) {
    console.error('Error in getCompanies:', error)
    throw error
  }
}

export async function remove(id: string) {
  try {
    const response = await fetch(`${endpoint}?id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
    })

     if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${JSON.stringify(response)}`);
    }

    revalidateTag('companies')
    return response.json() // Consume the response body
  } catch (error) {
    console.error('Error in remove:', error)
    throw error
  }
}
