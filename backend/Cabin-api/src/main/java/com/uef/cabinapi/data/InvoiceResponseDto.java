package com.uef.cabinapi.data;

import java.math.BigDecimal;

import com.uef.cabinapi.model.Invoice;

public class InvoiceResponseDto {
    private Long id;
    private CustomerResponseDto customer;
    private ReservationResponseDto reservation;
    private BigDecimal amount;
    private String status;
    private String issueDate;
    private String dueDate;

    public InvoiceResponseDto(Invoice invoice) {
        this.id = invoice.getId();

        this.customer = new CustomerResponseDto(
            invoice.getCustomer(),
            false
        );

        this.reservation = new ReservationResponseDto(
            invoice.getReservation(),
            false
        );

        this.amount = invoice.getAmount();
        this.status = invoice.getStatus();
        this.issueDate = invoice.getIssueDate();
        this.dueDate = invoice.getDueDate();
    }

    public Long getId() { return id; }
    public CustomerResponseDto getCustomer() { return customer; }
    public ReservationResponseDto getReservation() { return reservation; }
    public BigDecimal getAmount() { return amount; }
    public String getStatus() { return status; }
    public String getIssueDate() { return issueDate; }
    public String getDueDate() { return dueDate; }
}
