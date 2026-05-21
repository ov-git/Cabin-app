import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { ScreenWrapper } from './common/ScreenWrapper'
import {
    AppRoutes,
    Pagination as PaginationType,
    CRUD,
    getReservationLabel,
    reservationSortableHeaders,
    getCellText,
    ReservationHeader,
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
import {
    ReservationForm,
    reservationFormFields,
} from '../forms/ReservationForm'
import { ReservationResponseDto } from '../types/endpointTypes'

const gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr 40px 40px'

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
                entity="reservation"
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
                {reservationSortableHeaders.map((header) => (
                    <SortableColumnHeader
                        key={header}
                        sorting={sorting}
                        setSorting={reservationActions.setSorting}
                        columnIdentifier={header}
                        label={getReservationLabel(header)}
                    />
                ))}
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
                    {reservationSortableHeaders.map((header) => (
                        <Cell
                            key={header}
                            text={getReservationCellText(reservation, header)}
                        />
                    ))}
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
                        disabled={!reservation.deletable}
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

    const handleDelete = () => dispatch(reservationThunks.deleteReservation())

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
            flex={1}
        >
            <Typography>
                Haluatko varmasti poistaa varauksen "{reservation.id}?"
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
                    onClick={handleDelete}
                    color="secondary"
                    startIcon={<Delete />}
                >
                    Poista
                </Button>
            </Box>
        </Box>
    )
}

const getReservationCellText = (
    reservation: ReservationResponseDto,
    header: ReservationHeader
) => {
    if (header === ReservationHeader.CustomerId) {
        return `${reservation.customer.firstName} ${reservation.customer.lastName}`
    }

    if (header === ReservationHeader.CabinId) {
        return reservation.cabin.name
    }

    return getCellText(reservation[header], reservationFormFields[header]?.type)
}
