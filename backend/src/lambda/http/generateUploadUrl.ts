import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { WorkoutAccess } from '../../dataLayer/workoutAccess'
import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4' //Use Sigv4 algorithm
})
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const workoutAccess = new WorkoutAccess()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const workoutId = event.pathParameters.workoutId
  logger.info('URL Parameters', {'workout': workoutId})
  
  const validWorkoutId = await workoutAccess.workoutExists(workoutId)
  //If no records returned, return a 404 not found error
  if (!validWorkoutId){
    logger.info('invalid workoutId', {'workout': workoutId})
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'Workout does not exist'
    }
  }
  
  const attachmentUrl =  `https://${bucketName}.s3.amazonaws.com/${workoutId}`
  const url = getUploadUrl(workoutId)
  
  //Perform update
  await workoutAccess.addAttachmentUrl(workoutId, attachmentUrl)

  logger.info('uploadURL', {'url': url})
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }

}

function getUploadUrl(workoutId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: workoutId,
    Expires: urlExpiration
  })
}
