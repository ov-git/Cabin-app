export enum AppRoutes {
    Root = '/',
    Cabin = '/cabin',
    Customer = '/customer',
    Invoice = '/invoice',
    Reservation = '/reservation',
    Rest = '/*',
}

export type CRUD = 'create' | 'read' | 'update' | 'delete'

export interface Sorting {
    order: 'asc' | 'desc' | null
    orderBy: string
}

export interface Pagination {
    limit: number
    offset: number
    total: number
    count: number
}

export enum CabinHeader {
    Name = 'name',
    Size = 'size',
    PricePerDay = 'pricePerDay',
}

export const getCabinLabel = (header: CabinHeader) => {
    switch (header) {
        case CabinHeader.Name:
            return 'Nimi'
        case CabinHeader.Size:
            return 'Koko'
        case CabinHeader.PricePerDay:
            return 'Hinta'

        default:
            return ''
    }
}

export enum CustomerHeader {
    Name = 'name',
    Email = 'email',
    Phone = 'phone',
}

export const getCustomerLabel = (header: CustomerHeader) => {
    switch (header) {
        case CustomerHeader.Name:
            return 'Nimi'
        case CustomerHeader.Email:
            return 'Sähköposti'
        case CustomerHeader.Phone:
            return 'Puhelin'

        default:
            return ''
    }
}

export enum InvoiceHeader {
    Date = 'date',
    Identifier = 'identifier',
    TotalAmount = 'totalAmount',
}

export const getInvoiceLabel = (header: InvoiceHeader) => {
    switch (header) {
        case InvoiceHeader.Date:
            return 'Päivämäärä'
        case InvoiceHeader.Identifier:
            return 'Laskun tunniste'
        case InvoiceHeader.TotalAmount:
            return 'Loppusumma'

        default:
            return ''
    }
}

export enum ReservationHeader {
    StartDate = 'startDate',
    EndDate = 'endDate',
    ReservationNumber = 'reservationNumber',
}

export const getReservationLabel = (header: ReservationHeader) => {
    switch (header) {
        case ReservationHeader.ReservationNumber:
            return 'Varausnumero'
        case ReservationHeader.StartDate:
            return 'Alkupvm.'
        case ReservationHeader.EndDate:
            return 'Loppupvm.'

        default:
            return ''
    }
}

export interface NotificationMessage {
    message: string
    severity: 'info' | 'error' | 'success'
}
