import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { ScreenWrapper } from './common/ScreenWrapper'
import {
    AppRoutes,
    CRUD,
    CustomerHeader,
    getCustomerLabel,
    Pagination as PaginationType,
} from '../types/frontendTypes'
import { customerActions, customerThunks } from '../redux/slices/customer'
import { color } from '../utils/color'
import { SortableColumnHeader } from './common/SortableColumnHeader'
import { Pagination } from './common/Pagination'
import { CustomModal } from './common/CustomModal'
import { Form } from 'react-final-form'
import { TextField } from 'mui-rff'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { Add, Cancel, Delete, Edit } from '@mui/icons-material'

const gridTemplateColumns = '1fr 1fr 1fr 40px 40px'

export const Customer: React.FC = () => {
    const dispatch = useAppDispatch()

    const loading = useAppSelector((state) => state.customer.loading)
    const pagination = useAppSelector((state) => state.customer.pagination)
    const sorting = useAppSelector((state) => state.customer.sorting)
    const selectedCustomerOperation = useAppSelector(
        (state) => state.customer.selectedCustomerOperation
    )
    const selectedCustomerId = useAppSelector(
        (state) => state.customer.selectedCustomerId
    )

    useEffect(() => {
        dispatch(customerThunks.getCustomers())
    }, [dispatch, pagination.limit, pagination.offset, sorting])

    const handleCloseModal = () =>
        dispatch(customerActions.resetSelectedCustomerId())

    const setPagination = (pagination: PaginationType) => {
        dispatch(customerActions.setPagination(pagination))
    }

    const handleCreate = () => {
        dispatch(customerActions.setOperation('create'))
    }

    return (
        <ScreenWrapper loading={loading} headerKey={AppRoutes.Customer}>
            <CustomModal
                operation={selectedCustomerOperation}
                open={
                    selectedCustomerId >= 0 ||
                    selectedCustomerOperation === 'create'
                }
                onClose={handleCloseModal}
            >
                {selectedCustomerOperation === 'delete' ? (
                    <CustomerDeletion />
                ) : (
                    <CustomerForm />
                )}
            </CustomModal>
            <Button
                onClick={handleCreate}
                sx={{ marginBottom: 1 }}
                variant="outlined"
                color="primary"
                startIcon={<Add />}
            >
                Lisää uusi asiakas
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
    const data = useAppSelector((state) => state.customer.customers)
    const sorting = useAppSelector((state) => state.customer.sorting)
    const dispatch = useAppDispatch()
    const handleSelect = (id: number, operation: CRUD) => () => {
        dispatch(customerActions.setSelectedCustomerId({ id, operation }))
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
                    setSorting={customerActions.setSorting}
                    columnIdentifier={CustomerHeader.Name}
                    label="Nimi"
                />
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={customerActions.setSorting}
                    columnIdentifier={CustomerHeader.Phone}
                    label="Puhelin"
                />
                <SortableColumnHeader
                    sorting={sorting}
                    setSorting={customerActions.setSorting}
                    columnIdentifier={CustomerHeader.Email}
                    label="Sähköposti"
                />
                <Box />
                <Box />
            </Box>
            {data.map((customer, idx) => (
                <Box
                    display={'grid'}
                    gridTemplateColumns={gridTemplateColumns}
                    bgcolor={idx % 2 === 0 ? color.white : color.concrete}
                    border={'1px solid transparent'}
                    borderColor={idx % 2 === 0 ? color.concrete : 'transparent'}
                    key={customer.id}
                    alignItems={'center'}
                    p={1}
                >
                    <Cell text={customer.name} />
                    <Cell text={customer.phone} />
                    <Cell text={customer.email} />
                    <IconButton
                        onClick={handleSelect(customer.id, 'update')}
                        size="small"
                        color="primary"
                        sx={{ height: 15 }}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={handleSelect(customer.id, 'delete')}
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

const CustomerForm: React.FC = () => {
    const customers = useAppSelector((state) => state.customer.customers)
    const selectedCustomerId = useAppSelector(
        (state) => state.customer.selectedCustomerId
    )
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
                            {Object.values(CustomerHeader).map((h) => (
                                <TextField
                                    key={h}
                                    label={getCustomerLabel(h)}
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

const CustomerDeletion: React.FC = () => {
    const customers = useAppSelector((state) => state.customer.customers)
    const dispatch = useAppDispatch()
    const selectedCustomerId = useAppSelector(
        (state) => state.customer.selectedCustomerId
    )
    const customer = customers.find((c) => c.id === selectedCustomerId)
    if (!customer) {
        return null
    }

    const handleClickCancel = () =>
        dispatch(customerActions.resetSelectedCustomerId())
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            height={'100%'}
            justifyContent={'space-between'}
        >
            <Typography>
                Haluatko varmasti poistaa asiakkaan "{customer.name}?"
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
