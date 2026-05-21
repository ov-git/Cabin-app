import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Home } from './screens/Home'
import { AppRoutes } from './types/frontendTypes'
import { Box, createTheme, ThemeProvider } from '@mui/material'
import { color } from './utils/color'
import { TopBar } from './navigation/TopBar'
import { TOP_BAR_MARGIN } from './utils/constants'
import { Cabin } from './screens/Cabin'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { Reservation } from './screens/Reservation'
import { Customer } from './screens/Customer'
import { Invoice } from './screens/Invoice'
import { Notification } from './screens/common/Notification'

function App() {
    const theme = createTheme({
        typography: {
            fontFamily: "'Poppins', Arial, sans-serif",
        },
        palette: {
            primary: { main: color.primaryMain },
            secondary: { main: color.secondaryMain },
        },
    })
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Box
                    sx={{
                        display: 'flex',
                        flex: 1,
                        minWidth: 1400,
                        border: `1px solid ${color.primaryMain}`,
                        backgroundColor: color.background,
                        margin: '0 auto',
                        borderRadius: 1,
                        overflow: 'auto',
                        paddingTop: TOP_BAR_MARGIN,
                        position: 'relative',
                    }}
                >
                    <Notification />
                    <BrowserRouter>
                        <TopBar />
                        <Routes>
                            <Route path={AppRoutes.Cabin} element={<Cabin />} />
                            <Route
                                path={AppRoutes.Reservation}
                                element={<Reservation />}
                            />
                            <Route
                                path={AppRoutes.Customer}
                                element={<Customer />}
                            />
                            <Route
                                path={AppRoutes.Invoice}
                                element={<Invoice />}
                            />
                            <Route
                                path={AppRoutes.Rest}
                                element={<Navigate to={AppRoutes.Cabin} />}
                            />
                        </Routes>
                    </BrowserRouter>
                </Box>
            </Provider>
        </ThemeProvider>
    )
}

export default App
