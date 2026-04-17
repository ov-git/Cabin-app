import { Box } from '@mui/material'
import { ScreenWrapper } from './common/ScreenWrapper'
import { AppRoutes } from '../types/frontendTypes'
import { useAppSelector } from '../redux/store'

export const Home: React.FC = () => {
    const loading = useAppSelector((state) => state.ui.loading)

    return (
        <ScreenWrapper loading={loading} headerKey={AppRoutes.Root}>
            <Box>asd</Box>
        </ScreenWrapper>
    )
}
