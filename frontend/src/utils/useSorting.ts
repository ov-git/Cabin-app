import { useAppDispatch } from '../redux/store'
import { Sorting } from '../types/frontendTypes'

export const useSorting = (
    columnIdentifier: string,
    sorting: Sorting,
    setSortingAction: (payload: Sorting) => any
) => {
    const dispatch = useAppDispatch()

    const handleClick = () => {
        if (sorting.orderBy !== columnIdentifier) {
            dispatch(
                setSortingAction({
                    order: 'asc',
                    orderBy: columnIdentifier,
                })
            )
        } else {
            switch (sorting.order) {
                case 'asc':
                    dispatch(
                        setSortingAction({
                            ...sorting,
                            order: 'desc',
                        })
                    )
                    break
                case 'desc':
                    dispatch(
                        setSortingAction({
                            ...sorting,
                            order: null,
                        })
                    )
                    break
                case null:
                    dispatch(
                        setSortingAction({
                            ...sorting,
                            order: 'asc',
                        })
                    )
                    break
                default:
                    break
            }
        }
    }

    return { handleClick }
}
