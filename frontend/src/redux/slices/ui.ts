import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type ThunkState } from '../store'
import { createThunkFactory } from '@kallinen/thunk-utility'
import { NotificationMessage } from '../../types/frontendTypes'

const { createThunks } = createThunkFactory<ThunkState>()

export interface UiState {
    loading: boolean
    notification: NotificationMessage | null
}

const initialState: UiState = {
    loading: false,
    notification: null,
}

const thunks = createThunks(
    {
        //getData: apiThunkFor(cabinApi.getData)(),
    },
    'ui'
)

const ui = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setNotification: (
            state,
            action: PayloadAction<NotificationMessage | null>
        ) => {
            state.notification = action.payload
        },
    },
})

export default ui
export const uiThunks = thunks
export const uiActions = ui.actions
