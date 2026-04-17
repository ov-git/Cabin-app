import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { ScreenWrapper } from './common/ScreenWrapper'
import {
    AppRoutes,
    CabinHeader,
    CRUD,
    getCabinLabel,
    Pagination as PaginationType,
} from '../types/frontendTypes'
import { cabinActions, cabinThunks } from '../redux/slices/cabin'
import { SortableColumnHeader } from './common/SortableColumnHeader'
import { color } from '../utils/color'
import { Pagination } from './common/Pagination'
import { Form } from 'react-final-form'
import { TextField } from 'mui-rff'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { CustomModal } from './common/CustomModal'
import { Add, Cancel, Delete, Edit } from '@mui/icons-material'

const gridTemplateColumns = '1fr 1fr 1fr 40px 40px'

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
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={cabinActions.setSorting}
                    columnIdentifier={CabinHeader.Name}
                    label="Nimi"
                />
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={cabinActions.setSorting}
                    columnIdentifier={CabinHeader.Size}
                    label="Koko"
                />
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={cabinActions.setSorting}
                    columnIdentifier={CabinHeader.PricePerDay}
                    label="Hinta"
                />
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
                    <Cell text={cabin.name} />
                    <Cell text="50m2" />
                    <Cell text="35€" />
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

const CabinForm: React.FC = () => {
    const cabins = useAppSelector((state) => state.cabin.cabins)
    const selectedCabinId = useAppSelector(
        (state) => state.cabin.selectedCabinId
    )
    const dispatch = useAppDispatch()
    const handleCancel = () => {
        dispatch(cabinActions.resetSelectedCabinId())
    }
    return (
        <Form
            onSubmit={() => console.log}
            initialValues={cabins.find((c) => c.id === selectedCabinId)}
            render={({ handleSubmit, form }) => {
                return (
                    <form
                        style={{ flex: 1, display: 'flex' }}
                        onSubmit={handleSubmit}
                    >
                        <Box
                            flex={1}
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'space-between'}
                            gap={2}
                        >
                            {Object.values(CabinHeader).map((h) => (
                                <TextField
                                    key={h}
                                    label={getCabinLabel(h)}
                                    name={h}
                                    id={h}
                                    size="small"
                                    type="text"
                                />
                            ))}
                            <Box alignSelf={'end'}>
                                <Button
                                    sx={{
                                        gridColumn: 'span 2',
                                        minHeight: 'unset',
                                        height: 50,
                                        minWidth: 120,
                                        alignSelf: 'end',
                                    }}
                                    color="error"
                                    onClick={handleCancel}
                                    disabled={form.getState().invalid}
                                    type="submit"
                                    startIcon={
                                        <Cancel
                                            sx={{
                                                height: 15,
                                                marginBottom: '3px',
                                                marginRight: '2px',
                                            }}
                                        />
                                    }
                                >
                                    <Typography>Peruuta</Typography>
                                </Button>
                                <Button
                                    sx={{
                                        gridColumn: 'span 2',
                                        minHeight: 'unset',
                                        height: 50,
                                        minWidth: 120,
                                        alignSelf: 'end',
                                    }}
                                    disabled={form.getState().invalid}
                                    type="submit"
                                    startIcon={
                                        <AddBoxIcon
                                            sx={{
                                                height: 15,
                                                marginBottom: '3px',
                                                marginRight: '2px',
                                            }}
                                        />
                                    }
                                >
                                    <Typography>Tallenna</Typography>
                                </Button>
                            </Box>
                        </Box>
                    </form>
                )
            }}
        />
    )
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
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            height={'100%'}
            justifyContent={'space-between'}
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
                >
                    Poista
                </Button>
            </Box>
        </Box>
    )
}
