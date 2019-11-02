import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { UpdateWorkoutRequest } from '../requests/UpdateWorkoutRequest'

const XAWS = AWSXRay.captureAWS(AWS)

import { WorkoutItem } from '../models/WorkoutItem'

export class WorkoutAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly workoutTable = process.env.WORKOUTS_TABLE,
    private readonly workoutUsrIndx = process.env.WORKOUT_USR_INDX
    ) {
  }

  /*
    Get all Workouts for the passed userId
  */
  async getAllWorkouts(userId: string): Promise<WorkoutItem[]> {
    const logger = createLogger('getWorkouts')
    logger.info('getAllWorkouts Access', {'position':'start', 'userId': userId})

    const result = await this.docClient.query({
      TableName : this.workoutTable,
      IndexName : this.workoutUsrIndx,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
      }
    }).promise()
    const items = result.Items

    return items as WorkoutItem[]

  }

  /*
    Create to do in DynamoDB
  */
  async createWorkout(workoutItem: WorkoutItem): Promise<WorkoutItem> {
    await this.docClient.put({
      TableName: this.workoutTable,
      Item: workoutItem
    }).promise()

    return workoutItem
  }
  
  /*
  Check if Workout exists 
  Returns: True if Workout ID exists in database
           False if Workout ID is not found in database
*/
  async workoutExists (workoutId: string){
    // Check if passed ID exists
    const result = await this.docClient.query({
      TableName : this.workoutTable,
      KeyConditionExpression: 'workoutId = :workoutId',
      ExpressionAttributeValues: {
          ':workoutId': workoutId
      }
    }).promise()
  
    return (result.Count >0)
  }
  
  async updateWorkout(workoutId: string, updatedWorkout: UpdateWorkoutRequest): Promise<UpdateWorkoutRequest>{
    await this.docClient.update({
        TableName: this.workoutTable,
        Key:{
          "workoutId": workoutId
        },
        UpdateExpression: "set workoutDate = :workoutDate, workoutDistance = :workoutDistance, workoutTime = :workoutTime, favorite = :favorite",
        ExpressionAttributeValues: {
          ":workoutDate": updatedWorkout.workoutDate,
          ":workoutDistance": updatedWorkout.workoutDistance,
          ":workoutTime": updatedWorkout.workoutTime,
          ":favorite": updatedWorkout.favorite
        },
        ReturnValues: "UPDATED_NEW"
    }).promise()
  
    return updatedWorkout
  }

  async addAttachmentUrl(workoutId: string, attachmentUrl: string){
    await this.docClient.update({
      TableName: this.workoutTable,
      Key:{
        "workoutId": workoutId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
  }
  
  async deleteWorkout(workoutId: string){
    await this.docClient.delete({
      TableName: this.workoutTable,
      Key:{
        "workoutId": workoutId
      }
    }).promise()
  }
  
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}


