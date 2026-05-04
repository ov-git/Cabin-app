package com.uef.cabinapi.controller;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.uef.cabinapi.data.CustomerRequestDto;
import com.uef.cabinapi.data.CustomerResponseDto;
import com.uef.cabinapi.data.PaginatedResponseDto;
import com.uef.cabinapi.data.PaginationDto;
import com.uef.cabinapi.data.SelectOptionDto;
import com.uef.cabinapi.model.Customer;
import com.uef.cabinapi.service.CustomerService;

@RestController
@RequestMapping("api/customer")
public class CustomerController {
    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public PaginatedResponseDto<List<CustomerResponseDto>> findAll(
        @RequestParam(defaultValue = "asc") String order,
        @RequestParam(defaultValue = "firstName") String orderBy,
        @RequestParam(defaultValue = "10") int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        Page<CustomerResponseDto> page = service.getCustomers(order, orderBy, limit, offset);

        return new PaginatedResponseDto<>(
            page.getContent(),
            new PaginationDto(limit, offset, page.getTotalElements())
        );
    }

    @GetMapping("/{id}")
    public Customer findById(@PathVariable Long id) {
        return service.getCustomerById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer postCustomer(@RequestBody CustomerRequestDto dto) {
        Customer customer = new Customer(
            dto.getFirstName(),
            dto.getLastName(),
            dto.getEmail(),
            dto.getPhone()
        );

        return service.createCustomer(customer);
    }

    @PutMapping("/{id}")
    public String putCustomer(@PathVariable Long id, @RequestBody CustomerRequestDto dto) {
        service.updateCustomer(id, dto);
        return "Asiakas päivitetty onnistuneesti.";
    }

    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable Long id) {
        service.deleteCustomer(id);
        return "Asiakas poistettu onnistuneesti.";
    }

    @GetMapping("/options")
    public List<SelectOptionDto> getCustomerOptions() {
        return service.getCustomerOptions();
}
}
