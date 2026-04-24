package com.uef.cabinapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uef.cabinapi.model.Cabin;

public interface CabinRepository extends JpaRepository<Cabin, Integer> {  
}
