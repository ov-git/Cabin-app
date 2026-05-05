import {
    InvoiceHeader,
    getInvoiceLabel,
    FormFieldConfig,
} from '../types/frontendTypes'
import { invoiceActions, invoiceThunks } from '../redux/slices/invoice'
import { Cancel } from '@mui/icons-material'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, Typography } from '@mui/material'
import { DynamicFormField } from '../screens/common/DynamicFormField'
import { InvoiceRequestDto } from '../types/endpointTypes'

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

const validateInvoice = (values: Partial<InvoiceRequestDto>) => {
    const errors: Partial<Record<keyof InvoiceRequestDto, string>> = {}

    if (values.customerId == null || Number(values.customerId) <= 0) {
        errors.customerId = 'Asiakas on pakollinen'
    }

    if (values.reservationId == null || Number(values.reservationId) <= 0) {
        errors.reservationId = 'Varaus on pakollinen'
    }

    if (!values.status) {
        errors.status = 'Tila on pakollinen'
    }

    if (!values.issueDate) {
        errors.issueDate = 'Päiväys on pakollinen'
    }

    if (!values.dueDate) {
        errors.dueDate = 'Eräpäivä on pakollinen'
    }

    if (
        values.issueDate &&
        values.dueDate &&
        values.dueDate < values.issueDate
    ) {
        errors.dueDate = 'Eräpäivä ei voi olla ennen päiväystä'
    }

    return errors
}

export const InvoiceForm: React.FC = () => {
    const selectedInvoiceId = useAppSelector(
        (state) => state.invoice.selectedInvoiceId
    )
    const operation = useAppSelector(
        (state) => state.invoice.selectedInvoiceOperation
    )
    const invoices = useAppSelector((state) => state.invoice.invoices)

    const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId)

    const initialValues = selectedInvoice
        ? {
              customerId: selectedInvoice.customer.id,
              reservationId: selectedInvoice.reservation.id,
              amount: selectedInvoice.amount,
              status: selectedInvoice.status,
              issueDate: selectedInvoice.issueDate,
              dueDate: selectedInvoice.dueDate,
          }
        : undefined

    const dispatch = useAppDispatch()

    const handleCancel = () => {
        dispatch(invoiceActions.resetSelectedInvoiceId())
    }

    const handleSubmit = (data: InvoiceRequestDto) => {
        if (operation === 'create') {
            dispatch(invoiceThunks.createInvoice(data))
        } else if (operation === 'update') {
            dispatch(
                invoiceThunks.updateInvoice({
                    id: selectedInvoiceId,
                    ...data,
                })
            )
        }
    }

    return (
        <Form
            onSubmit={handleSubmit}
            validate={validateInvoice}
            initialValues={initialValues}
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
                        {operation === 'update'
                            ? invoiceFormHeaders
                                  .filter(
                                      (h) =>
                                          ![
                                              InvoiceHeader.ReservationId,
                                              InvoiceHeader.CustomerId,
                                              InvoiceHeader.Status,
                                              InvoiceHeader.Amount,
                                          ].includes(h)
                                  )
                                  .map((header) => (
                                      <DynamicFormField
                                          key={header}
                                          name={header}
                                          label={getInvoiceLabel(header)}
                                          config={invoiceFormFields[header]}
                                      />
                                  ))
                            : invoiceFormHeaders.map((header) => (
                                  <DynamicFormField
                                      key={header}
                                      name={header}
                                      label={getInvoiceLabel(header)}
                                      config={invoiceFormFields[header]}
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
