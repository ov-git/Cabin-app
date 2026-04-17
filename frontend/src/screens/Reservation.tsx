import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { ScreenWrapper } from './common/ScreenWrapper'
import {
    AppRoutes,
    ReservationHeader,
    Pagination as PaginationType,
    CRUD,
    getReservationLabel,
} from '../types/frontendTypes'
import {
    reservationActions,
    reservationThunks,
} from '../redux/slices/reservation'
import { color } from '../utils/color'
import { SortableColumnHeader } from './common/SortableColumnHeader'
import { Pagination } from './common/Pagination'
import { Add, Cancel, Delete, Edit } from '@mui/icons-material'
import { CustomModal } from './common/CustomModal'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { TextField } from 'mui-rff'

const gridTemplateColumns = '1fr 1fr 1fr 40px 40px'

export const Reservation: React.FC = () => {
    const dispatch = useAppDispatch()

    const loading = useAppSelector((state) => state.reservation.loading)
    const pagination = useAppSelector((state) => state.reservation.pagination)
    const sorting = useAppSelector((state) => state.reservation.sorting)
    const selectedReservationOperation = useAppSelector(
        (state) => state.reservation.selectedReservationOperation
    )
    const selectedReservationId = useAppSelector(
        (state) => state.reservation.selectedReservationId
    )

    useEffect(() => {
        dispatch(reservationThunks.getReservations())
    }, [dispatch, pagination.limit, pagination.offset, sorting])

    const handleCloseModal = () =>
        dispatch(reservationActions.resetSelectedReservationId())

    const setPagination = (pagination: PaginationType) => {
        dispatch(reservationActions.setPagination(pagination))
    }

    const handleCreate = () => {
        dispatch(reservationActions.setOperation('create'))
    }

    return (
        <ScreenWrapper loading={loading} headerKey={AppRoutes.Reservation}>
            <CustomModal
                operation={selectedReservationOperation}
                open={
                    selectedReservationId >= 0 ||
                    selectedReservationOperation === 'create'
                }
                onClose={handleCloseModal}
            >
                {selectedReservationOperation === 'delete' ? (
                    <ReservationDeletion />
                ) : (
                    <ReservationForm />
                )}
            </CustomModal>
            <Button
                onClick={handleCreate}
                sx={{ marginBottom: 1 }}
                variant="outlined"
                color="primary"
                startIcon={<Add />}
            >
                Lisää varaus
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
    const data = useAppSelector((state) => state.reservation.reservations)
    const sorting = useAppSelector((state) => state.reservation.sorting)
    const dispatch = useAppDispatch()
    const handleSelect = (id: number, operation: CRUD) => () => {
        dispatch(reservationActions.setSelectedReservationId({ id, operation }))
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
                    setSorting={reservationActions.setSorting}
                    columnIdentifier={ReservationHeader.ReservationNumber}
                    label="Varausnumero"
                />
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={reservationActions.setSorting}
                    columnIdentifier={ReservationHeader.StartDate}
                    label="Alkupvm."
                />
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={reservationActions.setSorting}
                    columnIdentifier={ReservationHeader.EndDate}
                    label="Loppupvm."
                />
                <Box />
                <Box />
            </Box>
            {data.map((reservation, idx) => (
                <Box
                    display={'grid'}
                    gridTemplateColumns={gridTemplateColumns}
                    bgcolor={idx % 2 === 0 ? color.white : color.concrete}
                    border={'1px solid transparent'}
                    borderColor={idx % 2 === 0 ? color.concrete : 'transparent'}
                    key={reservation.id}
                    alignItems={'center'}
                    p={1}
                >
                    <Cell text={reservation.reservationNumber} />
                    <Cell text={reservation.startDate} />
                    <Cell text={reservation.endDate} />
                    <IconButton
                        onClick={handleSelect(reservation.id, 'update')}
                        size="small"
                        color="primary"
                        sx={{ height: 15 }}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={handleSelect(reservation.id, 'delete')}
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

const ReservationForm: React.FC = () => {
    const selectedReservationId = useAppSelector(
        (state) => state.reservation.selectedReservationId
    )

    const reservations = useAppSelector(
        (state) => state.reservation.reservations
    )
    const dispatch = useAppDispatch()
    const handleCancel = () => {
        dispatch(reservationActions.resetSelectedReservationId())
    }
    return (
        <Form
            onSubmit={() => console.log}
            initialValues={reservations.find(
                (c) => c.id === selectedReservationId
            )}
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
                            {Object.values(ReservationHeader).map((h) => (
                                <TextField
                                    key={h}
                                    label={getReservationLabel(h)}
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

const ReservationDeletion: React.FC = () => {
    const reservations = useAppSelector(
        (state) => state.reservation.reservations
    )
    const dispatch = useAppDispatch()
    const selectedReservationId = useAppSelector(
        (state) => state.reservation.selectedReservationId
    )
    const reservation = reservations.find((c) => c.id === selectedReservationId)

    if (!reservation) {
        return null
    }

    const handleClickCancel = () =>
        dispatch(reservationActions.resetSelectedReservationId())
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            height={'100%'}
            justifyContent={'space-between'}
        >
            <Typography>
                Haluatko varmasti poistaa varauksen "
                {reservation.reservationNumber}?"
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
