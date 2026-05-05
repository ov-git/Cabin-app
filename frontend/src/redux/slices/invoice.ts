import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { invoiceApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory } from '@kallinen/thunk-utility'
import {
    InvoiceHeader,
    CRUD,
    Pagination,
    Sorting,
} from '../../types/frontendTypes'
import {
    InvoiceRequestDto,
    InvoiceResponseDto,
    PaginatedInvoiceResponseDto,
} from '../../types/endpointTypes'
import { uiActions } from './ui'

const { createThunks } = createThunkFactory<ThunkState>()

export interface InvoiceState {
    loading: boolean
    invoices: InvoiceResponseDto[]
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
        orderBy: InvoiceHeader.Amount,
    },
    pagination: { count: 10, limit: 10, offset: 0, total: 0 },
}

export const thunks = createThunks(
    {
        getInvoices: async (_: void, { rejectWithValue, getState }) => {
            const sorting = getState().invoice.sorting
            const pagination = getState().invoice.pagination
            const response = await invoiceApi.getInvoices(sorting, pagination)

            if (response.ok) {
                return response.data
            } else {
                return rejectWithValue('Laskujen haku epäonnistui.')
            }
        },

        createInvoice: async (
            invoice: InvoiceRequestDto,
            { rejectWithValue, dispatch }
        ) => {
            const response = await invoiceApi.createInvoice(invoice)

            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: 'Lasku luotu.',
                        severity: 'success',
                    })
                )
                dispatch(invoiceActions.resetSelectedInvoiceId())
                dispatch(thunks.getInvoices())
                return response.data
            } else return rejectWithValue('Laskun luominen epäonnistui.')
        },

        updateInvoice: async (
            invoice: InvoiceRequestDto & { id: number },
            { rejectWithValue, dispatch }
        ) => {
            const response = await invoiceApi.updateInvoice(invoice)

            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(invoiceActions.resetSelectedInvoiceId())
                dispatch(thunks.getInvoices())
                return response.data
            } else return rejectWithValue('Laskun muokkaus epäonnistui.')
        },

        deleteInvoice: async (
            _: void,
            { rejectWithValue, dispatch, getState }
        ) => {
            const selected = getState().invoice.selectedInvoiceId
            const response = await invoiceApi.deleteInvoice(selected)

            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(invoiceActions.resetSelectedInvoiceId())
                dispatch(thunks.getInvoices())
                return response.data
            } else return rejectWithValue('Laskun poisto epäonnistui.')
        },
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
        builder.addCase(
            thunks.getInvoices.fulfilled,
            (state, action: PayloadAction<PaginatedInvoiceResponseDto>) => {
                state.invoices = action.payload.data
                state.pagination = action.payload.pagination
            }
        )

        builder.addMatcher(
            isAnyOf(
                thunks.getInvoices.pending,
                thunks.createInvoice.pending,
                thunks.updateInvoice.pending,
                thunks.deleteInvoice.pending
            ),
            (state) => {
                state.loading = true
            }
        )

        builder.addMatcher(
            isAnyOf(
                thunks.getInvoices.rejected,
                thunks.getInvoices.fulfilled,
                thunks.createInvoice.rejected,
                thunks.createInvoice.fulfilled,
                thunks.updateInvoice.rejected,
                thunks.updateInvoice.fulfilled,
                thunks.deleteInvoice.rejected,
                thunks.deleteInvoice.fulfilled
            ),
            (state) => {
                state.loading = false
            }
        )
    },
})

export default invoice
export const invoiceThunks = thunks
export const invoiceActions = invoice.actions
