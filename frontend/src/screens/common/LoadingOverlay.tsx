import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import { color } from '../../utils/color'

export const LoadingOverlay: React.FC<{
    loading: boolean
    leaveMarginOnTop?: boolean
}> = ({ loading }) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1000,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `#a2a2a2aa`,
                transition: 'opacity 0.5s ease-in-out',
                opacity: loading ? 1 : 0,
                pointerEvents: loading ? 'auto' : 'none',
                borderRadius: '4px',
            }}
        >
            <CircularProgress
                size={50}
                sx={{
                    color: color.primaryMain,
                }}
            />
        </Box>
    )
}
