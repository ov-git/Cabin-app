import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { cabinApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory, sliceHelper } from '@kallinen/thunk-utility'
import {
    ExampleCustomerResponseDto,
    ExampleResponseDto,
} from '../../types/endpointTypes'
import {
    CRUD,
    CustomerHeader,
    Pagination,
    Sorting,
} from '../../types/frontendTypes'

const { createThunks, apiThunkFor } = createThunkFactory<ThunkState>()

export interface CustomerState {
    loading: boolean
    customers: ExampleCustomerResponseDto[]
    selectedCustomerId: number
    selectedCustomerOperation: CRUD | null
    sorting: Sorting
    pagination: Pagination
}

const initialState: CustomerState = {
    loading: false,
    customers: [],
    selectedCustomerId: -1,
    selectedCustomerOperation: null,
    sorting: {
        order: 'desc',
        orderBy: CustomerHeader.Name,
    },
    pagination: { count: 10, limit: 10, offset: 0, total: 0 },
}

const thunks = createThunks(
    {
        getCustomers: apiThunkFor(cabinApi.getCustomers)(),
    },
    'customer'
)

const customer = createSlice({
    name: 'customer',
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
        setSelectedCustomerId: (
            state,
            action: PayloadAction<{ id: number; operation: CRUD }>
        ) => {
            state.selectedCustomerId = action.payload.id
            state.selectedCustomerOperation = action.payload.operation
        },
        resetSelectedCustomerId: (state) => {
            state.selectedCustomerId = initialState.selectedCustomerId
            state.selectedCustomerOperation =
                initialState.selectedCustomerOperation
        },
        setOperation: (state, action: PayloadAction<CRUD>) => {
            state.selectedCustomerOperation = action.payload
        },
    },
    extraReducers: (builder) => {
        const util = sliceHelper(builder, thunks)
        util.mapThunksToState('fulfilled', {
            getCustomers: 'customers',
        })
        builder.addMatcher(isAnyOf(thunks.getCustomers.pending), (state) => {
            state.loading = true
        })
        builder.addMatcher(
            isAnyOf(
                thunks.getCustomers.rejected,
                thunks.getCustomers.fulfilled
            ),
            (state) => {
                state.loading = false
            }
        )
    },
})

export default customer
export const customerThunks = thunks
export const customerActions = customer.actions
