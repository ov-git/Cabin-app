import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { ScreenWrapper } from './common/ScreenWrapper'
import {
    AppRoutes,
    cabinSortableHeaders,
    CRUD,
    getCabinLabel,
    getCellText,
    Pagination as PaginationType,
} from '../types/frontendTypes'
import { cabinActions, cabinThunks } from '../redux/slices/cabin'
import { SortableColumnHeader } from './common/SortableColumnHeader'
import { color } from '../utils/color'
import { Pagination } from './common/Pagination'
import { CustomModal } from './common/CustomModal'
import { Add, Cancel, Delete, Edit } from '@mui/icons-material'
import { CabinForm, cabinFormFields } from '../forms/CabinForm'

const gridTemplateColumns = '1.5fr 1.5fr 1fr 1fr 40px 40px'

export const Cabin: React.FC = () => {
    const dispatch = useAppDispatch()
    const loading = useAppSelector((state) => state.cabin.loading)
    const pagination = useAppSelector((state) => state.cabin.pagination)
    const sorting = useAppSelector((state) => state.cabin.sorting)
    const selectedCabinId = useAppSelector(
        (state) => state.cabin.selectedCabinId
    )
    const selectedCabinOperation = useAppSelector(
        (state) => state.cabin.selectedCabinOperation
    )
    const handleCloseModal = () => dispatch(cabinActions.resetSelectedCabinId())
    const setPagination = (pagination: PaginationType) => {
        dispatch(cabinActions.setPagination(pagination))
    }
    useEffect(() => {
        dispatch(cabinThunks.getCabins())
    }, [dispatch, pagination.limit, pagination.offset, sorting])

    const handleCreate = () => {
        dispatch(cabinActions.setOperation('create'))
    }

    return (
        <ScreenWrapper loading={loading} headerKey={AppRoutes.Cabin}>
            <CustomModal
                operation={selectedCabinOperation}
                open={
                    selectedCabinId >= 0 || selectedCabinOperation === 'create'
                }
                onClose={handleCloseModal}
                entity="cabin"
            >
                {selectedCabinOperation === 'delete' ? (
                    <CabinDeletion />
                ) : (
                    <CabinForm />
                )}
            </CustomModal>
            <Button
                onClick={handleCreate}
                sx={{ marginBottom: 1 }}
                variant="outlined"
                color="primary"
                startIcon={<Add />}
            >
                Lisää uusi mökki
            </Button>
            <List />
            <Pagination
                loading={loading}
                pagination={pagination}
                setPagination={setPagination}
            />
        </ScreenWrapper>
    )
}

const List: React.FC = () => {
    const data = useAppSelector((state) => state.cabin.cabins)
    const sorting = useAppSelector((state) => state.cabin.sorting)
    const dispatch = useAppDispatch()
    const handleSelect = (id: number, operation: CRUD) => () => {
        dispatch(cabinActions.setSelectedCabinId({ id, operation }))
    }

    return (
        <Box border={`1px solid ${color.concrete}`} p={1} borderRadius={1}>
            <Box
                p={1}
                display={'grid'}
                gridTemplateColumns={gridTemplateColumns}
            >
                {cabinSortableHeaders.map((header) => (
                    <SortableColumnHeader
                        key={header}
                        sorting={sorting}
                        setSorting={cabinActions.setSorting}
                        columnIdentifier={header}
                        label={getCabinLabel(header)}
                    />
                ))}

                <Box />
                <Box />
            </Box>
            {data.map((cabin, idx) => (
                <Box
                    display={'grid'}
                    gridTemplateColumns={gridTemplateColumns}
                    bgcolor={idx % 2 === 0 ? color.white : color.concrete}
                    border={'1px solid transparent'}
                    borderColor={idx % 2 === 0 ? color.concrete : 'transparent'}
                    key={cabin.id}
                    alignItems={'center'}
                    p={1}
                >
                    {cabinSortableHeaders.map((header) => (
                        <Cell
                            key={header}
                            text={getCellText(
                                cabin[header],
                                cabinFormFields[header]?.type
                            )}
                        />
                    ))}
                    <IconButton
                        onClick={handleSelect(cabin.id, 'update')}
                        size="small"
                        color="primary"
                        sx={{ height: 15 }}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={handleSelect(cabin.id, 'delete')}
                        disabled={!cabin.deletable}
                        size="small"
                        color="error"
                        sx={{ height: 15 }}
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Box>
            ))}
        </Box>
    )
}

const Cell: React.FC<{ text: string }> = ({ text }) => {
    return <Typography fontSize={12}>{text}</Typography>
}

const CabinDeletion: React.FC = () => {
    const cabins = useAppSelector((state) => state.cabin.cabins)
    const dispatch = useAppDispatch()
    const selectedCabinId = useAppSelector(
        (state) => state.cabin.selectedCabinId
    )
    const cabin = cabins.find((c) => c.id === selectedCabinId)
    if (!cabin) {
        return null
    }

    const handleClickCancel = () =>
        dispatch(cabinActions.resetSelectedCabinId())

    const handleDelete = () => dispatch(cabinThunks.deleteCabin())
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
            flex={1}
        >
            <Typography>
                Haluatko varmasti poistaa mökin "{cabin.name}?"
            </Typography>
            <Box display={'flex'} gap={1}>
                <Button
                    startIcon={<Cancel />}
                    variant="outlined"
                    color="error"
                    onClick={handleClickCancel}
                >
                    Peruuta
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Delete />}
                    onClick={handleDelete}
                >
                    Poista
                </Button>
            </Box>
        </Box>
    )
}
