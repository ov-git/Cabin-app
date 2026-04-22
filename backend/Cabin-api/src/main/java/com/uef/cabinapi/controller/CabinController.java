package com.uef.cabinapi.controller;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.uef.cabinapi.model.Cabin;
import com.uef.cabinapi.service.CabinService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("api/cabin")
public class CabinController {

   private final CabinService service;

   public CabinController(CabinService service) {
       this.service = service;
   }
    
    @GetMapping
    public String findAll() throws IOException {
        // return list of all cabins
        // InputStream input = new ClassPathResource("data/CabinsMock.json").getInputStream();
        // String json = new String(input.readAllBytes());

        List<Cabin> cabins = service.getAllCabins();
        String json = cabins.toString();

        return json;
    }

    @GetMapping("/{id}")
    public String findById(@PathVariable Integer id) throws IOException {
        // return cabin with given id
        return "Cabin with id: " + id + " is not found";

        // Optional<Cabin> = cabinrepository.findById(id);
        // return cabin with given id
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String postCabin(@RequestBody String entity) {

        // Parse cabin here
        BigDecimal d = new BigDecimal("100.50");
        Cabin cabin = new Cabin("Test Cabin", d);


        service.createCabin(cabin);

        return entity;
    }

    @DeleteMapping("/{id}")
    public String deleteCabin(@PathVariable Integer id) {
        // delete the cabin with the given id
        return "Cabin with id: " + id + " has been deleted";
    }

    @PutMapping("/{id}")
    public String putCabin(@PathVariable Integer id, @RequestBody String entity) {
        // update the cabin with the given id
        return "Cabin with id: " + id + " has been updated";
    }    

}
