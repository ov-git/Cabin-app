package com.uef.cabinapi.data;

public class PaginationDto {
    private int limit;
    private int offset;
    private long total;

    public PaginationDto(int limit, int offset, long total) {
        this.limit = limit;
        this.offset = offset;
        this.total = total;
    }

    public int getLimit() {
        return limit;
    }

    public int getOffset() {
        return offset;
    }

    public long getTotal() {
        return total;
    }
}
