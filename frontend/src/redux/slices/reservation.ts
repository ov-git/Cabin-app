import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { reservationApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory } from '@kallinen/thunk-utility'
import {
    ReservationHeader,
    CRUD,
    Pagination,
    Sorting,
} from '../../types/frontendTypes'
import {
    PaginatedReservationResponseDto,
    ReservationRequestDto,
    ReservationResponseDto,
} from '../../types/endpointTypes'
import { uiActions } from './ui'

const { createThunks } = createThunkFactory<ThunkState>()

export interface ReservationState {
    loading: boolean
    reservations: ReservationResponseDto[]
    selectedReservationId: number
    selectedReservationOperation: CRUD | null
    sorting: Sorting
    pagination: Pagination
    overlappingReservations: ReservationResponseDto[]
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
    overlappingReservations: [],
}

export const thunks = createThunks(
    {
        getReservations: async (_: void, { rejectWithValue, getState }) => {
            const sorting = getState().reservation.sorting
            const pagination = getState().reservation.pagination
            const response = await reservationApi.getReservations(
                sorting,
                pagination
            )

            if (response.ok) {
                return response.data
            } else {
                return rejectWithValue('Varausten haku epäonnistui.')
            }
        },

        createReservation: async (
            reservation: ReservationRequestDto,
            { rejectWithValue, dispatch }
        ) => {
            const response = await reservationApi.createReservation(reservation)

            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: 'Varaus luotu.',
                        severity: 'success',
                    })
                )
                dispatch(reservationActions.resetSelectedReservationId())
                dispatch(thunks.getReservations())
                return response.data
            } else return rejectWithValue('Varauksen luominen epäonnistui.')
        },

        updateReservation: async (
            reservation: ReservationRequestDto & { id: number },
            { rejectWithValue, dispatch }
        ) => {
            const response = await reservationApi.updateReservation(reservation)

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
        checkReservationOverlap: async (
            reservation: ReservationRequestDto,
            { rejectWithValue }
        ) => {
            const response = await reservationApi.checkReservationOverlap(
                reservation
            )

            if (response.ok) {
                return response.data
            } else {
                return rejectWithValue('Varausten tarkistus epäonnistui.')
            }
        },
    },
    'reservation'
)

const reservation = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        resetOverlappingReservations: (state) => {
            state.overlappingReservations = []
        },
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
        builder.addCase(
            thunks.getReservations.fulfilled,
            (state, action: PayloadAction<PaginatedReservationResponseDto>) => {
                state.reservations = action.payload.data
                state.pagination = action.payload.pagination
            }
        )
        builder.addCase(
            thunks.checkReservationOverlap.fulfilled,
            (state, action: PayloadAction<ReservationResponseDto[]>) => {
                state.overlappingReservations = action.payload
            }
        )
        builder.addMatcher(
            isAnyOf(
                thunks.getReservations.pending,
                thunks.createReservation.pending,
                thunks.updateReservation.pending,
                thunks.deleteReservation.pending,
                thunks.checkReservationOverlap.pending
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
                thunks.deleteReservation.fulfilled,
                thunks.checkReservationOverlap.fulfilled,
                thunks.checkReservationOverlap.rejected
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
