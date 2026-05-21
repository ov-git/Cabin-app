import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { ScreenWrapper } from './common/ScreenWrapper'
import {
    AppRoutes,
    CRUD,
    customerSortableHeaders,
    getCellText,
    getCustomerLabel,
    Pagination as PaginationType,
} from '../types/frontendTypes'
import { customerActions, customerThunks } from '../redux/slices/customer'
import { color } from '../utils/color'
import { SortableColumnHeader } from './common/SortableColumnHeader'
import { Pagination } from './common/Pagination'
import { CustomModal } from './common/CustomModal'
import { Add, Cancel, Delete, Edit } from '@mui/icons-material'
import { CustomerForm, customerFormFields } from '../forms/CustomerForm'

const gridTemplateColumns = '1fr 1fr 1fr 1fr 40px 40px'

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
                entity="customer"
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
                {customerSortableHeaders.map((header) => (
                    <SortableColumnHeader
                        key={header}
                        sorting={sorting}
                        setSorting={customerActions.setSorting}
                        columnIdentifier={header}
                        label={getCustomerLabel(header)}
                    />
                ))}
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
                    {customerSortableHeaders.map((header) => (
                        <Cell
                            key={header}
                            text={getCellText(
                                customer[header],
                                customerFormFields[header]?.type
                            )}
                        />
                    ))}
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
                        disabled={!customer.deletable}
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

    const handleDelete = () => dispatch(customerThunks.deleteCustomer())

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
            flex={1}
        >
            <Typography>
                Haluatko varmasti poistaa asiakkaan "
                {customer.firstName + ' ' + customer.lastName}?"
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
