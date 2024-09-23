import { marshall } from '@aws-sdk/util-dynamodb';
import {
  putItem,
  deleteItem,
  getAllItems
} from '../../lib/dynamodb'; // Make sure the path is correct
import { parseJwt } from '@/lib/utils';
import { randomUUID } from 'crypto'


export async function GET(request: Request) {
  const { headers } = request
  const authorization = headers.get('Authorization') ?? ''
  const json = parseJwt(authorization);
  try {
    const result = await getAllItems({
      TableName: 'company',
      KeyConditionExpression: 'tenantId = :tenantId',
      IndexName: 'tenantId-index',
      ScanIndexForward: false,
      ExpressionAttributeValues: marshall({ ':tenantId': json.tenantId })
    });
    return new Response(JSON.stringify(result.items), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("error", error);
    return new Response(`Internal server error`, {
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(`Bad Request`, {
      status: 400,
    });
  }

  try {
    const body = await request.json();
    const { name, description } = body;
    const item = { id, name, description };

    const result = await putItem(item, 'company');
    return new Response(JSON.stringify(result), {
      status: result.statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(`Internal server error`, {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const { headers } = request

  const authorization = headers.get('Authorization') ?? ''
  const json = parseJwt(authorization);
  try {
    const body = await request.json();

    if (!body) {
      return new Response(`Bad Request`, {
        status: 400,
      });
    }

    const result = await putItem({ ...body, tenantId: json.tenantId, id: randomUUID() }, 'company');
    return Response.json({
      revalidated: true,
      result: result
    });

  } catch (error) {
    console.error(error);
    return new Response(`Internal server error`, {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const { headers } = request
  const id = searchParams.get('id');
  const authorization = headers.get('Authorization') ?? ''
  const json = parseJwt(authorization);

  if (!id) {
    return new Response(`Bad Request`, {
      status: 400,
    });
  }

  try {
    const result = await deleteItem({ id, tenantId: json.tenantId }, 'company');
    return new Response(JSON.stringify(result), {
      status: result.statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(`Internal server error`, {
      status: 500,
    });
  }
}
