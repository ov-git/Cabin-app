import { combineSlices, configureStore, createAction } from '@reduxjs/toolkit'
import ui from './slices/ui'
import { useDispatch, useSelector } from 'react-redux'
import customer from './slices/customer'
import invoice from './slices/invoice'
import reservation from './slices/reservation'
import cabin from './slices/cabin'
import user from './slices/user'
export const resetStore = createAction('app/resetStore')

const rootReducer = combineSlices(
    ui,
    customer,
    invoice,
    reservation,
    cabin,
    user
)

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export type ThunkState = {
    state: RootState
    dispatch: AppDispatch
}
