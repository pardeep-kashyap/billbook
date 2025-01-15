import { marshall } from '@aws-sdk/util-dynamodb'
import { putItem, getAllItems } from '../../lib/dynamodb'
import { parseJwt } from '@/lib/utils'
import { randomUUID } from 'crypto'

type InvoiceItem = {
  name: string
  hsn: string
  quantity: number
  unit: number
  rate: number
  taxableValue: number
}

export type InvoiceData = {
  company: string
  placeOfSupply: string
  invoiceNo: string
  invoiceDate: string
  items: InvoiceItem[]
  vehicleNo: string
  transport: string
  ewayNo: string
  id: string
}

export async function GET(request: Request) {
  const { headers } = request
  const authorization = headers.get('Authorization') ?? ''
  const json = parseJwt(authorization)
  try {
    const result = await getAllItems({
      TableName: 'invoices',
      KeyConditionExpression: 'tenantId = :tenantId',
      IndexName: 'tenantId-index',
      ScanIndexForward: false,
      ExpressionAttributeValues: marshall({ ':tenantId': json.tenantId }),
    })
    return new Response(JSON.stringify(result.items??[]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('error', error)
    return new Response(`Internal server error`, {
      status: 500,
    })
  }
}

export async function POST(request: Request) {
  const { headers } = request
  const authorization = headers.get('authorization') ?? ''
  const json = parseJwt(authorization)
  try {
    const body: InvoiceData = await request.json()

    if (!body) {
      return new Response(`Bad Request`, {
        status: 400,
      })
    }


    // Destructure body for better readability
    const {
      company,
      // placeOfSupply,
      invoiceNo,
      invoiceDate,
      vehicleNo,
      transport,
      ewayNo,
      items,
      id
    } = body;

    // Generate a unique invoice ID
    const invoiceId =id?? randomUUID()

    // Prepare invoice header data
    const invoiceHeader = {
      id: invoiceId,
      tenantId: json.tenantId,
      // placeOfSupply,
      company,
      invoiceNo,
      invoiceDate,
      vehicleNo,
      transport,
      ewayNo,
      createdAt: new Date().toISOString(),
    }

    console.log("invoiceHeader",invoiceHeader)
    // Save invoice header
    await putItem(invoiceHeader, 'invoices')

    // Helper function to create items
    const createItem = (item: InvoiceItem, index: number, type: string) => ({
      id: randomUUID(),
      invoiceId,
      tenantId: json.tenantId,
      ...item,
      createdAt: new Date().toISOString(),
    });

    // Save invoice items and tax summary

    const itemPromises = items.map((item, index) => putItem(createItem(item, index, 'invoice-items'), 'invoice-items'));

    // Wait for all items to be saved
    const results = await Promise.allSettled([...itemPromises]);

    // Log any errors
    results.forEach((result) => {
      if (result.status === 'rejected') {
        console.error('Error saving item:', result.reason);
      }
    });

    return Response.json({
      success: true,
      invoiceId,
      message: 'Invoice saved successfully',
    })
  } catch (error) {
    console.error('Error saving invoice:', error)
    return new Response(`Internal server error`, {
      status: 500,
    })
  }
}
