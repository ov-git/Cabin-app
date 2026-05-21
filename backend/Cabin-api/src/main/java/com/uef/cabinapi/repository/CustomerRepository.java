package com.uef.cabinapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uef.cabinapi.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
