import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { WorkoutAccess } from '../../dataLayer/workoutAccess'

const workoutAccess = new WorkoutAccess()

const logger = createLogger('deleteWorkout')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //Get Workout ID from URL path
  const workoutId = event.pathParameters.workoutId
  logger.info('URL Parameters', {'workout': workoutId})
  
  //Perform delete
  await workoutAccess.deleteWorkout(workoutId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }

}
