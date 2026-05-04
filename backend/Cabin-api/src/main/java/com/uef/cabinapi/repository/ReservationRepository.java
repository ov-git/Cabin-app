package com.uef.cabinapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uef.cabinapi.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByCabinId(Long cabinId);
    boolean existsByCustomerId(Long customerId);

    List<Reservation> findByCabinIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        Long cabinId,
        String endDate,
        String startDate
    );
}
