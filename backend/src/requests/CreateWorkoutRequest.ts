/**
 * Fields in a request to create a single Workout item.
 */
export interface CreateWorkoutRequest {
  workoutType: string
  workoutDate: string
  workoutDistance: number
  workoutTime: number
}

