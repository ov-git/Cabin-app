import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { cabinApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory, sliceHelper } from '@kallinen/thunk-utility'
import { ExampleCabinResponseDto } from '../../types/endpointTypes'
import {
    CabinHeader,
    CRUD,
    Pagination,
    Sorting,
} from '../../types/frontendTypes'

const { createThunks, apiThunkFor } = createThunkFactory<ThunkState>()

export interface CabinState {
    loading: boolean
    cabins: ExampleCabinResponseDto[]
    selectedCabinId: number
    selectedCabinOperation: CRUD | null
    sorting: Sorting
    pagination: Pagination
}

const initialState: CabinState = {
    loading: false,
    cabins: [],
    selectedCabinId: -1,
    selectedCabinOperation: null,
    sorting: {
        order: 'desc',
        orderBy: CabinHeader.Name,
    },
    pagination: { count: 10, limit: 10, offset: 0, total: 0 },
}

const thunks = createThunks(
    {
        getCabins: apiThunkFor(cabinApi.getCabins)(),
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
        const util = sliceHelper(builder, thunks)
        util.mapThunksToState('fulfilled', {
            getCabins: 'cabins',
        })
        builder.addMatcher(isAnyOf(thunks.getCabins.pending), (state) => {
            state.loading = true
        })
        builder.addMatcher(
            isAnyOf(thunks.getCabins.rejected, thunks.getCabins.fulfilled),
            (state) => {
                state.loading = false
            }
        )
    },
})

export default cabin
export const cabinThunks = thunks
export const cabinActions = cabin.actions
