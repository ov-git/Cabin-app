package com.uef.cabinapi.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.uef.cabinapi.data.InvoiceRequestDto;
import com.uef.cabinapi.data.InvoiceResponseDto;
import com.uef.cabinapi.data.PaginatedResponseDto;
import com.uef.cabinapi.data.PaginationDto;
import com.uef.cabinapi.model.Invoice;
import com.uef.cabinapi.service.InvoiceService;

@RestController
@RequestMapping("api/invoice")
public class InvoiceController {
    private final InvoiceService service;

    public InvoiceController(InvoiceService service) {
        this.service = service;
    }

    @GetMapping
    public PaginatedResponseDto<List<InvoiceResponseDto>> findAll(
        @RequestParam(defaultValue = "asc") String order,
        @RequestParam(defaultValue = "issueDate") String orderBy,
        @RequestParam(defaultValue = "10") int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        Page<InvoiceResponseDto> page = service.getInvoices(order, orderBy, limit, offset);

        return new PaginatedResponseDto<>(
            page.getContent(),
            new PaginationDto(limit, offset, page.getTotalElements())
        );
    }

    @GetMapping("/{id}")
    public Invoice findById(@PathVariable Long id) {
        return service.getInvoiceById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Invoice postInvoice(@RequestBody InvoiceRequestDto dto) {
        return service.createInvoice(dto);
    }

    @PutMapping("/{id}")
    public String putInvoice(@PathVariable Long id, @RequestBody InvoiceRequestDto dto) {
        service.updateInvoice(id, dto);
        return "Lasku päivitetty onnistuneesti.";
    }

    @DeleteMapping("/{id}")
    public String deleteInvoice(@PathVariable Long id) {
        service.deleteInvoice(id);
        return "Lasku poistettu onnistuneesti.";
    }
}
