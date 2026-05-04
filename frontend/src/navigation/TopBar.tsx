import { Box, Button, Typography } from '@mui/material'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { color } from '../utils/color'
import { AppRoutes } from '../types/frontendTypes'
import { TOP_BAR_MARGIN } from '../utils/constants'

export const TopBar = () => {
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                pl: 1,
                top: 0,
                background: color.primaryMain,
                color: '#fff',
                height: TOP_BAR_MARGIN,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    flex: 3,
                    display: 'flex',
                    justifyContent: 'start',
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <NavButton
                    label="Mökit"
                    navigate={navigate}
                    route={AppRoutes.Cabin}
                />
                <NavButton
                    label="Asiakkaat"
                    navigate={navigate}
                    route={AppRoutes.Customer}
                />
                <NavButton
                    label="Laskut"
                    navigate={navigate}
                    route={AppRoutes.Invoice}
                />
                <NavButton
                    label="Varaukset"
                    navigate={navigate}
                    route={AppRoutes.Reservation}
                />
            </Box>
        </Box>
    )
}

const NavButton: React.FC<{
    navigate: NavigateFunction
    route: AppRoutes
    label: string
}> = ({ navigate, route, label }) => {
    return (
        <Button
            sx={{
                color:
                    location.pathname === route
                        ? color.secondaryMain
                        : color.white,
            }}
            onClick={() => navigate(route)}
        >
            <Typography fontSize={14} noWrap>
                {label}
            </Typography>
        </Button>
    )
}
