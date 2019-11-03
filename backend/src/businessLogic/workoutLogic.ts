import * as uuid from 'uuid'
import { WorkoutItem } from '../models/WorkoutItem'
import { parseUserId } from '../auth/utils'
import { WorkoutAccess } from '../dataLayer/workoutAccess'
import { createLogger } from '../utils/logger'
import { CreateWorkoutRequest } from '../requests/CreateWorkoutRequest'
import { UpdateWorkoutRequest } from '../requests/UpdateWorkoutRequest'

const workoutAccess = new WorkoutAccess()

export async function createWorkout(
  newWorkout: CreateWorkoutRequest,
  authorization: string
): Promise<WorkoutItem> {
  const logger = createLogger('createWorkout')
  
  //Get Unique ID for new To Do
  const newWorkoutId = uuid.v4()
  
  const userId = getUserIdFromToken(authorization)
  
  const pace = calculatePace(newWorkout.workoutTime, newWorkout.workoutDistance)
  
  logger.info('CreateWorkout', newWorkout)
  

  const item: WorkoutItem = {
    workoutId: newWorkoutId,
    userId: userId,
    createdAt: new Date().toISOString(),
    favorite: false,
    workoutPace: pace,
    ...newWorkout
  }
  
  return await workoutAccess.createWorkout(item)
}

export async function updateWorkout(workoutId: string, 
  updatedWorkout: UpdateWorkoutRequest
){
  const pace = calculatePace(updatedWorkout.workoutTime, updatedWorkout.workoutDistance)
  updatedWorkout.workoutPace = pace
  
  await workoutAccess.updateWorkout(workoutId, updatedWorkout)
}

export async function getAllWorkoutsLogic(
  authorization: string
): Promise<WorkoutItem[]>{
  const logger = createLogger('getWorkouts')

  const userId = getUserIdFromToken(authorization)

  const items = await workoutAccess.getAllWorkouts(userId)
  logger.info('getAllWorkoutsLogic', {'items': items})
     
  return items

}

/*
calculate the minutes per mile pace for the workout to the nearest hundreth
*/
function calculatePace(wTime: number, wDistance: number): number{
  return Math.ceil((wTime / wDistance)*100) /100
}

function getUserIdFromToken(authorization: string): string{
  var userId = 'default'

  const split = authorization.split(' ')
  if (split.length > 1){
    const jwtToken = split[1]
    userId = parseUserId(jwtToken)
  }
  
  return userId
}
