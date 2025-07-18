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
    return { tenantId: "1234567890" } // Default fallback
  }
  
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/, '')
    const parts = cleanToken.split('.')
    
    if (parts.length !== 3) {
      console.warn('Invalid JWT format, using fallback')
      return { tenantId: "1234567890" }
    }
    
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    
    // Add padding if needed
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=')
    
    return JSON.parse(atob(padded))
  } catch (error) {
    console.error('JWT parsing error:', error)
    return { tenantId: "1234567890" } // Default fallback
  }
}
