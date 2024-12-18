const STRIPE_DYNAMO_HOSTING = process.env.STRIPE_DYNAMO_HOSTING;
const ROOT_URL = process.env.REACT_APP_MARKETPLACE_ROOT_URL;

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  PutCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');
const userUpdate = require('../external-app/userUpdate');
const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

exports.saveUserMe = async customerDetails => {
  let getUser = await this.getUserMe(customerDetails.username);
  if (getUser.Count > 0) {
    return { success: false, reason: 'This username already exists.' };
  }
  var params = {
    TableName: `customer_me_${STRIPE_DYNAMO_HOSTING}`,
    Item: {
      username: customerDetails.username,
      uuid: customerDetails.uuid,
    },
  };

  const command = new PutCommand(params);

  const op = await docClient.send(command);
  
  if (op['$metadata']['httpStatusCode'] == 200) {
    return userUpdate({
      id: customerDetails.uuid,
      publicData: {
        username: customerDetails.username,
      },
    });
  }

  return { success: false, data: op };
};

exports.getUserMe = async username => {
  var params = {
    TableName: `customer_me_${STRIPE_DYNAMO_HOSTING}`,
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': username,
    },
  };

  const command = new QueryCommand(params);

  const op = await docClient.send(command);

  return { success: true, data: op };
};
