import {
  DynamoDBClient,
  PutItemCommand,
  BatchWriteItemCommand,
  DeleteItemCommand,
  GetItemCommand,
  QueryCommand,
  QueryCommandInput,
  WriteRequest
} from '@aws-sdk/client-dynamodb'

import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'


const client = new DynamoDBClient({ region: process.env.AWS_REGION })


export const putItem = async <T>(item: T, table: string) => {
  const params = {
    TableName: table,
    Item: marshall(item)
  }

  return client.send(new PutItemCommand(params)).then(({ $metadata }) => {
    return {
      statusCode: $metadata.httpStatusCode
    }
  })
}

export const batchPutItem = async <T = unknown>(items: [string, T][]) => {
  const batch: Record<string, WriteRequest[]> = {}

  items.forEach(([table, item]) => {
    const put = { PutRequest: { Item: marshall(item) } }
    if (!batch[table]) {
      batch[table] = [put]
    } else {
      batch[table].push(put)
    }
  })

  return client.send(new BatchWriteItemCommand({ RequestItems: batch })).then(({ $metadata }) => {
    return {
      statusCode: $metadata.httpStatusCode
    }
  })
}

export const deleteItem = async <T>(item: T, table: string) => {
  const params = {
    TableName: table,
    Key: marshall(item),
    ConditionExpression: 'attribute_exists(id)'
  }

  return client
    .send(new DeleteItemCommand(params))
    .then(({ $metadata }) => {
      return {
        statusCode: $metadata.httpStatusCode
      }
    })
    .catch(({ $metadata }) => {
      return {
        statusCode: $metadata.httpStatusCode
      }
    })
}

export const getSingleItem = async <T = any>(key: T, table: string) => {
  const params = {
    TableName: table,
    Key: marshall(key),
    ConditionExpression: 'attribute_exists(id)'
  }

  return client.send(new GetItemCommand(params)).then(({ Item }) => {
    return {
      item: Item && (unmarshall(Item) as T)
    }
  })
}

export const getAllItems = async (params: QueryCommandInput) => {
  return client.send(new QueryCommand(params)).then(({ Items, LastEvaluatedKey }) => {
    return {
      items: Items && Items.map((res) => unmarshall(res)),
      lastEvaluatedKey: LastEvaluatedKey ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') : ''
    }
  })
}

export const queryPlayableUrl = async (params: QueryCommandInput) => {
  return client.send(new QueryCommand(params)).then(({ Items, LastEvaluatedKey }) => {
    return {
      items: Items && Items.map((res) => unmarshall(res)),
      lastEvaluatedKey: LastEvaluatedKey ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') : ''
    }
  })
}