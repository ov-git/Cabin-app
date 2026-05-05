package com.uef.cabinapi.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uef.cabinapi.data.CabinRequestDto;
import com.uef.cabinapi.data.CabinResponseDto;
import com.uef.cabinapi.data.SelectOptionDto;
import com.uef.cabinapi.model.Cabin;
import com.uef.cabinapi.repository.CabinRepository;
import com.uef.cabinapi.repository.ReservationRepository;

import org.springframework.data.domain.*;

@Service
public class CabinService {

    private final CabinRepository cabinRepository;
    private final ReservationRepository reservationRepository;

    public CabinService(CabinRepository cabinRepository, ReservationRepository reservationRepository) {
        this.cabinRepository = cabinRepository;
        this.reservationRepository = reservationRepository;
    }

    public Page<CabinResponseDto> getCabins(
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

        return cabinRepository.findAll(pageable)
            .map(cabin -> new CabinResponseDto(
                cabin,
                !reservationRepository.existsByCabinId(cabin.getId())
            ));
    }

    public List<Cabin> getAllCabins() {
        return cabinRepository.findAll();
    }

    public Cabin getCabinById(Long id) {
        return cabinRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cabin not found"));
    }

    public Cabin createCabin(Cabin cabin) {
        return cabinRepository.save(cabin);
    }

    public Cabin updateCabin(Long id, CabinRequestDto dto) {
        Cabin cabin = getCabinById(id);

        cabin.setName(dto.getName());
        cabin.setLocation(dto.getLocation());
        cabin.setPrice(BigDecimal.valueOf(dto.getPrice()));
        cabin.setMaxGuests(dto.getMaxGuests());

        return cabinRepository.save(cabin);
    }

    public void deleteCabin(Long id) {
        cabinRepository.deleteById(id);
    }

    public List<SelectOptionDto> getCabinOptions() {
    return cabinRepository.findAll()
        .stream()
        .map(cabin -> new SelectOptionDto(
            cabin.getId(),
            cabin.getName()
        ))
        .toList();
}
}
