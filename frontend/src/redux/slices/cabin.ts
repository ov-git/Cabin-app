import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { cabinApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory } from '@kallinen/thunk-utility'
import {
    CabinHeader,
    CRUD,
    Pagination,
    SelectOption,
    Sorting,
} from '../../types/frontendTypes'
import {
    CabinRequestDto,
    CabinResponseDto,
    PaginatedCabinResponseDto,
} from '../../types/endpointTypes'
import { uiActions } from './ui'

const { createThunks } = createThunkFactory<ThunkState>()

export interface CabinState {
    loading: boolean
    cabins: CabinResponseDto[]
    selectedCabinId: number
    selectedCabinOperation: CRUD | null
    sorting: Sorting
    pagination: Pagination
    cabinOptions: SelectOption[]
}

const initialState: CabinState = {
    loading: false,
    cabins: [],
    selectedCabinId: -1,
    cabinOptions: [],
    selectedCabinOperation: null,
    sorting: {
        order: 'desc',
        orderBy: CabinHeader.Name,
    },
    pagination: { count: 10, limit: 10, offset: 0, total: 0 },
}

export const thunks = createThunks(
    {
        getCabins: async (_: void, { rejectWithValue, getState }) => {
            const sorting = getState().cabin.sorting
            const pagination = getState().cabin.pagination
            const response = await cabinApi.getCabins(sorting, pagination)
            if (response.ok) {
                return response.data
            } else {
                return rejectWithValue('Mökkien haku epäonnistui')
            }
        },
        createCabin: async (
            cabin: CabinRequestDto,
            { rejectWithValue, dispatch }
        ) => {
            const response = await cabinApi.createCabin(cabin)
            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: 'Mökki luotu.',
                        severity: 'success',
                    })
                )
                dispatch(cabinActions.resetSelectedCabinId())
                dispatch(thunks.getCabins())
                return response.data
            } else return rejectWithValue('Mökin luominen epäonnistui.')
        },
        updateCabin: async (
            cabin: Omit<CabinResponseDto, 'deletable'>,
            { rejectWithValue, dispatch }
        ) => {
            const response = await cabinApi.updateCabin(cabin)
            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(cabinActions.resetSelectedCabinId())
                dispatch(thunks.getCabins())
                return response.data
            } else return rejectWithValue('Mökin muokkaus epäonnistui.')
        },
        deleteCabin: async (
            _: void,
            { rejectWithValue, dispatch, getState }
        ) => {
            const selected = getState().cabin.selectedCabinId
            const response = await cabinApi.deleteCabin(selected)
            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(cabinActions.resetSelectedCabinId())
                dispatch(thunks.getCabins())
                return response.data
            } else return rejectWithValue('Mökin poisto epäonnistui.')
        },
        getCabinOptions: async (_: void, { rejectWithValue }) => {
            const response = await cabinApi.getCabinOptions()

            if (response.ok) {
                return response.data
            } else {
                return rejectWithValue('Mökkivalintojen haku epäonnistui.')
            }
        },
    },
    'cabin'
)

const cabin = createSlice({
    name: 'cabin',
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
        setSelectedCabinId: (
            state,
            action: PayloadAction<{ id: number; operation: CRUD }>
        ) => {
            state.selectedCabinId = action.payload.id
            state.selectedCabinOperation = action.payload.operation
        },
        resetSelectedCabinId: (state) => {
            state.selectedCabinId = initialState.selectedCabinId
            state.selectedCabinOperation = initialState.selectedCabinOperation
        },
        setOperation: (state, action: PayloadAction<CRUD>) => {
            state.selectedCabinOperation = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(
            thunks.getCabins.fulfilled,
            (state, action: PayloadAction<PaginatedCabinResponseDto>) => {
                state.cabins = action.payload.data
                state.pagination = action.payload.pagination
            }
        )
        builder.addCase(
            thunks.getCabinOptions.fulfilled,
            (state, action: PayloadAction<SelectOption[]>) => {
                state.cabinOptions = action.payload
            }
        )

        builder.addMatcher(
            isAnyOf(
                thunks.getCabins.pending,
                thunks.createCabin.pending,
                thunks.updateCabin.pending,
                thunks.deleteCabin.pending,
                thunks.getCabinOptions.pending
            ),
            (state) => {
                state.loading = true
            }
        )

        builder.addMatcher(
            isAnyOf(
                thunks.getCabins.rejected,
                thunks.getCabins.fulfilled,
                thunks.createCabin.rejected,
                thunks.createCabin.fulfilled,
                thunks.updateCabin.rejected,
                thunks.updateCabin.fulfilled,
                thunks.deleteCabin.rejected,
                thunks.deleteCabin.fulfilled,
                thunks.getCabinOptions.fulfilled,
                thunks.getCabinOptions.rejected
            ),
            (state) => {
                state.loading = false
            }
        )
    },
})

export default cabin
export const cabinThunks = thunks
export const cabinActions = cabin.actions
