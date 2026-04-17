//tänne endpointien haluamat (request) ja palauttamat (response) datatyypit, jotka vastaavat spring-rajapintaa.
export interface ExampleResponseDto {
    id: number
    label: string
}

export interface ExampleRequestDto {
    date: string
    pagination: { offset: number; limit: number; count: number; total: number }
}

export interface ExampleCabinResponseDto {
    id: number
    name: string
    size: string
    pricePerDay: string
}

export interface ExampleCustomerResponseDto {
    id: number
    name: string
    phone: string
    email: string
}

export interface ExampleInvoiceResponseDto {
    id: number
    identifier: string
    date: string
    totalAmount: string
}

export interface ExampleReservationResponseDto {
    id: number
    startDate: string
    endDate: string
    reservationNumber: string
}
