import { ApiResponse, createApi } from '@kallinen/openapi-axios-client'
import {
    CabinRequestDto,
    CabinResponseDto,
    CustomerRequestDto,
    CustomerResponseDto,
    InvoiceRequestDto,
    InvoiceResponseDto,
    PaginatedCabinResponseDto,
    PaginatedCustomerResponseDto,
    PaginatedInvoiceResponseDto,
    PaginatedReservationResponseDto,
    ReservationRequestDto,
    ReservationResponseDto,
} from '../types/endpointTypes'
import { store } from '../redux/store'
import { uiActions } from '../redux/slices/ui'
import {
    mapInvoiceOrderBy,
    mapReservationOrderBy,
    Pagination,
    SelectOption,
    Sorting,
} from '../types/frontendTypes'

const api = createApi({
    url: import.meta.env.VITE_BACKEND_URL,
})

api.interceptors.response.use((response) => {
    const res = response as unknown as ApiResponse<any, any>

    if (!res.ok) {
        store.dispatch(
            uiActions.setNotification({
                message: `Jotain meni pieleen (${res.originalError.message})`,
                severity: 'error',
            })
        )
    }

    return response
})

const getCabins = async (
    sorting: Sorting,
    pagination: Pagination
): Promise<ApiResponse<PaginatedCabinResponseDto, any>> => {
    return await api.get<PaginatedCabinResponseDto>('/cabin', {
        params: { ...sorting, ...pagination },
    })
}

const getCustomers = async (
    sorting: Sorting,
    pagination: Pagination
): Promise<ApiResponse<PaginatedCustomerResponseDto, any>> => {
    return await api.get<PaginatedCustomerResponseDto>('/customer', {
        params: { ...sorting, ...pagination },
    })
}

const getInvoices = async (
    sorting: Sorting,
    pagination: Pagination
): Promise<ApiResponse<PaginatedInvoiceResponseDto, any>> => {
    return await api.get<PaginatedInvoiceResponseDto>('/invoice', {
        params: {
            ...sorting,
            orderBy: mapInvoiceOrderBy(sorting.orderBy),
            ...pagination,
        },
    })
}

const createInvoice = async (
    payload: InvoiceRequestDto
): Promise<ApiResponse<InvoiceResponseDto, any>> => {
    return await api.post<InvoiceResponseDto>('/invoice', payload)
}

const updateInvoice = async (
    payload: InvoiceRequestDto & { id: number }
): Promise<ApiResponse<string, any>> => {
    return await api.put<string>(`/invoice/${payload.id}`, payload)
}

const getReservations = async (
    sorting: Sorting,
    pagination: Pagination
): Promise<ApiResponse<PaginatedReservationResponseDto, any>> => {
    return await api.get<PaginatedReservationResponseDto>('/reservation', {
        params: {
            ...sorting,
            orderBy: mapReservationOrderBy(sorting.orderBy),
            ...pagination,
        },
    })
}

const createReservation = async (
    payload: ReservationRequestDto
): Promise<ApiResponse<ReservationResponseDto, any>> => {
    return await api.post<ReservationResponseDto>('/reservation', payload)
}

const updateReservation = async (
    payload: ReservationRequestDto & { id: number }
): Promise<ApiResponse<string, any>> => {
    return await api.put<string>(`/reservation/${payload.id}`, payload)
}

const createCabin = async (
    payload: CabinRequestDto
): Promise<ApiResponse<CabinResponseDto, any>> => {
    return await api.post<CabinResponseDto>('/cabin', payload)
}

const updateCabin = async (
    payload: Omit<CabinResponseDto, 'deletable'>
): Promise<ApiResponse<string, any>> => {
    return await api.put<string>(`/cabin/${payload.id}`, payload)
}

const deleteCabin = async (id: number): Promise<ApiResponse<string, any>> => {
    return await api.delete<string>(`/cabin/${id}`)
}

const createCustomer = async (
    payload: CustomerRequestDto
): Promise<ApiResponse<CustomerRequestDto, any>> => {
    return await api.post<CustomerResponseDto>('/customer', payload)
}

const updateCustomer = async (
    payload: Omit<CustomerResponseDto, 'deletable'>
): Promise<ApiResponse<string, any>> => {
    return await api.put<string>(`/customer/${payload.id}`, payload)
}

const deleteCustomer = async (
    id: number
): Promise<ApiResponse<string, any>> => {
    return await api.delete<string>(`/customer/${id}`)
}

const deleteInvoice = async (id: number): Promise<ApiResponse<string, any>> => {
    return await api.delete<string>(`/invoice/${id}`)
}

const deleteReservation = async (
    id: number
): Promise<ApiResponse<string, any>> => {
    return await api.delete<string>(`/reservation/${id}`)
}

const getCustomerOptions = async (): Promise<
    ApiResponse<SelectOption[], any>
> => {
    return await api.get<SelectOption[]>('/customer/options')
}

const getCabinOptions = async (): Promise<ApiResponse<SelectOption[], any>> => {
    return await api.get<SelectOption[]>('/cabin/options')
}

const checkReservationOverlap = async (
    payload: ReservationRequestDto
): Promise<ApiResponse<ReservationResponseDto[], any>> => {
    return await api.post<ReservationResponseDto[]>(
        '/reservation/check-overlap',
        payload
    )
}

export const cabinApi = {
    getCabins,
    createCabin,
    updateCabin,
    deleteCabin,
    getCabinOptions,
}

export const customerApi = {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerOptions,
}

export const invoiceApi = {
    getInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
}

export const reservationApi = {
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    checkReservationOverlap,
}
