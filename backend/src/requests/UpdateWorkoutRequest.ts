/**
 * Fields in a request to update a single Workout item.
 */
export interface UpdateWorkoutRequest {
  workoutDate: string
  workoutDistance: number
  workoutTime: number
  favorite: boolean
}