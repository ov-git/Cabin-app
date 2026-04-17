import {
    CustomerHeader,
    getCustomerLabel,
    FormFieldConfig,
} from '../types/frontendTypes'
import { customerActions } from '../redux/slices/customer'
import { Cancel } from '@mui/icons-material'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, Typography } from '@mui/material'
import { DynamicFormField } from '../screens/common/DynamicFormField'

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

export const CustomerForm: React.FC = () => {
    const selectedCustomerId = useAppSelector(
        (state) => state.customer.selectedCustomerId
    )

    const customers = useAppSelector((state) => state.customer.customers)

    const dispatch = useAppDispatch()

    const handleCancel = () => {
        dispatch(customerActions.resetSelectedCustomerId())
    }

    return (
        <Form
            onSubmit={() => console.log}
            initialValues={customers.find((c) => c.id === selectedCustomerId)}
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
                            {customerFormHeaders.map((header) => (
                                <DynamicFormField
                                    key={header}
                                    name={header}
                                    label={getCustomerLabel(header)}
                                    config={customerFormFields[header]}
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
