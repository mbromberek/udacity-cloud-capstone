import { SNSEvent, SNSHandler, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import Jimp from 'jimp/es'
import { createLogger } from '../../utils/logger'
const logger = createLogger('editImage')

const s3 = new AWS.S3()

const imagesBucketName = process.env.IMAGES_S3_BUCKET
const updateImgBucketName = process.env.UPDATED_IMG_S3_BUCKET

export const handler: SNSHandler = async (event: SNSEvent) => {
  logger.info('Processing SNS event', event)

  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message
    logger.info('Processing S3 event', {'s3EventStr': s3EventStr})
    const s3Event = JSON.parse(s3EventStr)

    for (const record of s3Event.Records) {
      await processImage(record)
    }
  }
}

async function processImage(record: S3EventRecord) {
  const key = record.s3.object.key
  console.log('Processing S3 item with key: ', key)
  const response = await s3
    .getObject({
      Bucket: imagesBucketName,
      Key: key
    })
    .promise()
    
//   let textData = {
//     text: 'DISTANCE', //the text to be rendered on the image
//     maxWidth: 1004, //image width - 10px margin left - 10px margin right
//     maxHeight: 72+20, //logo height + margin
//     placementX: 10, // 10px in on the x axis
//     placementY: 1024-(72+20)-10 //bottom of the image: height - maxHeight - margin 
//   };

//   const font = Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
  
  const image = await Jimp.read(response.Body)
//   const body: Buffer = Buffer.from(response.Body, 'utf8')
//   const body: Buffer = response.Body
//   const image = await Jimp.read(body)
// 
  console.log('Resizing image')
  image.resize(150, Jimp.AUTO)
//   image.print(
//     font,
//     textData.placementX,
//     textData.placementY,
//     textData.text
//   )
  const convertedBuffer = await image.getBufferAsync(Jimp.AUTO)

  console.log(`Writing image back to S3 bucket: ${updateImgBucketName}`)
  await s3
    .putObject({
      Bucket: updateImgBucketName,
      Key: `${key}.jpeg`,
      Body: convertedBuffer
    })
    .promise()
}
