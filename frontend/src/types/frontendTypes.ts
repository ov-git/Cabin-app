export enum AppRoutes {
    Cabin = '/cabin',
    Customer = '/customer',
    Invoice = '/invoice',
    Reservation = '/reservation',
    User = '/user',
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
    Location = 'location',
    Price = 'price',
    MaxGuests = 'maxGuests',
}

export const cabinSortableHeaders = [
    CabinHeader.Name,
    CabinHeader.Location,
    CabinHeader.Price,
    CabinHeader.MaxGuests,
] as const

export const cabinLabels: Record<CabinHeader, string> = {
    [CabinHeader.Name]: 'Nimi',
    [CabinHeader.Location]: 'Sijainti',
    [CabinHeader.Price]: 'Hinta / yö',
    [CabinHeader.MaxGuests]: 'Max hlö',
}

export const getCabinLabel = (header: CabinHeader) => cabinLabels[header]

export enum CustomerHeader {
    FirstName = 'firstName',
    LastName = 'lastName',
    Email = 'email',
    Phone = 'phone',
}

export const customerSortableHeaders = [
    CustomerHeader.FirstName,
    CustomerHeader.LastName,
    CustomerHeader.Email,
    CustomerHeader.Phone,
] as const

export const customerLabels: Record<CustomerHeader, string> = {
    [CustomerHeader.FirstName]: 'Etunimi',
    [CustomerHeader.LastName]: 'Sukunimi',
    [CustomerHeader.Email]: 'Sähköposti',
    [CustomerHeader.Phone]: 'Puhelin',
}

export const getCustomerLabel = (header: CustomerHeader) =>
    customerLabels[header]

export enum InvoiceHeader {
    CustomerId = 'customerId',
    ReservationId = 'reservationId',
    Amount = 'amount',
    Status = 'status',
    IssueDate = 'issueDate',
    DueDate = 'dueDate',
}

export const invoiceSortableHeaders = [
    InvoiceHeader.CustomerId,
    InvoiceHeader.ReservationId,
    InvoiceHeader.Amount,
    InvoiceHeader.Status,
    InvoiceHeader.IssueDate,
    InvoiceHeader.DueDate,
] as const

export const invoiceLabels: Record<InvoiceHeader, string> = {
    [InvoiceHeader.CustomerId]: 'Asiakas',
    [InvoiceHeader.ReservationId]: 'Varausnumero',
    [InvoiceHeader.Amount]: 'Summa',
    [InvoiceHeader.Status]: 'Tila',
    [InvoiceHeader.IssueDate]: 'Päiväys',
    [InvoiceHeader.DueDate]: 'Eräpäivä',
}

export const getInvoiceLabel = (header: InvoiceHeader) => invoiceLabels[header]

export enum ReservationHeader {
    CustomerId = 'customerId',
    CabinId = 'cabinId',
    StartDate = 'startDate',
    EndDate = 'endDate',
    Status = 'status',
}

export const reservationSortableHeaders = [
    ReservationHeader.CustomerId,
    ReservationHeader.CabinId,
    ReservationHeader.StartDate,
    ReservationHeader.EndDate,
    ReservationHeader.Status,
] as const

export const reservationLabels: Record<ReservationHeader, string> = {
    [ReservationHeader.CustomerId]: 'Asiakas',
    [ReservationHeader.CabinId]: 'Mökki',
    [ReservationHeader.StartDate]: 'Alkaa',
    [ReservationHeader.EndDate]: 'Päättyy',
    [ReservationHeader.Status]: 'Tila',
}

export const getReservationLabel = (header: ReservationHeader) =>
    reservationLabels[header]

export enum UserHeader {
    Username = 'username',
    Email = 'email',
    Role = 'role',
    Active = 'active',
}

export const userSortableHeaders = [
    UserHeader.Username,
    UserHeader.Email,
    UserHeader.Role,
    UserHeader.Active,
] as const

export const userLabels: Record<UserHeader, string> = {
    [UserHeader.Username]: 'Käyttäjänimi',
    [UserHeader.Email]: 'Sähköposti',
    [UserHeader.Role]: 'Rooli',
    [UserHeader.Active]: 'Aktiivinen',
}

export const getUserLabel = (header: UserHeader) => userLabels[header]

export interface NotificationMessage {
    message: string
    severity: 'info' | 'error' | 'success'
}

export type FormFieldType = 'text' | 'number' | 'date' | 'boolean' | 'select'

export interface SelectOption {
    label: string
    value: string | number
}

export interface FormFieldConfig {
    type: FormFieldType
    options?: SelectOption[]
}

export const getCellText = (value: unknown, type?: FormFieldType): string => {
    if (value == null) {
        return ''
    }

    if (type === 'boolean') {
        return value ? 'Kyllä' : 'Ei'
    }

    if (type === 'date') {
        return String(value)
    }

    if (Array.isArray(value)) {
        return value.join(', ')
    }

    return String(value)
}

export const mapReservationOrderBy = (orderBy: string) => {
    if (orderBy === ReservationHeader.CustomerId) return 'customer.id'
    if (orderBy === ReservationHeader.CabinId) return 'cabin.id'

    return orderBy
}

export const mapInvoiceOrderBy = (orderBy: string) => {
    if (orderBy === InvoiceHeader.CustomerId) return 'customer.id'
    if (orderBy === InvoiceHeader.ReservationId) return 'reservation.id'

    return orderBy
}
