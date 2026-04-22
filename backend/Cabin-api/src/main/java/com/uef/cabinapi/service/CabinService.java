package com.uef.cabinapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.uef.cabinapi.model.Cabin;
import com.uef.cabinapi.repository.CabinRepository;

@Service
public class CabinService {

    private final CabinRepository cabinRepository;

    public CabinService(CabinRepository cabinRepository) {
        this.cabinRepository = cabinRepository;
    }

    public List<Cabin> getAllCabins() {
        return cabinRepository.findAll();
    }

    public Cabin getCabinById(Long id) {
        Integer intId = id.intValue();
        return cabinRepository.findById(intId).orElse(null);
    }

    public Cabin createCabin(Cabin cabin) {
        return cabinRepository.save(cabin);
    }
    
}
