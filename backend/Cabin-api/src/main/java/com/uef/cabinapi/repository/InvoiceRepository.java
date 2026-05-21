package com.uef.cabinapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uef.cabinapi.model.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    boolean existsByCustomerId(Long customerId);
    boolean existsByReservationId(Long reservationId);

    Optional<Invoice> findByReservationId(Long reservationId);
}
