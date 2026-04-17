import {
    ApiOkResponse,
    ApiResponse,
    createApi,
} from '@kallinen/openapi-axios-client'
import {
    ExampleCabinResponseDto,
    ExampleCustomerResponseDto,
    ExampleInvoiceResponseDto,
    ExampleReservationResponseDto,
    ExampleResponseDto,
} from '../types/endpointTypes'
import { store } from '../redux/store'
import { uiActions } from '../redux/slices/ui'
import { CabinHeader } from '../types/frontendTypes'

const api = createApi({
    url: 'localhost:3001',
})

api.interceptors.response.use((response) => {
    const res = response as unknown as ApiResponse<any>

    if (!res.ok) {
        store.dispatch(
            uiActions.setNotification({
                message: `Jotain meni pieleen (${res.status})`,
                severity: 'error',
            })
        )
    }

    return response
})

const createMockResponse = async () => {
    return await new Promise<ApiResponse<ExampleResponseDto[], any>>(
        (resolve, _reject) => {
            setTimeout(() => {
                resolve({
                    ok: true,
                    data: [
                        { id: 1, label: 'Mock data 1' },
                        { id: 2, label: 'Mock data 2' },
                        { id: 3, label: 'Mock data 3' },
                        { id: 4, label: 'Mock data 4' },
                    ],
                } as ApiOkResponse<ExampleResponseDto[]>)
            }, 1000)
        }
    )
}

const createMockCabinResponse = async () => {
    return await new Promise<ApiResponse<ExampleCabinResponseDto[], any>>(
        (resolve, _reject) => {
            setTimeout(() => {
                resolve({
                    ok: true,
                    data: [
                        {
                            id: 1,
                            name: 'Test',
                            pricePerDay: '150€',
                            size: '65m2',
                        },
                        {
                            id: 2,
                            name: 'Test 2',
                            pricePerDay: '170€',
                            size: '45m2',
                        },
                    ],
                } as ApiOkResponse<ExampleCabinResponseDto[]>)
            }, 1000)
        }
    )
}

const createMockCustomerResponse = async () => {
    return await new Promise<ApiResponse<ExampleCustomerResponseDto[], any>>(
        (resolve, _reject) => {
            setTimeout(() => {
                resolve({
                    ok: true,
                    data: [
                        {
                            id: 1,
                            name: 'Timo Testaaja',
                            email: 'test@test.fi',
                            phone: '0404040404',
                        },
                        {
                            id: 2,
                            name: 'Teemu Testeri',
                            email: 'test@test2.com',
                            phone: '0403040304',
                        },
                    ],
                } as ApiOkResponse<ExampleCustomerResponseDto[]>)
            }, 1000)
        }
    )
}

const createMockInvoiceResponse = async () => {
    return await new Promise<ApiResponse<ExampleInvoiceResponseDto[], any>>(
        (resolve, _reject) => {
            setTimeout(() => {
                resolve({
                    ok: true,
                    data: [
                        {
                            id: 1,
                            date: '12.11.2024',
                            identifier: 'ABC-123456',
                            totalAmount: '132.56',
                        },
                        {
                            id: 2,
                            date: '14.11.2024',
                            identifier: 'EFG-123456',
                            totalAmount: '172.33',
                        },
                    ],
                } as ApiOkResponse<ExampleInvoiceResponseDto[]>)
            }, 1000)
        }
    )
}

const createMockReservationResponse = async () => {
    return await new Promise<ApiResponse<ExampleReservationResponseDto[], any>>(
        (resolve, _reject) => {
            setTimeout(() => {
                resolve({
                    ok: true,
                    data: [
                        {
                            id: 1,
                            reservationNumber: 'ABCD12345',
                            startDate: '13.11.2025',
                            endDate: '15.11.2025',
                        },
                        {
                            id: 2,
                            reservationNumber: 'AZXD12345',
                            startDate: '13.12.2025',
                            endDate: '15.12.2025',
                        },
                    ],
                } as ApiOkResponse<ExampleReservationResponseDto[]>)
            }, 1000)
        }
    )
}

const getCabins = async (): Promise<
    ApiResponse<ExampleCabinResponseDto[], any>
> => {
    //mocking the behaviour before we have the actual endpoints to use
    return await createMockCabinResponse()
}

const getCustomers = async (): Promise<
    ApiResponse<ExampleCustomerResponseDto[], any>
> => {
    //mocking the behaviour before we have the actual endpoints to use
    return await createMockCustomerResponse()
}

const getInvoices = async (): Promise<
    ApiResponse<ExampleInvoiceResponseDto[], any>
> => {
    //mocking the behaviour before we have the actual endpoints to use
    return await createMockInvoiceResponse()
    //return await api.get<{ id: number; label: string }[]>('/invoice')
}

const getReservations = async (): Promise<
    ApiResponse<ExampleReservationResponseDto[], any>
> => {
    //mocking the behaviour before we have the actual endpoints to use
    return await createMockReservationResponse()
    //return await api.get<{ id: number; label: string }[]>('/reservation')
}

export const cabinApi = {
    getCabins,
    getCustomers,
    getInvoices,
    getReservations,
}
