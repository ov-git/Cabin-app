import {
    ReservationHeader,
    getReservationLabel,
    FormFieldConfig,
} from '../types/frontendTypes'
import { reservationActions } from '../redux/slices/reservation'
import { Cancel } from '@mui/icons-material'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, Typography } from '@mui/material'
import { DynamicFormField } from '../screens/common/DynamicFormField'

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

export const ReservationForm: React.FC = () => {
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
                            {reservationFormHeaders.map((header) => (
                                <DynamicFormField
                                    key={header}
                                    name={header}
                                    label={getReservationLabel(header)}
                                    config={reservationFormFields[header]}
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
