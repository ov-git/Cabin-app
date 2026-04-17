import {
    InvoiceHeader,
    getInvoiceLabel,
    FormFieldConfig,
} from '../types/frontendTypes'
import { invoiceActions } from '../redux/slices/invoice'
import { Cancel } from '@mui/icons-material'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, Typography } from '@mui/material'
import { DynamicFormField } from '../screens/common/DynamicFormField'

export const invoiceFormHeaders = [
    InvoiceHeader.CustomerId,
    InvoiceHeader.ReservationId,
    InvoiceHeader.Amount,
    InvoiceHeader.Status,
    InvoiceHeader.IssueDate,
    InvoiceHeader.DueDate,
] as const

export const invoiceFormFields: Record<InvoiceHeader, FormFieldConfig> = {
    [InvoiceHeader.CustomerId]: { type: 'number' },
    [InvoiceHeader.ReservationId]: { type: 'number' },
    [InvoiceHeader.Amount]: { type: 'number' },
    [InvoiceHeader.Status]: {
        type: 'select',
        options: [
            { label: 'Maksettu', value: 'PAID' },
            { label: 'Odottaa', value: 'PENDING' },
            { label: 'Peruttu', value: 'CANCELLED' },
        ],
    },
    [InvoiceHeader.IssueDate]: { type: 'date' },
    [InvoiceHeader.DueDate]: { type: 'date' },
}

export const InvoiceForm: React.FC = () => {
    const selectedInvoiceId = useAppSelector(
        (state) => state.invoice.selectedInvoiceId
    )

    const invoices = useAppSelector((state) => state.invoice.invoices)

    const dispatch = useAppDispatch()

    const handleCancel = () => {
        dispatch(invoiceActions.resetSelectedInvoiceId())
    }

    return (
        <Form
            onSubmit={() => console.log}
            initialValues={invoices.find((c) => c.id === selectedInvoiceId)}
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
                            {invoiceFormHeaders.map((header) => (
                                <DynamicFormField
                                    key={header}
                                    name={header}
                                    label={getInvoiceLabel(header)}
                                    config={invoiceFormFields[header]}
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
