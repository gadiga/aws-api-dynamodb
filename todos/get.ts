import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const get = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const dynamoDb = new DynamoDB.DocumentClient();

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id: event.pathParameters.id,
        },
      };

    // write the todo to the database
  dynamoDb.get(params, (error, data: DynamoDB.DocumentClient.GetItemOutput): any => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {statusCode: 500,
                        body: `Couldn't get the todo item.`
                    });
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
    callback(null, response);
  });
  }