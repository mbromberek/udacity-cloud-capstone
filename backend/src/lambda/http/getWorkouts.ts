import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getAllWorkoutsLogic } from '../../businessLogic/workoutLogic'
const logger = createLogger('getWorkouts')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('handler', event)
  
  const authorization = event.headers.Authorization

  const items = await getAllWorkoutsLogic(authorization)
  logger.info('handler', {'items':items})

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }

}
