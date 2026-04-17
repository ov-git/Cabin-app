import { Box, Typography } from '@mui/material'
import { Sorting } from '../../types/frontendTypes'
import { useSorting } from '../../utils/useSorting'
import { color } from '../../utils/color'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'

export const SortableColumnHeader: React.FC<{
    label: string
    columnIdentifier: string
    sorting: Sorting
    setSorting: ActionCreatorWithPayload<Sorting, any>
}> = ({ label, columnIdentifier, sorting, setSorting }) => {
    const { handleClick } = useSorting(columnIdentifier, sorting, setSorting)

    return (
        <Box
            sx={{
                cursor: 'pointer',
                color: color.primaryMain,
                transition: 'color 0.1s ease-in',
                '&:hover': {
                    color: `${color.primaryMain}50`,
                },
                '&:active': {
                    color: color.primaryMain,
                },
                display: 'flex',
                gap: '1px',
                alignItems: 'center',
            }}
            onClick={handleClick}
        >
            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                {label}
            </Typography>
            {sorting.orderBy === columnIdentifier &&
                sorting.order === 'asc' && (
                    <Typography sx={{ fontSize: 11, display: 'flex' }}>
                        <ArrowUpwardIcon
                            color="success"
                            sx={{ fontSize: 12 }}
                        />
                    </Typography>
                )}
            {sorting.orderBy === columnIdentifier &&
                sorting.order === 'desc' && (
                    <Typography sx={{ fontSize: 12, display: 'flex' }}>
                        <ArrowDownwardIcon
                            color="error"
                            sx={{ fontSize: 12 }}
                        />
                    </Typography>
                )}
        </Box>
    )
}
