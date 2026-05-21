package com.uef.cabinapi.data;

import com.uef.cabinapi.model.Reservation;

public class ReservationResponseDto {
    private Long id;
    private CustomerResponseDto customer;
    private CabinResponseDto cabin;
    private String startDate;
    private String endDate;
    private String status;
    private boolean deletable;

    public ReservationResponseDto(Reservation reservation, boolean deletable) {
        this.id = reservation.getId();

        this.customer = new CustomerResponseDto(
            reservation.getCustomer(),
            false
        );

        this.cabin = new CabinResponseDto(
            reservation.getCabin(),
            false
        );

        this.startDate = reservation.getStartDate();
        this.endDate = reservation.getEndDate();
        this.status = reservation.getStatus();
        this.deletable = deletable;
    }

    public Long getId() { return id; }
    public CustomerResponseDto getCustomer() { return customer; }
    public CabinResponseDto getCabin() { return cabin; }
    public String getStartDate() { return startDate; }
    public String getEndDate() { return endDate; }
    public String getStatus() { return status; }
    public boolean isDeletable() { return deletable; }
}
