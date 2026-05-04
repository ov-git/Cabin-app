package com.uef.cabinapi.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.uef.cabinapi.data.CabinRequestDto;
import com.uef.cabinapi.data.CabinResponseDto;
import com.uef.cabinapi.data.PaginatedResponseDto;
import com.uef.cabinapi.data.PaginationDto;
import com.uef.cabinapi.data.SelectOptionDto;
import com.uef.cabinapi.model.Cabin;
import com.uef.cabinapi.service.CabinService;
import org.springframework.data.domain.*;

@RestController
@RequestMapping("api/cabin")
public class CabinController {

    private final CabinService service;

    public CabinController(CabinService service) {
        this.service = service;
    }

    @GetMapping
    public PaginatedResponseDto<List<CabinResponseDto>> findAll(
        @RequestParam(defaultValue = "asc") String order,
        @RequestParam(defaultValue = "name") String orderBy,
        @RequestParam(defaultValue = "10") int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        Page<CabinResponseDto> page = service.getCabins(order, orderBy, limit, offset);

        return new PaginatedResponseDto<>(
            page.getContent(),
            new PaginationDto(limit, offset, page.getTotalElements())
        );
    }

    @GetMapping("/{id}")
    public Cabin findById(@PathVariable Long id) {
        return service.getCabinById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cabin postCabin(@RequestBody CabinRequestDto dto) {
        Cabin cabin = new Cabin(
            dto.getName(),
            dto.getLocation(),
            BigDecimal.valueOf(dto.getPrice()),
            dto.getMaxGuests()
        );

        return service.createCabin(cabin);
    }

    @PutMapping("/{id}")
    public String putCabin(@PathVariable Long id, @RequestBody CabinRequestDto dto) {
        service.updateCabin(id, dto);
        return "Mökki päivitetty onnistuneesti.";
    }

    @DeleteMapping("/{id}")
    public String deleteCabin(@PathVariable Long id) {
        service.deleteCabin(id);
        return "Mökki poistettu onnistuneesti.";
    }

    @GetMapping("/options")
    public List<SelectOptionDto> getCabinOptions() {
        return service.getCabinOptions();
}
}
