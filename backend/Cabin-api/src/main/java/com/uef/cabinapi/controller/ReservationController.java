package com.uef.cabinapi.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.uef.cabinapi.data.PaginatedResponseDto;
import com.uef.cabinapi.data.PaginationDto;
import com.uef.cabinapi.data.ReservationRequestDto;
import com.uef.cabinapi.data.ReservationResponseDto;
import com.uef.cabinapi.model.Reservation;
import com.uef.cabinapi.service.ReservationService;

@RestController
@RequestMapping("api/reservation")
public class ReservationController {
    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @GetMapping
    public PaginatedResponseDto<List<ReservationResponseDto>> findAll(
        @RequestParam(defaultValue = "asc") String order,
        @RequestParam(defaultValue = "startDate") String orderBy,
        @RequestParam(defaultValue = "10") int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        Page<ReservationResponseDto> page = service.getReservations(order, orderBy, limit, offset);

        return new PaginatedResponseDto<>(
            page.getContent(),
            new PaginationDto(limit, offset, page.getTotalElements())
        );
    }

    @GetMapping("/{id}")
    public Reservation findById(@PathVariable Long id) {
        return service.getReservationById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reservation postReservation(@RequestBody ReservationRequestDto dto) {
        return service.createReservation(dto);
    }

    @PutMapping("/{id}")
    public String putReservation(@PathVariable Long id, @RequestBody ReservationRequestDto dto) {
        service.updateReservation(id, dto);
        return "Varaus päivitetty onnistuneesti.";
    }

    @DeleteMapping("/{id}")
    public String deleteReservation(@PathVariable Long id) {
        service.deleteReservation(id);
        return "Varaus poistettu onnistuneesti.";
    }

    @PostMapping("/check-overlap")
    public List<ReservationResponseDto> checkOverlap(
        @RequestBody ReservationRequestDto dto
    ) {
        return service.getOverlappingReservations(dto);
    }
}
