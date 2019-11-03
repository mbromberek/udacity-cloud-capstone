import { apiEndpoint } from '../config'
import { WorkoutItem } from '../types/WorkoutItem';
import { CreateWorkoutRequest } from '../types/CreateWorkoutRequest';
import Axios from 'axios'
import { UpdateWorkoutRequest } from '../types/UpdateWorkoutRequest';

export async function getWorkouts(idToken: string): Promise<WorkoutItem[]> {
  console.log('Fetching Workouts')

  const response = await Axios.get(`${apiEndpoint}/workouts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Workouts:', response.data)
  return response.data.items
}

export async function createWorkout(
  idToken: string,
  newWorkout: CreateWorkoutRequest
): Promise<WorkoutItem> {
  const response = await Axios.post(`${apiEndpoint}/workouts`,  JSON.stringify(newWorkout), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchWorkout(
  idToken: string,
  workoutId: string,
  updatedWorkout: UpdateWorkoutRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/workouts/${workoutId}`, JSON.stringify(updatedWorkout), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteWorkout(
  idToken: string,
  workoutId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/workouts/${workoutId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  workoutId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/workouts/${workoutId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
