import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { ScreenWrapper } from './common/ScreenWrapper'
import {
    AppRoutes,
    CRUD,
    getCellText,
    getInvoiceLabel,
    InvoiceHeader,
    invoiceSortableHeaders,
    Pagination as PaginationType,
} from '../types/frontendTypes'
import { invoiceActions, invoiceThunks } from '../redux/slices/invoice'
import { SortableColumnHeader } from './common/SortableColumnHeader'
import { color } from '../utils/color'
import { Pagination } from './common/Pagination'
import { CustomModal } from './common/CustomModal'
import { Cancel, Delete, Edit } from '@mui/icons-material'
import { InvoiceForm, invoiceFormFields } from '../forms/InvoiceForm'
import { InvoiceResponseDto } from '../types/endpointTypes'

const gridTemplateColumns = '1fr 1fr 1fr 1fr 1fr 1fr 40px 40px'

export const Invoice: React.FC = () => {
    const dispatch = useAppDispatch()

    const loading = useAppSelector((state) => state.invoice.loading)
    const pagination = useAppSelector((state) => state.invoice.pagination)
    const sorting = useAppSelector((state) => state.invoice.sorting)
    const selectedInvoiceOperation = useAppSelector(
        (state) => state.invoice.selectedInvoiceOperation
    )
    const selectedInvoiceId = useAppSelector(
        (state) => state.invoice.selectedInvoiceId
    )

    useEffect(() => {
        dispatch(invoiceThunks.getInvoices())
    }, [dispatch, pagination.limit, pagination.offset, sorting])

    const handleCloseModal = () =>
        dispatch(invoiceActions.resetSelectedInvoiceId())

    const setPagination = (pagination: PaginationType) => {
        dispatch(invoiceActions.setPagination(pagination))
    }

    return (
        <ScreenWrapper loading={loading} headerKey={AppRoutes.Invoice}>
            <CustomModal
                entity="invoice"
                operation={selectedInvoiceOperation}
                open={
                    selectedInvoiceId >= 0 ||
                    selectedInvoiceOperation === 'create'
                }
                onClose={handleCloseModal}
            >
                {selectedInvoiceOperation === 'delete' ? (
                    <InvoiceDeletion />
                ) : (
                    <InvoiceForm />
                )}
            </CustomModal>
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
    const data = useAppSelector((state) => state.invoice.invoices)
    const sorting = useAppSelector((state) => state.invoice.sorting)
    const dispatch = useAppDispatch()
    const handleSelect = (id: number, operation: CRUD) => () => {
        dispatch(invoiceActions.setSelectedInvoiceId({ id, operation }))
    }

    return (
        <Box border={`1px solid ${color.concrete}`} p={1} borderRadius={1}>
            <Box
                p={1}
                display={'grid'}
                gridTemplateColumns={gridTemplateColumns}
            >
                {invoiceSortableHeaders.map((header) => (
                    <SortableColumnHeader
                        key={header}
                        sorting={sorting}
                        setSorting={invoiceActions.setSorting}
                        columnIdentifier={header}
                        label={getInvoiceLabel(header)}
                    />
                ))}
                <Box />
                <Box />
            </Box>
            {data.map((invoice, idx) => (
                <Box
                    display={'grid'}
                    gridTemplateColumns={gridTemplateColumns}
                    bgcolor={idx % 2 === 0 ? color.white : color.concrete}
                    border={'1px solid transparent'}
                    borderColor={idx % 2 === 0 ? color.concrete : 'transparent'}
                    key={invoice.id}
                    alignItems={'center'}
                    p={1}
                >
                    {invoiceSortableHeaders.map((header) => (
                        <Cell
                            key={header}
                            text={getInvoiceCellText(invoice, header)}
                        />
                    ))}
                    <IconButton
                        onClick={handleSelect(invoice.id, 'update')}
                        size="small"
                        color="primary"
                        sx={{ height: 15 }}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={handleSelect(invoice.id, 'delete')}
                        disabled={!invoice.deletable}
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

const InvoiceDeletion: React.FC = () => {
    const invoices = useAppSelector((state) => state.invoice.invoices)
    const dispatch = useAppDispatch()
    const selectedInvoiceId = useAppSelector(
        (state) => state.invoice.selectedInvoiceId
    )
    const invoice = invoices.find((c) => c.id === selectedInvoiceId)

    if (!invoice) {
        return null
    }

    const handleClickCancel = () =>
        dispatch(invoiceActions.resetSelectedInvoiceId())

    const handleDelete = () => dispatch(invoiceThunks.deleteInvoice())

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
            flex={1}
        >
            <Typography>
                Haluatko varmasti poistaa laskun "{invoice.id} ({invoice.amount}
                €)?"
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

const getInvoiceCellText = (
    invoice: InvoiceResponseDto,
    header: InvoiceHeader
) => {
    if (header === InvoiceHeader.CustomerId) {
        return `${invoice.customer.firstName} ${invoice.customer.lastName}`
    }

    if (header === InvoiceHeader.ReservationId) {
        return String(invoice.reservation.id)
    }

    return getCellText(invoice[header], invoiceFormFields[header]?.type)
}
