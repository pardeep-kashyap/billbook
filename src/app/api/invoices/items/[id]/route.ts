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
    const result = await getAllItems({
      TableName: 'invoice-items',
      KeyConditionExpression: 'invoiceId = :invoiceId',
      IndexName: 'invoiceId-index',
      ScanIndexForward: false,
      ExpressionAttributeValues: marshall({ ':invoiceId': id }),
    })
    return new Response(JSON.stringify(result.items??[]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
    })
  }
}