import {
    ReservationHeader,
    getReservationLabel,
    FormFieldConfig,
} from '../types/frontendTypes'
import {
    reservationActions,
    reservationThunks,
} from '../redux/slices/reservation'
import { Cancel } from '@mui/icons-material'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, MenuItem, Typography } from '@mui/material'
import { DynamicFormField } from '../screens/common/DynamicFormField'
import { ReservationRequestDto } from '../types/endpointTypes'
import { useEffect } from 'react'
import { customerThunks } from '../redux/slices/customer'
import { cabinThunks } from '../redux/slices/cabin'
import { Select } from 'mui-rff'

export const reservationFormHeaders = [
    ReservationHeader.CustomerId,
    ReservationHeader.CabinId,
    ReservationHeader.StartDate,
    ReservationHeader.EndDate,
    ReservationHeader.Status,
] as const

export const reservationFormFields: Record<ReservationHeader, FormFieldConfig> =
    {
        [ReservationHeader.CustomerId]: { type: 'number' },
        [ReservationHeader.CabinId]: { type: 'number' },
        [ReservationHeader.StartDate]: { type: 'date' },
        [ReservationHeader.EndDate]: { type: 'date' },
        [ReservationHeader.Status]: {
            type: 'select',
            options: [
                { label: 'Vahvistettu', value: 'CONFIRMED' },
                { label: 'Odottaa', value: 'PENDING' },
                { label: 'Peruttu', value: 'CANCELLED' },
            ],
        },
    }

const validateReservation = (values: Partial<ReservationRequestDto>) => {
    const errors: Partial<Record<keyof ReservationRequestDto, string>> = {}

    if (values.customerId == null || Number(values.customerId) <= 0) {
        errors.customerId = 'Asiakas on pakollinen'
    }

    if (values.cabinId == null || Number(values.cabinId) <= 0) {
        errors.cabinId = 'Mökki on pakollinen'
    }

    if (!values.startDate) {
        errors.startDate = 'Alkupäivä on pakollinen'
    }

    if (!values.endDate) {
        errors.endDate = 'Loppupäivä on pakollinen'
    }

    if (
        values.startDate &&
        values.endDate &&
        values.endDate < values.startDate
    ) {
        errors.endDate = 'Loppupäivä ei voi olla ennen alkupäivää'
    }

    return errors
}

export const ReservationForm: React.FC = () => {
    const overlappingReservations = useAppSelector(
        (state) => state.reservation.overlappingReservations
    )
    const selectedReservationId = useAppSelector(
        (state) => state.reservation.selectedReservationId
    )
    const operation = useAppSelector(
        (state) => state.reservation.selectedReservationOperation
    )
    const reservations = useAppSelector(
        (state) => state.reservation.reservations
    )

    const selectedReservation = reservations.find(
        (r) => r.id === selectedReservationId
    )

    const initialValues = selectedReservation
        ? {
              customerId: selectedReservation.customer.id,
              cabinId: selectedReservation.cabin.id,
              startDate: selectedReservation.startDate,
              endDate: selectedReservation.endDate,
              status: selectedReservation.status,
          }
        : undefined

    const dispatch = useAppDispatch()

    const handleCancel = () => {
        dispatch(reservationActions.resetSelectedReservationId())
    }

    const handleSubmit = (data: ReservationRequestDto) => {
        if (operation === 'create') {
            dispatch(reservationThunks.createReservation(data))
        } else if (operation === 'update') {
            dispatch(
                reservationThunks.updateReservation({
                    id: selectedReservationId,
                    ...data,
                })
            )
        }
    }

    const customerOptions = useAppSelector(
        (state) => state.customer.customerOptions
    )
    const cabinOptions = useAppSelector((state) => state.cabin.cabinOptions)

    useEffect(() => {
        dispatch(customerThunks.getCustomerOptions())
        dispatch(cabinThunks.getCabinOptions())
    }, [dispatch])

    return (
        <Form
            onSubmit={handleSubmit}
            validate={validateReservation}
            initialValues={initialValues}
            render={({ handleSubmit, form, values }) => (
                <form
                    style={{ flex: 1, display: 'flex' }}
                    onSubmit={handleSubmit}
                >
                    <ReservationOverlapChecker values={values} />
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        gap={2}
                    >
                        <Select
                            name={ReservationHeader.CabinId}
                            label={getReservationLabel(
                                ReservationHeader.CabinId
                            )}
                        >
                            {cabinOptions.map((co) => (
                                <MenuItem key={co.value} value={co.value}>
                                    {co.label}
                                </MenuItem>
                            ))}
                        </Select>

                        <Select
                            name={ReservationHeader.CustomerId}
                            label={getReservationLabel(
                                ReservationHeader.CustomerId
                            )}
                        >
                            {customerOptions.map((cu) => (
                                <MenuItem key={cu.value} value={cu.value}>
                                    {cu.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {reservationFormHeaders
                            .filter(
                                (h) =>
                                    ![
                                        ReservationHeader.CustomerId,
                                        ReservationHeader.CabinId,
                                        ReservationHeader.Status,
                                    ].includes(h)
                            )
                            .map((header) => (
                                <DynamicFormField
                                    key={header}
                                    name={header}
                                    label={getReservationLabel(header)}
                                    config={reservationFormFields[header]}
                                />
                            ))}
                        <Box>
                            {overlappingReservations.filter(
                                (r) => r.id !== selectedReservationId
                            ).length > 0 && (
                                <Typography color="error" fontSize={12}>
                                    Mökille on jo varaus valitulle ajalle.
                                </Typography>
                            )}
                        </Box>
                        <Box alignSelf="end">
                            <Button
                                color="error"
                                onClick={handleCancel}
                                type="button"
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
                                type="submit"
                                disabled={
                                    form.getState().invalid ||
                                    (overlappingReservations.length > 0 &&
                                        operation === 'create')
                                }
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
            )}
        />
    )
}

const ReservationOverlapChecker: React.FC<{
    values: Partial<ReservationRequestDto>
}> = ({ values }) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const ready =
            values.customerId &&
            values.cabinId &&
            values.startDate &&
            values.endDate

        if (!ready) {
            dispatch(reservationActions.resetOverlappingReservations())
            return
        }

        dispatch(
            reservationThunks.checkReservationOverlap({
                customerId: Number(values.customerId),
                cabinId: Number(values.cabinId),
                startDate: values.startDate,
                endDate: values.endDate,
            } as ReservationRequestDto)
        )
    }, [
        dispatch,
        values.customerId,
        values.cabinId,
        values.startDate,
        values.endDate,
    ])

    return null
}
