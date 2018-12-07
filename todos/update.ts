import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const update: APIGatewayProxyHandler = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    const dynamoDb = new DynamoDB.DocumentClient();
    if (typeof data.text !== 'string') {
        console.error('Validation Failed');
        callback(null, {statusCode: 500,
          body: `Couldn't update the todo item.`
      });
    }

    const defaultChecked: any = false;

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
          },
          ExpressionAttributeNames: {
            '#todo_text': 'text',
          },
          ExpressionAttributeValues: {
            ':text': data.text,
            ':checked': data.checked | defaultChecked,
            ':updatedAt': timestamp,
          },
          UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
          ReturnValues: 'ALL_NEW',
      };

    // write the todo to the database
  dynamoDb.update(params, (error, data): any => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {statusCode: 500,
                        body: `Couldn't update the todo item.`
                    });
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
    callback(null, response);;
  });
  }