package com.uef.cabinapi.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customer;
    @ManyToOne(fetch = FetchType.LAZY)
    private Cabin cabin;

    private LocalDate startDate;
    private LocalDate endDate;

    public Long getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Cabin getCabin() {
        return cabin;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setCabin(Cabin cabin) {
        this.cabin = cabin;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

}
