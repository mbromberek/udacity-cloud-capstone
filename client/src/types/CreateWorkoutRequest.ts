/**
 * Fields in a request to create a single Workout item.
 */
export interface CreateWorkoutRequest {
  workoutType: string
  workoutDistance: number
  workoutTime: number
  workoutDate: string
}

