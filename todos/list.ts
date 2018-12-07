import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

export const list: APIGatewayProxyHandler = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const dynamoDb = new DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
      };

    // write the todo to the database
  dynamoDb.scan(params, (error, data:DynamoDB.DocumentClient.ScanOutput): any => {
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
      body: JSON.stringify(data.Items),
    };
    callback(null, response);
  });
  }