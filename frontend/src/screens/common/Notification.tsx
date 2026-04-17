import { Alert } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { RootState, useAppSelector } from '../../redux/store'
import { uiActions } from '../../redux/slices/ui'

export const Notification = () => {
    const notificationMessage = useAppSelector(
        (state: RootState) => state.ui.notification
    )

    const handleClose = () => {
        dispatch(uiActions.setNotification(null))
    }

    const dispatch = useDispatch()

    useEffect(() => {
        const timeout = setTimeout(
            () => dispatch(uiActions.setNotification(null)),
            5000
        )
        return () => clearTimeout(timeout)
    }, [notificationMessage, dispatch])

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={!!notificationMessage}
            onClose={handleClose}
            style={{ marginTop: -10 }}
        >
            <Alert
                onClose={handleClose}
                severity={notificationMessage?.severity ?? 'info'}
                sx={{ width: '100%', whiteSpace: 'pre-line' }}
            >
                {notificationMessage?.message}
            </Alert>
        </Snackbar>
    )
}
