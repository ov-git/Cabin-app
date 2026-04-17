import {
    UserHeader,
    getUserLabel,
    FormFieldConfig,
} from '../types/frontendTypes'
import { Cancel } from '@mui/icons-material'
import { Form } from 'react-final-form'
import AddBoxIcon from '@mui/icons-material/AddBox'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { Box, Button, Typography } from '@mui/material'
import { DynamicFormField } from '../screens/common/DynamicFormField'
import { userActions } from '../redux/slices/user'

export const userFormHeaders = [
    UserHeader.Username,
    UserHeader.Email,
    UserHeader.Role,
    UserHeader.Active,
] as const

export const userFormFields: Record<UserHeader, FormFieldConfig> = {
    [UserHeader.Username]: { type: 'text' },
    [UserHeader.Email]: { type: 'text' },
    [UserHeader.Role]: {
        type: 'select',
        options: [
            { label: 'Ylläpitäjä', value: 'ADMIN' },
            { label: 'Käyttäjä', value: 'USER' },
        ],
    },
    [UserHeader.Active]: { type: 'boolean' },
}

export const UserForm: React.FC = () => {
    const selectedUserId = useAppSelector((state) => state.user.selectedUserId)

    const users = useAppSelector((state) => state.user.users)

    const dispatch = useAppDispatch()

    const handleCancel = () => {
        dispatch(userActions.resetSelectedUserId())
    }

    return (
        <Form
            onSubmit={() => console.log}
            initialValues={users.find((c) => c.id === selectedUserId)}
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
                            {userFormHeaders.map((header) => (
                                <DynamicFormField
                                    key={header}
                                    name={header}
                                    label={getUserLabel(header)}
                                    config={userFormFields[header]}
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
