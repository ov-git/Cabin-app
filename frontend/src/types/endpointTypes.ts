import { Pagination } from './frontendTypes'

export interface CabinRequestDto {
    name: string
    location: string
    price: number
    maxGuests: number
}

export interface CustomerRequestDto {
    firstName: string
    lastName: string
    email: string
    phone: string
}

export interface ReservationRequestDto {
    customerId: number
    cabinId: number
    startDate: string
    endDate: string
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED'
}

export interface InvoiceRequestDto {
    customerId: number
    reservationId: number
    amount: number
    status: 'PAID' | 'PENDING' | 'CANCELLED'
    issueDate: string
    dueDate: string
}

export interface CabinResponseDto extends CabinRequestDto {
    id: number
    deletable: boolean
}

export interface ReservationResponseDto
    extends Omit<Omit<ReservationRequestDto, 'customerId'>, 'cabinId'> {
    id: number
    deletable: boolean
    customer: CustomerResponseDto
    cabin: CabinResponseDto
}

export interface InvoiceResponseDto
    extends Omit<Omit<InvoiceRequestDto, 'customerId'>, 'reservationId'> {
    id: number
    customer: CustomerResponseDto
    reservation: ReservationResponseDto
    deletable: boolean
}

export interface CustomerResponseDto extends CustomerRequestDto {
    id: number
    deletable: boolean
}

export interface PaginatedCabinResponseDto {
    data: CabinResponseDto[]
    pagination: Pagination
}

export interface PaginatedCustomerResponseDto {
    data: CustomerResponseDto[]
    pagination: Pagination
}

export interface PaginatedInvoiceResponseDto {
    data: InvoiceResponseDto[]
    pagination: Pagination
}

export interface PaginatedReservationResponseDto {
    data: ReservationResponseDto[]
    pagination: Pagination
}
