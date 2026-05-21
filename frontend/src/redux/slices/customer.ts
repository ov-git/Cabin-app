import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { customerApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory } from '@kallinen/thunk-utility'
import {
    CustomerHeader,
    CRUD,
    Pagination,
    Sorting,
    SelectOption,
} from '../../types/frontendTypes'
import {
    CustomerRequestDto,
    CustomerResponseDto,
    PaginatedCustomerResponseDto,
} from '../../types/endpointTypes'
import { uiActions } from './ui'

const { createThunks } = createThunkFactory<ThunkState>()

export interface CustomerState {
    loading: boolean
    customers: CustomerResponseDto[]
    customerOptions: SelectOption[]
    selectedCustomerId: number
    selectedCustomerOperation: CRUD | null
    sorting: Sorting
    pagination: Pagination
}

const initialState: CustomerState = {
    loading: false,
    customers: [],
    customerOptions: [],
    selectedCustomerId: -1,
    selectedCustomerOperation: null,
    sorting: {
        order: 'desc',
        orderBy: CustomerHeader.FirstName,
    },
    pagination: { count: 10, limit: 10, offset: 0, total: 0 },
}

export const thunks = createThunks(
    {
        getCustomers: async (_: void, { rejectWithValue, getState }) => {
            const sorting = getState().customer.sorting
            const pagination = getState().customer.pagination
            const response = await customerApi.getCustomers(sorting, pagination)

            if (response.ok) {
                return response.data
            } else {
                return rejectWithValue('Asiakkaiden haku epäonnistui.')
            }
        },
        createCustomer: async (
            customer: CustomerRequestDto,
            { rejectWithValue, dispatch }
        ) => {
            const response = await customerApi.createCustomer(customer)

            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: 'Asiakas luotu.',
                        severity: 'success',
                    })
                )
                dispatch(customerActions.resetSelectedCustomerId())
                dispatch(thunks.getCustomers())
                return response.data
            } else return rejectWithValue('Asiakkaan luominen epäonnistui.')
        },
        updateCustomer: async (
            customer: Omit<CustomerResponseDto, 'deletable'>,
            { rejectWithValue, dispatch }
        ) => {
            const response = await customerApi.updateCustomer(customer)

            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(customerActions.resetSelectedCustomerId())
                dispatch(thunks.getCustomers())
                return response.data
            } else return rejectWithValue('Asiakkaan muokkaus epäonnistui.')
        },
        deleteCustomer: async (
            _: void,
            { rejectWithValue, dispatch, getState }
        ) => {
            const selected = getState().customer.selectedCustomerId
            const response = await customerApi.deleteCustomer(selected)

            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(customerActions.resetSelectedCustomerId())
                dispatch(thunks.getCustomers())
                return response.data
            } else return rejectWithValue('Asiakkaan poisto epäonnistui.')
        },
        getCustomerOptions: async (_: void, { rejectWithValue }) => {
            const response = await customerApi.getCustomerOptions()

            if (response.ok) {
                return response.data
            } else {
                return rejectWithValue('Asiakasvalintojen haku epäonnistui.')
            }
        },
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
        builder.addCase(
            thunks.getCustomers.fulfilled,
            (state, action: PayloadAction<PaginatedCustomerResponseDto>) => {
                state.customers = action.payload.data
                state.pagination = action.payload.pagination
            }
        )
        builder.addCase(
            thunks.getCustomerOptions.fulfilled,
            (state, action: PayloadAction<SelectOption[]>) => {
                state.customerOptions = action.payload
            }
        )
        builder.addMatcher(
            isAnyOf(
                thunks.getCustomers.pending,
                thunks.createCustomer.pending,
                thunks.updateCustomer.pending,
                thunks.deleteCustomer.pending,
                thunks.getCustomerOptions.pending
            ),
            (state) => {
                state.loading = true
            }
        )

        builder.addMatcher(
            isAnyOf(
                thunks.getCustomers.rejected,
                thunks.getCustomers.fulfilled,
                thunks.createCustomer.rejected,
                thunks.createCustomer.fulfilled,
                thunks.updateCustomer.rejected,
                thunks.updateCustomer.fulfilled,
                thunks.deleteCustomer.rejected,
                thunks.deleteCustomer.fulfilled,
                thunks.getCustomerOptions.rejected,
                thunks.getCustomerOptions.fulfilled
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
