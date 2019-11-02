import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateWorkoutRequest } from '../../requests/CreateWorkoutRequest'
import { createWorkout } from '../../businessLogic/workoutLogic'
import { createLogger } from '../../utils/logger'
const logger = createLogger('createWorkout')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('handler Start', event)

  const newWorkout: CreateWorkoutRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const item = await createWorkout(newWorkout, authorization)

  logger.info('CreateWorkout details', item)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }

}



