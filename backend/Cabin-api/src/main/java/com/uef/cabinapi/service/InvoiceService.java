package com.uef.cabinapi.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.uef.cabinapi.data.InvoiceRequestDto;
import com.uef.cabinapi.data.InvoiceResponseDto;
import com.uef.cabinapi.model.Customer;
import com.uef.cabinapi.model.Invoice;
import com.uef.cabinapi.model.Reservation;
import com.uef.cabinapi.repository.CustomerRepository;
import com.uef.cabinapi.repository.InvoiceRepository;
import com.uef.cabinapi.repository.ReservationRepository;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final CustomerRepository customerRepository;
    private final ReservationRepository reservationRepository;

    public InvoiceService(
        InvoiceRepository invoiceRepository,
        CustomerRepository customerRepository,
        ReservationRepository reservationRepository
    ) {
        this.invoiceRepository = invoiceRepository;
        this.customerRepository = customerRepository;
        this.reservationRepository = reservationRepository;
    }

    public Page<InvoiceResponseDto> getInvoices(
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

        return invoiceRepository.findAll(pageable)
            .map(InvoiceResponseDto::new);
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }

    public Invoice createInvoice(InvoiceRequestDto dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
            .orElseThrow(() -> new RuntimeException("Customer not found"));

        Reservation reservation = reservationRepository.findById(dto.getReservationId())
            .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Invoice invoice = new Invoice(
            customer,
            reservation,
            calculateAmount(reservation),
            dto.getStatus(),
            dto.getIssueDate(),
            dto.getDueDate()
        );

        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoice(Long id, InvoiceRequestDto dto) {
        Invoice invoice = getInvoiceById(id);

        invoice.setStatus(dto.getStatus());
        invoice.setIssueDate(dto.getIssueDate());
        invoice.setDueDate(dto.getDueDate());

        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    private BigDecimal calculateAmount(Reservation reservation) {
        long nights = ChronoUnit.DAYS.between(
            LocalDate.parse(reservation.getStartDate()),
            LocalDate.parse(reservation.getEndDate())
        );

        if (nights <= 0) {
            nights = 1;
        }

        return reservation.getCabin()
            .getPrice()
            .multiply(BigDecimal.valueOf(nights));
    }
}
