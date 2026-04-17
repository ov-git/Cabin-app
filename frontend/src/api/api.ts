import { ApiResponse, createApi } from '@kallinen/openapi-axios-client'
import {
    CabinResponseDto,
    CustomerResponseDto,
    InvoiceResponseDto,
    ReservationResponseDto,
    UserResponseDto,
} from '../types/endpointTypes'
import { store } from '../redux/store'
import { uiActions } from '../redux/slices/ui'

const api = createApi({
    url: 'http://localhost:8080/api',
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

const getCabins = async (): Promise<ApiResponse<CabinResponseDto[], any>> => {
    return await api.get<CabinResponseDto[]>('/cabin')
}

const createCabin = async (
    payload: CabinResponseDto
): Promise<ApiResponse<CabinResponseDto, any>> => {
    return await api.post<CabinResponseDto>('/cabin', payload)
}

const updateCabin = async (
    id: number,
    payload: CabinResponseDto
): Promise<ApiResponse<string, any>> => {
    return await api.put<string>(`/cabin/${id}`, payload)
}

const deleteCabin = async (id: number): Promise<ApiResponse<string, any>> => {
    return await api.delete<string>(`/cabin/${id}`)
}

const getCustomers = async (): Promise<
    ApiResponse<CustomerResponseDto[], any>
> => {
    return await api.get<CustomerResponseDto[]>('/customer')
}

const createCustomer = async (
    payload: CustomerResponseDto
): Promise<ApiResponse<CustomerResponseDto, any>> => {
    return await api.post<CustomerResponseDto>('/customer', payload)
}

const updateCustomer = async (
    id: number,
    payload: CustomerResponseDto
): Promise<ApiResponse<string, any>> => {
    return await api.put<string>(`/customer/${id}`, payload)
}

const deleteCustomer = async (
    id: number
): Promise<ApiResponse<string, any>> => {
    return await api.delete<string>(`/customer/${id}`)
}

const getInvoices = async (): Promise<
    ApiResponse<InvoiceResponseDto[], any>
> => {
    return await api.get<InvoiceResponseDto[]>('/invoice')
}

const createInvoice = async (
    payload: InvoiceResponseDto
): Promise<ApiResponse<InvoiceResponseDto, any>> => {
    return await api.post<InvoiceResponseDto>('/invoice', payload)
}

const updateInvoice = async (
    id: number,
    payload: InvoiceResponseDto
): Promise<ApiResponse<string, any>> => {
    return await api.put<string>(`/invoice/${id}`, payload)
}

const deleteInvoice = async (id: number): Promise<ApiResponse<string, any>> => {
    return await api.delete<string>(`/invoice/${id}`)
}

const getReservations = async (): Promise<
    ApiResponse<ReservationResponseDto[], any>
> => {
    return await api.get<ReservationResponseDto[]>('/reservation')
}

const createReservation = async (
    payload: ReservationResponseDto
): Promise<ApiResponse<ReservationResponseDto, any>> => {
    return await api.post<ReservationResponseDto>('/reservation', payload)
}

const updateReservation = async (
    id: number,
    payload: ReservationResponseDto
): Promise<ApiResponse<string, any>> => {
    return await api.put<string>(`/reservation/${id}`, payload)
}

const deleteReservation = async (
    id: number
): Promise<ApiResponse<string, any>> => {
    return await api.delete<string>(`/reservation/${id}`)
}

const getUsers = async (): Promise<ApiResponse<UserResponseDto[], any>> => {
    return await api.get<UserResponseDto[]>('/user')
}

const createUser = async (
    payload: UserResponseDto
): Promise<ApiResponse<UserResponseDto, any>> => {
    return await api.post<UserResponseDto>('/user', payload)
}

const updateUser = async (
    id: number,
    payload: UserResponseDto
): Promise<ApiResponse<string, any>> => {
    return await api.put<string>(`/user/${id}`, payload)
}

const deleteUser = async (id: number): Promise<ApiResponse<string, any>> => {
    return await api.delete<string>(`/user/${id}`)
}

export const cabinApi = {
    getCabins,
    createCabin,
    updateCabin,
    deleteCabin,
}

export const customerApi = {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
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
}

export const userApi = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
}
