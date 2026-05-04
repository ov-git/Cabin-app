package com.uef.cabinapi.data;

public class ReservationRequestDto {
    private Long customerId;
    private Long cabinId;
    private String startDate;
    private String endDate;
    private String status;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getCabinId() { return cabinId; }
    public void setCabinId(Long cabinId) { this.cabinId = cabinId; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
