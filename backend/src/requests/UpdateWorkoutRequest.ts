/**
 * Fields in a request to update a single Workout item.
 */
export interface UpdateWorkoutRequest {
  name: string
  dueDate: string
  done: boolean
}