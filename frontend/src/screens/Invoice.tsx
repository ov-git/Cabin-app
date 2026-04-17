import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { ScreenWrapper } from './common/ScreenWrapper'
import {
    AppRoutes,
    CRUD,
    getInvoiceLabel,
    InvoiceHeader,
    Pagination as PaginationType,
} from '../types/frontendTypes'
import { invoiceActions, invoiceThunks } from '../redux/slices/invoice'
import { SortableColumnHeader } from './common/SortableColumnHeader'
import { color } from '../utils/color'
import { Pagination } from './common/Pagination'
import { CustomModal } from './common/CustomModal'
import { TextField } from 'mui-rff'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Add, Cancel, Delete, Edit } from '@mui/icons-material'

const gridTemplateColumns = '1fr 1fr 1fr 40px 40px'

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

    const handleCreate = () => {
        dispatch(invoiceActions.setOperation('create'))
    }

    return (
        <ScreenWrapper loading={loading} headerKey={AppRoutes.Invoice}>
            <CustomModal
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
            <Button
                onClick={handleCreate}
                sx={{ marginBottom: 1 }}
                variant="outlined"
                color="primary"
                startIcon={<Add />}
            >
                Luo uusi lasku
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
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={invoiceActions.setSorting}
                    columnIdentifier={InvoiceHeader.Identifier}
                    label="Laskun tunniste"
                />
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={invoiceActions.setSorting}
                    columnIdentifier={InvoiceHeader.Date}
                    label="Päivämäärä"
                />
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={invoiceActions.setSorting}
                    columnIdentifier={InvoiceHeader.TotalAmount}
                    label="Loppusumma"
                />
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
                    <Cell text={invoice.identifier} />
                    <Cell text={invoice.date} />
                    <Cell text={invoice.totalAmount} />
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

const InvoiceForm = () => {
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
                            {Object.values(InvoiceHeader).map((h) => (
                                <TextField
                                    key={h}
                                    label={getInvoiceLabel(h)}
                                    name={h}
                                    id={h}
                                    size="small"
                                    type="text"
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
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            height={'100%'}
            justifyContent={'space-between'}
        >
            <Typography>
                Haluatko varmasti poistaa laskun "{invoice.identifier} (
                {invoice.totalAmount}€)?"
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
                    color="secondary"
                    startIcon={<Delete />}
                >
                    Poista
                </Button>
            </Box>
        </Box>
    )
}
