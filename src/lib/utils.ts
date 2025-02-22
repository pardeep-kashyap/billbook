import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function parseJwt(token: string) {
  if (!token) {
    return
  }
  const base64Url = token?.split('.')[1]

  const base64 = base64Url?.replace('-', '+')?.replace('_', '/')
  return JSON.parse(atob(base64))
}
