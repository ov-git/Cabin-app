import { Box, Modal, ModalProps, Typography } from '@mui/material'
import { color } from '../../utils/color'
import { CRUD } from '../../types/frontendTypes'

interface Props extends ModalProps {
    operation: CRUD | null
}

export const CustomModal: React.FC<Props> = ({
    children,
    operation,
    ...rest
}) => {
    return (
        <Modal
            {...rest}
            children={
                <Box
                    width={operation === 'delete' ? 500 : 600}
                    position={'absolute'}
                    top={'50%'}
                    left={'50%'}
                    minHeight={100}
                    bgcolor={color.white}
                    maxHeight={800}
                    border={`1px solid ${
                        operation === 'delete' ? 'red' : color.concrete
                    }`}
                    borderRadius={1}
                    boxShadow={'24px'}
                    display={'flex'}
                    flexDirection={'column'}
                    p={3}
                    sx={{
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {operation !== 'delete' && (
                        <Typography mb={3} variant="h4">
                            {operation === 'update' ? 'Muokkaa' : 'Lisää uusi'}
                        </Typography>
                    )}
                    {children}
                </Box>
            }
        />
    )
}
