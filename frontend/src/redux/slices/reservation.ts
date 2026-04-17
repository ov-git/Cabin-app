import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { cabinApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory, sliceHelper } from '@kallinen/thunk-utility'
import { ExampleReservationResponseDto } from '../../types/endpointTypes'
import {
    CRUD,
    Pagination,
    ReservationHeader,
    Sorting,
} from '../../types/frontendTypes'

const { createThunks, apiThunkFor } = createThunkFactory<ThunkState>()

export interface ReservationState {
    loading: boolean
    reservations: ExampleReservationResponseDto[]
    selectedReservationId: number
    selectedReservationOperation: CRUD | null
    sorting: Sorting
    pagination: Pagination
}

const initialState: ReservationState = {
    loading: false,
    reservations: [],
    selectedReservationId: -1,
    selectedReservationOperation: null,
    sorting: {
        order: 'desc',
        orderBy: ReservationHeader.ReservationNumber,
    },
    pagination: { count: 10, limit: 10, offset: 0, total: 0 },
}

const thunks = createThunks(
    {
        getReservations: apiThunkFor(cabinApi.getReservations)(),
    },
    'reservation'
)

const reservation = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        setSorting: (state, action: PayloadAction<Sorting>) => {
            state.sorting = action.payload
        },
        resetSorting: (state) => {
            state.sorting = initialState.sorting
        },
        setPagination: (state, action: PayloadAction<Pagination>) => {
            state.pagination = action.payload
        },
        setSelectedReservationId: (
            state,
            action: PayloadAction<{ id: number; operation: CRUD }>
        ) => {
            state.selectedReservationId = action.payload.id
            state.selectedReservationOperation = action.payload.operation
        },
        resetSelectedReservationId: (state) => {
            state.selectedReservationId = initialState.selectedReservationId
            state.selectedReservationOperation =
                initialState.selectedReservationOperation
        },
        setOperation: (state, action: PayloadAction<CRUD>) => {
            state.selectedReservationOperation = action.payload
        },
    },
    extraReducers: (builder) => {
        const util = sliceHelper(builder, thunks)
        util.mapThunksToState('fulfilled', {
            getReservations: 'reservations',
        })
        builder.addMatcher(isAnyOf(thunks.getReservations.pending), (state) => {
            state.loading = true
        })
        builder.addMatcher(
            isAnyOf(
                thunks.getReservations.rejected,
                thunks.getReservations.fulfilled
            ),
            (state) => {
                state.loading = false
            }
        )
    },
})

export default reservation
export const reservationThunks = thunks
export const reservationActions = reservation.actions
