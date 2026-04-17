import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type ThunkState } from '../store'
import { createThunkFactory } from '@kallinen/thunk-utility'
import { ExampleResponseDto } from '../../types/endpointTypes'
import { NotificationMessage } from '../../types/frontendTypes'

const { createThunks } = createThunkFactory<ThunkState>()

export interface UiState {
    loading: boolean
    notification: NotificationMessage | null
    someData: ExampleResponseDto[]
}

const initialState: UiState = {
    loading: false,
    notification: null,
    someData: [],
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
    // extraReducers: (builder) => {
    //     const util = sliceHelper(builder, thunks)
    //     util.mapThunksToState('fulfilled', {
    //         getData: 'someData',
    //     })
    //     builder.addMatcher(isAnyOf(thunks.getData.pending), (state) => {
    //         state.loading = true
    //     })
    //     builder.addMatcher(
    //         isAnyOf(thunks.getData.rejected, thunks.getData.fulfilled),
    //         (state) => {
    //             state.loading = false
    //         }
    //     )
    // },
})

export default ui
export const uiThunks = thunks
export const uiActions = ui.actions
