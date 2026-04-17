export interface CabinResponseDto {
    id: number
    name: string
    location: string
    pricePerNight: number
    maxGuests: number
    bedrooms: number
    bathrooms: number
    amenities: string[]
    available: boolean
    rating: number
}

export interface CustomerResponseDto {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
}

export interface InvoiceResponseDto {
    id: number
    customerId: number
    reservationId: number
    amount: number
    status: 'PAID' | 'PENDING' | 'CANCELLED'
    issueDate: string
    dueDate: string
}

export interface ReservationResponseDto {
    id: number
    customerId: number
    cabinId: number
    startDate: string
    endDate: string
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED'
}

export interface UserResponseDto {
    id: number
    username: string
    email: string
    role: 'ADMIN' | 'USER'
    active: boolean
}
