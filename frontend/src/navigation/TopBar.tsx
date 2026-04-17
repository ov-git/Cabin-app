import {
    Box,
    Button,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material'
import { useState } from 'react'

import { NavigateFunction, useNavigate } from 'react-router-dom'
import UsrMgmtIcon from '@mui/icons-material/PeopleAlt'
import { color } from '../utils/color'
import { AppRoutes } from '../types/frontendTypes'
import { TOP_BAR_MARGIN } from '../utils/constants'

export const TopBar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = !!anchorEl
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (!open) {
            setAnchorEl(event.currentTarget)
        }
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const navigate = useNavigate()

    return (
        <Box
            sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                pl:1,
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
                    label="Päänäkymä"
                    navigate={navigate}
                    route={AppRoutes.Root}
                />
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
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'end',
                    alignSelf: 'stretch',
                }}
            >
                {/* <Box
                    data-e2e-id="top-bar-user"
                    onClick={handleClick}
                    sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingRight: 2,
                        paddingLeft: 2,
                        transition:
                            'background 0.2s ease-in-out, color 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: color.primaryMain,
                            color: color.text,
                        },
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: '100%',
                            background: '#fff',
                            width: 32,
                            height: 32,
                            color: color.primaryMain,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body1">tt</Typography>
                    </Box>
                    <Box sx={{ marginLeft: 1 }}>
                        <Typography color={color.text}>test</Typography>
                    </Box>
                </Box> */}
                {/* <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                background: color.primaryMain,
                                borderLeft: '1px solid black',
                                borderBottom: '1px solid black',
                                borderRight: '1px solid black',

                                borderRadius: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={() => navigate(AppRoutes.Root)}>
                        <ListItemIcon>
                            <UsrMgmtIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography color={color.text}>placeholder</Typography>
                    </MenuItem>
                </Menu> */}
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
