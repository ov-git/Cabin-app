import {
    CabinHeader,
    getCabinLabel,
    FormFieldConfig,
} from '../types/frontendTypes'
import { cabinActions } from '../redux/slices/cabin'
import { Cancel } from '@mui/icons-material'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, Typography } from '@mui/material'
import { DynamicFormField } from '../screens/common/DynamicFormField'

export const cabinFormHeaders = [
    CabinHeader.Name,
    CabinHeader.Location,
    CabinHeader.PricePerNight,
    CabinHeader.MaxGuests,
    CabinHeader.Bedrooms,
    CabinHeader.Bathrooms,
    CabinHeader.Amenities,
    CabinHeader.Available,
    CabinHeader.Rating,
] as const

export const cabinFormFields: Record<CabinHeader, FormFieldConfig> = {
    [CabinHeader.Name]: { type: 'text' },
    [CabinHeader.Location]: { type: 'text' },
    [CabinHeader.PricePerNight]: { type: 'number' },
    [CabinHeader.MaxGuests]: { type: 'number' },
    [CabinHeader.Bedrooms]: { type: 'number' },
    [CabinHeader.Bathrooms]: { type: 'number' },
    [CabinHeader.Amenities]: { type: 'text' },
    [CabinHeader.Available]: { type: 'boolean' },
    [CabinHeader.Rating]: { type: 'number' },
}

export const CabinForm: React.FC = () => {
    const selectedCabinId = useAppSelector(
        (state) => state.cabin.selectedCabinId
    )

    const cabins = useAppSelector((state) => state.cabin.cabins)

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
                            {cabinFormHeaders.map((header) => (
                                <DynamicFormField
                                    key={header}
                                    name={header}
                                    label={getCabinLabel(header)}
                                    config={cabinFormFields[header]}
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
