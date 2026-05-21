import {
    CabinHeader,
    getCabinLabel,
    FormFieldConfig,
} from '../types/frontendTypes'
import { cabinActions, cabinThunks } from '../redux/slices/cabin'
import { Cancel } from '@mui/icons-material'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, Typography } from '@mui/material'
import { DynamicFormField } from '../screens/common/DynamicFormField'
import { CabinRequestDto } from '../types/endpointTypes'

export const cabinFormHeaders = [
    CabinHeader.Name,
    CabinHeader.Location,
    CabinHeader.Price,
    CabinHeader.MaxGuests,
] as const

export const cabinFormFields: Record<CabinHeader, FormFieldConfig> = {
    [CabinHeader.Name]: { type: 'text' },
    [CabinHeader.Location]: { type: 'text' },
    [CabinHeader.Price]: { type: 'number' },
    [CabinHeader.MaxGuests]: { type: 'number' },
}

const validateCabin = (values: Partial<CabinRequestDto>) => {
    const errors: Partial<Record<keyof CabinRequestDto, string>> = {}

    if (!values.name?.trim()) {
        errors.name = 'Nimi on pakollinen'
    }

    if (!values.location?.trim()) {
        errors.location = 'Sijainti on pakollinen'
    }

    if (values.price == null || Number(values.price) <= 0) {
        errors.price = 'Hinnan täytyy olla suurempi kuin 0'
    }

    if (values.maxGuests == null || Number(values.maxGuests) <= 0) {
        errors.maxGuests = 'Henkilömäärän täytyy olla suurempi kuin 0'
    }

    return errors
}

export const CabinForm: React.FC = () => {
    const selectedCabinId = useAppSelector(
        (state) => state.cabin.selectedCabinId
    )

    const operation = useAppSelector(
        (state) => state.cabin.selectedCabinOperation
    )

    const cabins = useAppSelector((state) => state.cabin.cabins)

    const dispatch = useAppDispatch()

    const handleCancel = () => {
        dispatch(cabinActions.resetSelectedCabinId())
    }

    const handleSubmit = (data: CabinRequestDto) => {
        if (operation === 'create') {
            dispatch(cabinThunks.createCabin(data))
        } else if (operation === 'update') {
            dispatch(cabinThunks.updateCabin({ id: selectedCabinId, ...data }))
        }
    }

    return (
        <Form
            onSubmit={handleSubmit}
            validate={validateCabin}
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
