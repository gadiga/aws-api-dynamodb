import * as uuid from 'uuid';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const create: APIGatewayProxyHandler = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);
    const dynamoDb = new DynamoDB.DocumentClient();
    if (typeof data.text !== 'string') {
        console.error('Validation Failed');
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({
            message: new Error('Couldn\'t create the todo item.'),
            input: event,
          })});
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
          id: Date.now().toString(),
          text: data.text,
          checked: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      };

    // write the todo to the database
  dynamoDb.put(params, (error, data): any => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {statusCode: 500,
                        body: 'Error happened when doing something'
                    });
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
    callback(null, response);
  });
  }