package com.uef.cabinapi.service;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import com.uef.cabinapi.data.ReservationRequestDto;
import com.uef.cabinapi.data.ReservationResponseDto;
import com.uef.cabinapi.model.Cabin;
import com.uef.cabinapi.model.Customer;
import com.uef.cabinapi.model.Invoice;
import com.uef.cabinapi.model.Reservation;
import com.uef.cabinapi.repository.CabinRepository;
import com.uef.cabinapi.repository.CustomerRepository;
import com.uef.cabinapi.repository.InvoiceRepository;
import com.uef.cabinapi.repository.ReservationRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final CustomerRepository customerRepository;
    private final CabinRepository cabinRepository;
    private final InvoiceRepository invoiceRepository;


    public ReservationService(
    ReservationRepository reservationRepository,
    CustomerRepository customerRepository,
    CabinRepository cabinRepository,
    InvoiceRepository invoiceRepository
) {
    this.reservationRepository = reservationRepository;
    this.customerRepository = customerRepository;
    this.cabinRepository = cabinRepository;
    this.invoiceRepository = invoiceRepository;
}

    public Page<ReservationResponseDto> getReservations(
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

        return reservationRepository.findAll(pageable)
            .map(reservation -> new ReservationResponseDto(
                reservation,
                !invoiceRepository.existsByReservationId(reservation.getId())
            ));
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    public Reservation createReservation(ReservationRequestDto dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
            .orElseThrow(() -> new RuntimeException("Customer not found"));
    
        Cabin cabin = cabinRepository.findById(dto.getCabinId())
            .orElseThrow(() -> new RuntimeException("Cabin not found"));
    
        Reservation reservation = new Reservation(
            customer,
            cabin,
            dto.getStartDate(),
            dto.getEndDate(),
            "ACTIVE"
        );
    
        Reservation savedReservation = reservationRepository.save(reservation);
    
        Invoice invoice = new Invoice(
            customer,
            savedReservation,
            calculateAmount(savedReservation),
            "PENDING",
            savedReservation.getStartDate(),
            savedReservation.getStartDate()
        );
    
        invoiceRepository.save(invoice);
    
        return savedReservation;
    }

    public Reservation updateReservation(Long id, ReservationRequestDto dto) {
        Reservation reservation = getReservationById(id);

        Customer customer = customerRepository.findById(dto.getCustomerId())
            .orElseThrow(() -> new RuntimeException("Customer not found"));

        Cabin cabin = cabinRepository.findById(dto.getCabinId())
            .orElseThrow(() -> new RuntimeException("Cabin not found"));

        reservation.setCustomer(customer);
        reservation.setCabin(cabin);
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setStatus(dto.getStatus());

        Reservation savedReservation = reservationRepository.save(reservation);

        invoiceRepository.findByReservationId(savedReservation.getId())
            .ifPresent(invoice -> {
                invoice.setCustomer(savedReservation.getCustomer());
                invoice.setReservation(savedReservation);
                invoice.setAmount(calculateAmount(savedReservation));
                invoiceRepository.save(invoice);
            });

        return savedReservation;
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    public List<ReservationResponseDto> getOverlappingReservations(
        ReservationRequestDto dto
    ) {
        return reservationRepository
            .findByCabinIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                dto.getCabinId(),
                dto.getEndDate(),
                dto.getStartDate()
            )
            .stream()
            .map(reservation -> new ReservationResponseDto(
                reservation,
                !invoiceRepository.existsByReservationId(reservation.getId())
            ))
            .toList();
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
