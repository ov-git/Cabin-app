import { Box, Button, MenuItem, Select } from '@mui/material'
import { Pagination as PaginationType } from '../../types/frontendTypes'
import { usePagination } from '../../utils/usePagination'
import { color } from '../../utils/color'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

const PAGINATION_OPTIONS = [10, 25, 50]

export const Pagination: React.FC<{
    pagination: PaginationType
    loading: boolean
    setPagination: (pagination: PaginationType) => void
}> = ({ pagination, setPagination, loading }) => {
    const {
        increaseOffset,
        decreaseOffset,
        isLastPage,
        maxOffset,
        changeLimit,
    } = usePagination((pagination) => setPagination(pagination), pagination)

    return (
        <Box
            sx={{
                marginTop: 0.5,
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                justifySelf: 'end',
            }}
        >
            <Button
                disabled={loading}
                onClick={loading ? undefined : decreaseOffset}
                sx={{
                    color: pagination.offset > 0 ? color.primaryMain : '#ccc',
                    cursor: 'pointer',
                    display: 'flex',
                    height: '18px',
                }}
            >
                <KeyboardArrowLeftIcon />
            </Button>
            <Button
                disabled={loading}
                onClick={loading || isLastPage ? undefined : increaseOffset}
                sx={{
                    color: !isLastPage ? color.primaryMain : '#ccc',
                    cursor: 'pointer',
                    display: 'flex',
                    height: '18px',
                }}
            >
                <KeyboardArrowRightIcon />
            </Button>
            <Box sx={{ justifySelf: 'center', fontSize: 12 }}>
                {pagination.offset} - {maxOffset} / {pagination.total}
            </Box>
            <Select
                onChange={(event) => changeLimit(+event.target.value)}
                value={pagination.limit}
                sx={{
                    width: 80,
                    height: 24,
                    fontSize: 12,
                    background: 'white',
                    justifySelf: 'end',
                }}
            >
                {PAGINATION_OPTIONS.map((item) => (
                    <MenuItem sx={{ fontSize: 12 }} key={item} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    )
}
