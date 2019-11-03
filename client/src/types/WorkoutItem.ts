export interface WorkoutItem {
  userId: string
  workoutId: string
  createdAt: string
  workoutType: string
  workoutDate: string
  favorite: boolean
  workoutDistance: number
  workoutTime: number
  workoutPace: number
  attachmentUrl?: string
}


