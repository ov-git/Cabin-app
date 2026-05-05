package com.uef.cabinapi.data;

public class SelectOptionDto {
    private Long value;
    private String label;

    public SelectOptionDto(Long value, String label) {
        this.value = value;
        this.label = label;
    }

    public Long getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }
}
