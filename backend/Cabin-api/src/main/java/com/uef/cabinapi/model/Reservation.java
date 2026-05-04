package com.uef.cabinapi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Customer customer;

    @ManyToOne(optional = false)
    private Cabin cabin;

    private String startDate;
    private String endDate;
    private String status;

    protected Reservation() {}

    public Reservation(Customer customer, Cabin cabin, String startDate, String endDate, String status) {
        this.customer = customer;
        this.cabin = cabin;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    public Long getId() { return id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Cabin getCabin() { return cabin; }
    public void setCabin(Cabin cabin) { this.cabin = cabin; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
