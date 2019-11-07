import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createWorkout, deleteWorkout, getWorkouts, patchWorkout } from '../api/workouts-api'
import Auth from '../auth/Auth'
import { WorkoutItem } from '../types/WorkoutItem'

interface WorkoutsProps {
  auth: Auth
  history: History
}

interface WorkoutsState {
  workouts: WorkoutItem[]
  newWorkoutType: string
  newWorkoutDistance: number
  newWorkoutTime: number
  loadingWorkouts: boolean
}

export class Workouts extends React.PureComponent<WorkoutsProps, WorkoutsState> {
  state: WorkoutsState = {
    workouts: [],
    newWorkoutType: '',
    newWorkoutDistance: 0,
    newWorkoutTime: 0,
    loadingWorkouts: true
  }

  handleWorkoutTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newWorkoutType: event.target.value })
  }

  handleWorkoutDistanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newWorkoutDistance: parseInt(event.target.value, 10) })
  }

  handleWorkoutTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newWorkoutTime: parseInt(event.target.value, 10) })
  }

  onEditButtonClick = (workoutId: string) => {
    this.props.history.push(`/workouts/${workoutId}/edit`)
  }

  onWorkoutCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newWorkout = await createWorkout(this.props.auth.getIdToken(), {
        workoutType: this.state.newWorkoutType,
        workoutDistance: this.state.newWorkoutDistance,
        workoutTime: this.state.newWorkoutTime,
        workoutDate: this.calculateWorkoutDate()
      })
      this.setState({
        workouts: [...this.state.workouts, newWorkout],
        newWorkoutType: '',
        newWorkoutDistance: 0,
        newWorkoutTime: 0
      })
    } catch {
      alert('Workout creation failed')
    }
  }

  onWorkoutDelete = async (workoutId: string) => {
    try {
      await deleteWorkout(this.props.auth.getIdToken(), workoutId)
      this.setState({
        workouts: this.state.workouts.filter(workout => workout.workoutId != workoutId)
      })
    } catch {
      alert('Workout deletion failed')
    }
  }

  onWorkoutCheck = async (pos: number) => {
    try {
      const workout = this.state.workouts[pos]
      await patchWorkout(this.props.auth.getIdToken(), workout.workoutId, {
        workoutDate: workout.workoutDate,
        favorite: !workout.favorite,
        workoutDistance: workout.workoutDistance,
        workoutTime: workout.workoutTime
      })
      this.setState({
        workouts: update(this.state.workouts, {
          [pos]: { favorite: { $set: !workout.favorite } }
        })
      })
    } catch {
      alert('Workout favorited failed')
    }
  }

  async componentDidMount() {
    try {
      const workouts = await getWorkouts(this.props.auth.getIdToken())
      this.setState({
        workouts,
        loadingWorkouts: false
      })
    } catch (e) {
      alert(`Failed to fetch workouts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">WORKOUTS</Header>

        {this.renderCreateWorkoutInput()}

        {this.renderWorkouts()}
      </div>
    )
  }

  renderCreateWorkoutInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Workout',
              onClick: this.onWorkoutCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Run"
            onChange={this.handleWorkoutTypeChange}
          />
          Distance (miles):
          <Input
            fluid
            placeholder="2"
            type="number"
            onChange={this.handleWorkoutDistanceChange}
          />
          Time (minutes):
          <Input
            fluid
            placeholder="2"
            type="number"
            onChange={this.handleWorkoutTimeChange}
          />

        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderWorkouts() {
    if (this.state.loadingWorkouts) {
      return this.renderLoading()
    }

    return this.renderWorkoutsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Workouts
        </Loader>
      </Grid.Row>
    )
  }

  renderWorkoutsList() {
    return (
      <Grid padded>
        {this.state.workouts.map((workout, pos) => {
          return (
            <Grid.Row key={workout.workoutId}>
              <Grid.Column width={2} verticalAlign="middle">
                Favorite
                <Checkbox
                  onChange={() => this.onWorkoutCheck(pos)}
                  checked={workout.favorite}
                />
              </Grid.Column>
              <Grid.Column width={2} verticalAlign="middle">
                {workout.workoutType}
              </Grid.Column>
              <Grid.Column width={2} verticalAlign="middle">
                {workout.workoutDistance} miles
              </Grid.Column>
              <Grid.Column width={2} verticalAlign="middle">
                {workout.workoutTime} minutes
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {workout.workoutPace} minutes per mile
              </Grid.Column>
              <Grid.Column width={2} verticalAlign="middle" floated="right">
                {workout.workoutDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(workout.workoutId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onWorkoutDelete(workout.workoutId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {workout.attachmentUrl && (
                <Image src={workout.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateWorkoutDate(): string {
    const date = new Date()
    date.setDate(date.getDate() )

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
