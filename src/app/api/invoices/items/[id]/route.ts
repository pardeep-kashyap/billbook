import { getAllItems } from "@/app/lib/dynamodb"
import { parseJwt } from "@/lib/utils"
import { marshall } from "@aws-sdk/util-dynamodb"
import { NextRequest } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
  const id = params.id
  // const authorization = request.headers.get('Authorization') ?? ''
  // const json = parseJwt(authorization)
  try {
    // Check if AWS credentials are properly configured
    if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your_aws_access_key_here') {
      console.log('AWS credentials not configured, returning mock data for invoice items:', id)
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    const result = await getAllItems({
      TableName: 'invoice-items',
      KeyConditionExpression: 'invoiceId = :invoiceId',
      IndexName: 'invoiceId-index',
      ScanIndexForward: false,
      ExpressionAttributeValues: marshall({ ':invoiceId': id }),
    })
    
    return new Response(JSON.stringify(result.items ?? []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error in GET /api/invoices/items/[id]:', error)
    // Return empty array instead of error to prevent page crash
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}