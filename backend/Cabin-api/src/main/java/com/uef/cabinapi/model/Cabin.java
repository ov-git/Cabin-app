package com.uef.cabinapi.model;
import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
@Table(name = "cabins")
public class Cabin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private BigDecimal price;
    private int maxGuests;

    protected Cabin() {}

    public Cabin(String name, String location, BigDecimal price, int maxGuests) {
        this.name = name;
        this.location = location;
        this.price = price;
        this.maxGuests = maxGuests;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getMaxGuests() {
        return maxGuests;
    }

    public void setMaxGuests(int maxGuests) {
        this.maxGuests = maxGuests;
    }
}
