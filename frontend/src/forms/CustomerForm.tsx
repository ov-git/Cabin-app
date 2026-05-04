import {
    CustomerHeader,
    getCustomerLabel,
    FormFieldConfig,
} from '../types/frontendTypes'
import { customerActions, customerThunks } from '../redux/slices/customer'
import { Cancel } from '@mui/icons-material'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, Typography } from '@mui/material'
import { DynamicFormField } from '../screens/common/DynamicFormField'
import { CustomerRequestDto } from '../types/endpointTypes'

export const customerFormHeaders = [
    CustomerHeader.FirstName,
    CustomerHeader.LastName,
    CustomerHeader.Email,
    CustomerHeader.Phone,
] as const

export const customerFormFields: Record<CustomerHeader, FormFieldConfig> = {
    [CustomerHeader.FirstName]: { type: 'text' },
    [CustomerHeader.LastName]: { type: 'text' },
    [CustomerHeader.Email]: { type: 'text' },
    [CustomerHeader.Phone]: { type: 'text' },
}

const validateCustomer = (values: Partial<CustomerRequestDto>) => {
    const errors: Partial<Record<keyof CustomerRequestDto, string>> = {}

    if (!values.firstName?.trim()) {
        errors.firstName = 'Etunimi on pakollinen'
    }

    if (!values.lastName?.trim()) {
        errors.lastName = 'Sukunimi on pakollinen'
    }

    if (!values.email?.trim()) {
        errors.email = 'Sähköposti on pakollinen'
    } else if (!values.email.includes('@')) {
        errors.email = 'Sähköposti ei ole kelvollinen'
    }

    if (!values.phone?.trim()) {
        errors.phone = 'Puhelin on pakollinen'
    }

    return errors
}

export const CustomerForm: React.FC = () => {
    const selectedCustomerId = useAppSelector(
        (state) => state.customer.selectedCustomerId
    )
    const operation = useAppSelector(
        (state) => state.customer.selectedCustomerOperation
    )
    const customers = useAppSelector((state) => state.customer.customers)

    const dispatch = useAppDispatch()

    const handleCancel = () => {
        dispatch(customerActions.resetSelectedCustomerId())
    }

    const handleSubmit = (data: CustomerRequestDto) => {
        if (operation === 'create') {
            dispatch(customerThunks.createCustomer(data))
        } else if (operation === 'update') {
            dispatch(
                customerThunks.updateCustomer({
                    id: selectedCustomerId,
                    ...data,
                })
            )
        }
    }

    return (
        <Form
            onSubmit={handleSubmit}
            validate={validateCustomer}
            initialValues={customers.find((c) => c.id === selectedCustomerId)}
            render={({ handleSubmit, form }) => (
                <form
                    style={{ flex: 1, display: 'flex' }}
                    onSubmit={handleSubmit}
                >
                    <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        gap={2}
                    >
                        {customerFormHeaders.map((header) => (
                            <DynamicFormField
                                key={header}
                                name={header}
                                label={getCustomerLabel(header)}
                                config={customerFormFields[header]}
                            />
                        ))}

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
                                disabled={form.getState().invalid}
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
