# Serverless Workouts

This application is a simple Workout tracking application using AWS Lambda and Serverless framework. 

# Functionality of the application

This application will allow creating/removing/updating/fetching Workouts. It can be used to store details about an Workouts such as distance and duration. Each Workout can have an attachment image. Each user only has access to Workouts that he/she has created.
Workouts can be favorited. When a workout is created the pace for the workout is automatically calculated. 

# Workout items

The application stores Workout items, and each Workout item contains the following fields:

* `workoutId` (string) - a unique id for a workout. System will generate
* `createdAt` (string) - date and time when an item was created
* `workoutType` (string) - type of Workout (e.g. Running, Cycling)
* `workoutDate` (string) - date and time when the Workout was performed, defaults to current date/time
* `favorite` (boolean) - true if an Workout is a favorite, false otherwise. Defaults to false
* `workoutDistance` (number) - distance for the Workout in miles
* `workoutTime` (number) - how long the Workout was for in minutes
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to an Workout
* `userId` (string) - ID of user who created the Workout and has access to view/update it


# Functions implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function implements a custom authorizer for API Gateway that all other functions use for authenticating a user access. 

* `GetWorkouts` - returns all Workouts for the current user. The user id is extracted from a JWT token that is sent by the frontend or API

It returns data that looks like this:

```json
{
  "workout": [
    {
      "workoutId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "workoutType": "Running",
      "workoutDate": "2019-07-29T20:01:45.424Z",
      "favorite": false,
      "workoutDistance": 5,
      "workoutTime": 40,
      "attachmentUrl": "http://example.com/image.png",
      "userId": "google-123456"
    },
    {
      "workoutId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "workoutType": "Running",
      "workoutDate": "2019-07-29T20:01:45.424Z",
      "favorite": true,
      "workoutDistance": 1.25,
      "workoutTime": 10,
      "attachmentUrl": "http://example.com/image.png",
      "userId": "google-123456"
    },
  ]
}
```

* `CreateWorkout` - creates a new Workout for the current user. A shape of data send by a client application to this function can be found in the `CreateWorkoutRequest.ts` file

It receives a new Workout item to be created in JSON format that looks like this:

```json
{
  "workoutType": "Running",
  "workoutDate": "2019-07-29T20:01:45.424Z",
  "workoutDistance": 1.25,
  "workoutTime": 10
}
```

It returns a new Workout item that looks like this:

```json
{
  "workout": {
    "workoutId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "workoutType": "Running",
    "workoutDate": "2019-07-29T20:01:45.424Z",
    "workoutDistance": 1.25,
    "workoutTime": 10,
    "favorite": false,
    "userId": "google-123456"
  }
}
```

* `UpdateWorkout` - updates an Workout item created by the current user. A shape of data send by a client application to this function can be found in the `UpdateWorkoutRequest.ts` file

It receives an object that contains three fields that can be updated in a TODO item:

```json
{
  "workoutType": "Running",
  "workoutDate": "2019-07-29T20:01:45.424Z",
  "workoutDistance": 1.25,
  "workoutTime": 10,
  "favorite": false
}
```

The id of the Workout that will be updated is passed as a URL parameter.

It returns an empty body.

* `DeleteWorkout` - should delete an Workout item created by the current user. Expects an id of a Workout as a URL parameter to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a Workout.

It returns a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

All necessary resources are in the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API for this project.

This frontend works with the serverless application. The `config.ts` file in the `client/src` folder configures the client application for the API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication the application is using Auth0. By updating the "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

## Logging

The code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```



# How to run the application

## Setup Account and computer
1. In AWS IAM page create an account named serverless for deploying, save the credentials shown
2. On computer install Serverless
	- `npm install -g serverless`
3. Run below command using the key and secret from the serverless account creation
	- `sls config credentials --provider aws --key <Access_Key> --secret <keyfromIAMpage> --profile serverless`


## Backend

To deploy the application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Workout application.

Once you have finished developing your application, please set `apiId` and Auth0 parameters in the `config.ts` file in the `client` folder. A reviewer would start the React development server to run the frontend that should be configured to interact with your serverless application.

# Postman collection

An alternative way to test the API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
