import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { reservationApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory, sliceHelper } from '@kallinen/thunk-utility'
import {
    ReservationHeader,
    CRUD,
    Pagination,
    Sorting,
} from '../../types/frontendTypes'
import { ReservationResponseDto } from '../../types/endpointTypes'
import { uiActions } from './ui'

const { createThunks, apiThunkFor } = createThunkFactory<ThunkState>()

export interface ReservationState {
    loading: boolean
    reservations: ReservationResponseDto[]
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
        orderBy: ReservationHeader.StartDate,
    },
    pagination: { count: 10, limit: 10, offset: 0, total: 0 },
}

export const thunks = createThunks(
    {
        getReservations: apiThunkFor(reservationApi.getReservations)(),
        createReservation: async (
            reservation: ReservationResponseDto,
            { rejectWithValue, dispatch }
        ) => {
            const response = await reservationApi.createReservation(reservation)
            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: 'Varaus luotu',
                        severity: 'success',
                    })
                )
                dispatch(reservationActions.resetSelectedReservationId())
                dispatch(thunks.getReservations())
                return response.data
            } else return rejectWithValue('Varauksen luominen epäonnistui.')
        },
        updateReservation: async (
            reservation: ReservationResponseDto,
            { rejectWithValue, dispatch }
        ) => {
            const response = await reservationApi.updateReservation(
                reservation.id,
                reservation
            )
            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(reservationActions.resetSelectedReservationId())
                dispatch(thunks.getReservations())
                return response.data
            } else return rejectWithValue('Varauksen muokkaus epäonnistui.')
        },
        deleteReservation: async (
            _: void,
            { rejectWithValue, dispatch, getState }
        ) => {
            const selected = getState().reservation.selectedReservationId
            const response = await reservationApi.deleteReservation(selected)

            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(reservationActions.resetSelectedReservationId())
                dispatch(thunks.getReservations())
                return response.data
            } else return rejectWithValue('Varauksen poisto epäonnistui.')
        },
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

        builder.addMatcher(
            isAnyOf(
                thunks.getReservations.pending,
                thunks.createReservation.pending,
                thunks.updateReservation.pending,
                thunks.deleteReservation.pending
            ),
            (state) => {
                state.loading = true
            }
        )

        builder.addMatcher(
            isAnyOf(
                thunks.getReservations.rejected,
                thunks.getReservations.fulfilled,
                thunks.createReservation.rejected,
                thunks.createReservation.fulfilled,
                thunks.updateReservation.rejected,
                thunks.updateReservation.fulfilled,
                thunks.deleteReservation.rejected,
                thunks.deleteReservation.fulfilled
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
