import { NextResponse } from 'next/server'
// import { db } from '@/lib/db'

// export async function GET() {
//   try {
//     // Get the current year
//     const currentYear = new Date().getFullYear()

//     // Get the latest invoice number for the current year
//     const latestInvoice = await db.invoice.findFirst({
//       where: {
//         invoiceNo: {
//           startsWith: `INV-${currentYear}-`,
//         },
//       },
//       orderBy: {
//         invoiceNo: 'desc',
//       },
//     })

//     let newInvoiceNumber: string

//     if (latestInvoice) {
//       // Extract the numeric part and increment it
//       const latestNumber = parseInt(latestInvoice.invoiceNo.split('-')[2])
//       newInvoiceNumber = `INV-${currentYear}-${(latestNumber + 1).toString().padStart(4, '0')}`
//     } else {
//       // If no invoice exists for the current year, start with 0001
//       newInvoiceNumber = `INV-${currentYear}-0001`
//     }

//     return NextResponse.json({ invoiceNo: newInvoiceNumber })
//   } catch (error) {
//     console.error('Error generating invoice number:', error)
//     return NextResponse.json({ error: 'Failed to generate invoice number' }, { status: 500 })
//   }
// }
