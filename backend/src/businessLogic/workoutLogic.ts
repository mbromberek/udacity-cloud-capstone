import * as uuid from 'uuid'
import { WorkoutItem } from '../models/WorkoutItem'
import { parseUserId } from '../auth/utils'
import { WorkoutAccess } from '../dataLayer/workoutAccess'
import { createLogger } from '../utils/logger'
import { CreateWorkoutRequest } from '../requests/CreateWorkoutRequest'

const workoutAccess = new WorkoutAccess()

export async function createWorkout(
  newWorkout: CreateWorkoutRequest,
  authorization: string
): Promise<WorkoutItem> {
  const logger = createLogger('createWorkout')
  
  //Get Unique ID for new To Do
  const newWorkoutId = uuid.v4()
  var userId = 'default'

  const split = authorization.split(' ')
  if (split.length > 1){
    const jwtToken = split[1]
    userId = parseUserId(jwtToken)
  }
  logger.info('handler', {'userId': userId})
  
  logger.info('CreateWorkout', newWorkout)
  

  const item: WorkoutItem = {
    workoutId: newWorkoutId,
    userId: userId,
    createdAt: new Date().toISOString(),
    favorite: false,
    ...newWorkout
  }
  
  return await workoutAccess.createWorkout(item)
  

}

export async function getAllWorkoutsLogic(
  authorization: string
): Promise<WorkoutItem[]>{
  const logger = createLogger('getWorkouts')
  
  var userId = 'default'  
  const split = authorization.split(' ')
  if (split.length > 1){
    const jwtToken = split[1]
    userId = parseUserId(jwtToken)
  }
  logger.info('getAllWorkoutsLogic', {'userId': userId})

   const items = await workoutAccess.getAllWorkouts(userId)
   logger.info('getAllWorkoutsLogic', {'items': items})
   
   return items

}
