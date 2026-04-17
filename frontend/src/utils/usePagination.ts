import { Pagination } from '../types/frontendTypes'

export const usePagination = (
    onChange: (pagination: Pagination) => void,
    pagination: Pagination
) => {
    const changeLimit = (value: number) => {
        onChange({ ...pagination, limit: value, offset: 0 })
    }

    const decreaseOffset = () => {
        const newOffsetValue = pagination.offset - pagination.limit
        if (pagination.offset === 0) return
        if (newOffsetValue > 0) {
            onChange({
                ...pagination,
                offset: pagination.offset - pagination.limit,
            })
        } else {
            onChange({
                ...pagination,
                offset: 0,
            })
        }
    }

    const increaseOffset = () => {
        const newOffsetValue = pagination.offset + pagination.limit

        if (isLastPage) return

        if (newOffsetValue <= pagination.total - pagination.limit) {
            onChange({
                ...pagination,
                offset: pagination.offset + pagination.limit,
            })
        } else {
            onChange({
                ...pagination,
                offset: max,
            })
        }
    }

    const showMaxNumber = pagination.offset + pagination.limit

    const max =
        showMaxNumber > pagination.total ? pagination.total : showMaxNumber

    const isLastPage = pagination.offset + pagination.limit >= pagination.total

    return {
        changeLimit,
        decreaseOffset,
        increaseOffset,
        maxOffset: max,
        isLastPage,
    }
}
