'use server'

import { revalidatePath } from "next/cache";

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    await Promise.resolve({})
    // Add your authentication logic here
  } catch (error) {
    if (error) {
      switch (error) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export async function revalidateServer(path: string) {
  revalidatePath(path);
}