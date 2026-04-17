import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { cabinApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory, sliceHelper } from '@kallinen/thunk-utility'
import { ExampleInvoiceResponseDto } from '../../types/endpointTypes'
import {
    CRUD,
    InvoiceHeader,
    Pagination,
    Sorting,
} from '../../types/frontendTypes'

const { createThunks, apiThunkFor } = createThunkFactory<ThunkState>()

export interface InvoiceState {
    loading: boolean
    invoices: ExampleInvoiceResponseDto[]
    selectedInvoiceId: number
    selectedInvoiceOperation: CRUD | null
    sorting: Sorting
    pagination: Pagination
}

const initialState: InvoiceState = {
    loading: false,
    invoices: [],
    selectedInvoiceId: -1,
    selectedInvoiceOperation: null,
    sorting: {
        order: 'desc',
        orderBy: InvoiceHeader.Date,
    },
    pagination: { count: 10, limit: 10, offset: 0, total: 0 },
}

const thunks = createThunks(
    {
        getInvoices: apiThunkFor(cabinApi.getInvoices)(),
    },
    'invoice'
)

const invoice = createSlice({
    name: 'invoice',
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
        setSelectedInvoiceId: (
            state,
            action: PayloadAction<{ id: number; operation: CRUD }>
        ) => {
            state.selectedInvoiceId = action.payload.id
            state.selectedInvoiceOperation = action.payload.operation
        },
        resetSelectedInvoiceId: (state) => {
            state.selectedInvoiceId = initialState.selectedInvoiceId
            state.selectedInvoiceOperation =
                initialState.selectedInvoiceOperation
        },
        setOperation: (state, action: PayloadAction<CRUD>) => {
            state.selectedInvoiceOperation = action.payload
        },
    },
    extraReducers: (builder) => {
        const util = sliceHelper(builder, thunks)
        util.mapThunksToState('fulfilled', {
            getInvoices: 'invoices',
        })
        builder.addMatcher(isAnyOf(thunks.getInvoices.pending), (state) => {
            state.loading = true
        })
        builder.addMatcher(
            isAnyOf(thunks.getInvoices.rejected, thunks.getInvoices.fulfilled),
            (state) => {
                state.loading = false
            }
        )
    },
})

export default invoice
export const invoiceThunks = thunks
export const invoiceActions = invoice.actions
