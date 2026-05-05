package com.uef.cabinapi.service;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.uef.cabinapi.data.CustomerRequestDto;
import com.uef.cabinapi.data.CustomerResponseDto;
import com.uef.cabinapi.data.SelectOptionDto;
import com.uef.cabinapi.model.Customer;
import com.uef.cabinapi.repository.CustomerRepository;
import com.uef.cabinapi.repository.InvoiceRepository;
import com.uef.cabinapi.repository.ReservationRepository;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final ReservationRepository reservationRepository;
    private final InvoiceRepository invoiceRepository;

    public CustomerService(
        CustomerRepository repository,
        ReservationRepository reservationRepository,
        InvoiceRepository invoiceRepository
    ) {
        this.customerRepository = repository;
        this.reservationRepository = reservationRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public Page<CustomerResponseDto> getCustomers(
        String order,
        String orderBy,
        int limit,
        int offset
    ) {
        Sort.Direction direction = order.equalsIgnoreCase("desc")
            ? Sort.Direction.DESC
            : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(
            offset / limit,
            limit,
            Sort.by(direction, orderBy)
        );

        return customerRepository.findAll(pageable)
            .map(customer -> new CustomerResponseDto(
                customer,
                !reservationRepository.existsByCustomerId(customer.getId())
                    && !invoiceRepository.existsByCustomerId(customer.getId())
            ));
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, CustomerRequestDto dto) {
        Customer customer = getCustomerById(id);

        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());

        return customerRepository.save(customer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public List<SelectOptionDto> getCustomerOptions() {
        return customerRepository.findAll()
            .stream()
            .map(customer -> new SelectOptionDto(
                customer.getId(),
                customer.getFirstName() + " " + customer.getLastName()
            ))
            .toList();
    }
}
