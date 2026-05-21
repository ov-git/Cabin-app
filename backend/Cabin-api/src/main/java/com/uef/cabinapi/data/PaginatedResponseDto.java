package com.uef.cabinapi.data;

public class PaginatedResponseDto<T> {
    private T data;
    private PaginationDto pagination;

    public PaginatedResponseDto(T data, PaginationDto pagination) {
        this.data = data;
        this.pagination = pagination;
    }

    public T getData() {
        return data;
    }

    public PaginationDto getPagination() {
        return pagination;
    }
}
