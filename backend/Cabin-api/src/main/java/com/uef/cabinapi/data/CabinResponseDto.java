package com.uef.cabinapi.data;

import java.math.BigDecimal;

import com.uef.cabinapi.model.Cabin;

public class CabinResponseDto {
    private Long id;
    private String name;
    private String location;
    private BigDecimal price;
    private int maxGuests;
    private boolean deletable;

    public CabinResponseDto(Cabin cabin, boolean deletable) {
        this.id = cabin.getId();
        this.name = cabin.getName();
        this.location = cabin.getLocation();
        this.price = cabin.getPrice();
        this.maxGuests = cabin.getMaxGuests();
        this.deletable = deletable;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getMaxGuests() {
        return maxGuests;
    }

    public boolean isDeletable() {
        return deletable;
    }
}
