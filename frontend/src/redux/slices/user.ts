import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { userApi } from '../../api/api'
import { type ThunkState } from '../store'
import { createThunkFactory, sliceHelper } from '@kallinen/thunk-utility'
import {
    UserHeader,
    CRUD,
    Pagination,
    Sorting,
} from '../../types/frontendTypes'
import { UserResponseDto } from '../../types/endpointTypes'
import { uiActions } from './ui'

const { createThunks, apiThunkFor } = createThunkFactory<ThunkState>()

export interface UserState {
    loading: boolean
    users: UserResponseDto[]
    selectedUserId: number
    selectedUserOperation: CRUD | null
    sorting: Sorting
    pagination: Pagination
}

const initialState: UserState = {
    loading: false,
    users: [],
    selectedUserId: -1,
    selectedUserOperation: null,
    sorting: {
        order: 'desc',
        orderBy: UserHeader.Username,
    },
    pagination: { count: 10, limit: 10, offset: 0, total: 0 },
}

export const thunks = createThunks(
    {
        getUsers: apiThunkFor(userApi.getUsers)(),
        createUser: async (
            user: UserResponseDto,
            { rejectWithValue, dispatch }
        ) => {
            const response = await userApi.createUser(user)
            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: 'Käyttäjä luotu',
                        severity: 'success',
                    })
                )
                dispatch(userActions.resetSelectedUserId())
                dispatch(thunks.getUsers())
                return response.data
            } else return rejectWithValue('Käyttäjän luominen epäonnistui.')
        },
        updateUser: async (
            user: UserResponseDto,
            { rejectWithValue, dispatch }
        ) => {
            const response = await userApi.updateUser(user.id, user)
            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(userActions.resetSelectedUserId())
                dispatch(thunks.getUsers())
                return response.data
            } else return rejectWithValue('Käyttäjän muokkaus epäonnistui.')
        },
        deleteUser: async (
            _: void,
            { rejectWithValue, dispatch, getState }
        ) => {
            const selected = getState().user.selectedUserId
            const response = await userApi.deleteUser(selected)

            if (response.ok) {
                dispatch(
                    uiActions.setNotification({
                        message: response.data,
                        severity: 'success',
                    })
                )
                dispatch(userActions.resetSelectedUserId())
                dispatch(thunks.getUsers())
                return response.data
            } else return rejectWithValue('Käyttäjän poisto epäonnistui.')
        },
    },
    'user'
)

const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSorting: (state, action: PayloadAction<Sorting>) => {
            state.sorting = action.payload
        },
        resetSorting: (state) => {
            state.sorting = initialState.sorting
        },
        setPagination: (state, action: PayloadAction<Pagination>) => {
            state.pagination = action.payload
        },
        setSelectedUserId: (
            state,
            action: PayloadAction<{ id: number; operation: CRUD }>
        ) => {
            state.selectedUserId = action.payload.id
            state.selectedUserOperation = action.payload.operation
        },
        resetSelectedUserId: (state) => {
            state.selectedUserId = initialState.selectedUserId
            state.selectedUserOperation = initialState.selectedUserOperation
        },
        setOperation: (state, action: PayloadAction<CRUD>) => {
            state.selectedUserOperation = action.payload
        },
    },
    extraReducers: (builder) => {
        const util = sliceHelper(builder, thunks)

        util.mapThunksToState('fulfilled', {
            getUsers: 'users',
        })

        builder.addMatcher(
            isAnyOf(
                thunks.getUsers.pending,
                thunks.createUser.pending,
                thunks.updateUser.pending,
                thunks.deleteUser.pending
            ),
            (state) => {
                state.loading = true
            }
        )

        builder.addMatcher(
            isAnyOf(
                thunks.getUsers.rejected,
                thunks.getUsers.fulfilled,
                thunks.createUser.rejected,
                thunks.createUser.fulfilled,
                thunks.updateUser.rejected,
                thunks.updateUser.fulfilled,
                thunks.deleteUser.rejected,
                thunks.deleteUser.fulfilled
            ),
            (state) => {
                state.loading = false
            }
        )
    },
})

export default user
export const userThunks = thunks
export const userActions = user.actions
