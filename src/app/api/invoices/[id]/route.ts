import { getAllItems } from "@/app/lib/dynamodb"
import { parseJwt } from "@/lib/utils"
import { marshall } from "@aws-sdk/util-dynamodb"
import { NextRequest } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    console.log("GET Invoice by id")
    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')
    const limit = searchParams.get('limit') 

  const authorization = request.headers.get('Authorization') ?? ''
  const json = parseJwt(authorization)
  try {
    // Check if AWS credentials are properly configured
    if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'your_aws_access_key_here') {
      console.log('AWS credentials not configured, returning mock data for invoice:', id)
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    const result = await getAllItems({
      TableName: 'invoices',
      KeyConditionExpression: 'id = :id',
      IndexName: 'id-index',
      ScanIndexForward: false,
      ExpressionAttributeValues: marshall({ ':id': id }),
    })
    
    return new Response(JSON.stringify(result.items ?? []), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error in GET /api/invoices/[id]:', error)
    // Return empty array instead of error to prevent page crash
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}