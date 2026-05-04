package com.uef.cabinapi.data;

import com.uef.cabinapi.model.Customer;

public class CustomerResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private boolean deletable;

    public CustomerResponseDto(Customer customer, boolean deletable) {
        this.id = customer.getId();
        this.firstName = customer.getFirstName();
        this.lastName = customer.getLastName();
        this.email = customer.getEmail();
        this.phone = customer.getPhone();
        this.deletable = deletable;
    }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public boolean isDeletable() { return deletable; }
}
