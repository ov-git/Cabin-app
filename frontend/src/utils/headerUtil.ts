import { AppRoutes } from '../types/frontendTypes'

export const getHeader = (route: AppRoutes): string => {
    switch (route) {
        case AppRoutes.Root:
            return 'Kotinäkymä'
        case AppRoutes.Cabin:
            return 'Mökkien hallinta'
        case AppRoutes.Customer:
            return 'Asiakkaiden hallinta'
        case AppRoutes.Invoice:
            return 'Laskujen hallinta'
        case AppRoutes.Reservation:
            return 'Varausten hallinta'
        default:
            return ''
    }
}
