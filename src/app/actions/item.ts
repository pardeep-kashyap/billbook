'use server'

import { revalidateTag } from 'next/cache'

const endpoint = `${process.env.URL}/api/item`

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
      throw new Error(`Network response was not ok: ${errorDetails}`);
    }
    revalidateTag('items')
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

  revalidateTag('items')
  return response.json() // Consume the response body
}

export async function getItems() {
  try {
    const response = await fetch(`${process.env.URL}/api/item`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      },
      next: { tags: ['items'] },
    })

 if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Network response was not ok: ${errorDetails}`);
    }


    const data = await response.json()
    return JSON.stringify(data ?? [])
  } catch (error) {
    console.error('Error in getItems:', error)
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
      throw new Error(`Network response was not ok: ${errorDetails}`);
    }

    revalidateTag('items')
    return response.json() // Consume the response body
  } catch (error) {
    console.error('Error in remove:', error)
    throw error
  }
}
