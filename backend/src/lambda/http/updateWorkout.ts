import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
// import * as AWS  from 'aws-sdk'
import { WorkoutAccess } from '../../dataLayer/workoutAccess'
import { updateWorkout } from '../../businessLogic/workoutLogic'
import { UpdateWorkoutRequest } from '../../requests/UpdateWorkoutRequest'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateWorkout')

const workoutAccess = new WorkoutAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //Get Workout ID from URL path
  const workoutId = event.pathParameters.workoutId
  logger.info('URL Parameters', {'workout': workoutId})
  //Get Update details from Body
  const updatedWorkout: UpdateWorkoutRequest = JSON.parse(event.body)
  logger.info('eventBody', updatedWorkout)

  const validWorkoutId = await workoutAccess.workoutExists(workoutId)
  logger.info('validWorkoutId', {'validWorkoutId': validWorkoutId})
  
  //If no records returned, return a 404 not found error
  if (!validWorkoutId){
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Workout does not exist'
    }
  }
  
  
  //Perform update
  await updateWorkout(workoutId, updatedWorkout)
//   await workoutAccess.updateWorkout(workoutId, updatedWorkout)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}

