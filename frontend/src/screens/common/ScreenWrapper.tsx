import { Box, BoxProps, Typography } from '@mui/material'
import { ReactElement } from 'react'
import { color } from '../../utils/color'
import { AppRoutes } from '../../types/frontendTypes'
import { getHeader } from '../../utils/headerUtil'
import { LoadingOverlay } from './LoadingOverlay'

export const ScreenWrapper: React.FC<{
    children: ReactElement | ReactElement[]
    contentContainerProps?: BoxProps
    headerKey: AppRoutes
    loading: boolean
}> = ({ children, contentContainerProps, headerKey, loading }) => {
    return (
        <Box
            borderRadius={1}
            position={'relative'}
            m={2}
            p={2}
            bgcolor={color.white}
            flex={1}
            {...contentContainerProps}
        >
            <LoadingOverlay loading={loading} />
            <Typography mb={2}>{getHeader(headerKey)}</Typography>
            {children}
        </Box>
    )
}
