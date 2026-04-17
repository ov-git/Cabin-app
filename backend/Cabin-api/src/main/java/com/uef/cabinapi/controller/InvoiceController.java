package com.uef.cabinapi.controller;

import java.io.IOException;
import java.io.InputStream;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("api/invoice")
public class InvoiceController {

    @GetMapping
    public String findAll() throws IOException {
        InputStream input = new ClassPathResource("data/InvoicesMock.json").getInputStream();
        String json = new String(input.readAllBytes());

        return json;
    }

    @GetMapping("/{id}")
    public String findById(@PathVariable Integer id) throws IOException {
        return "Invoice with id: " + id + " is not found";
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String postInvoice(@RequestBody String entity) {
        return entity;
    }

    @DeleteMapping("/{id}")
    public String deleteInvoice(@PathVariable Integer id) {
        return "Invoice with id: " + id + " has been deleted";
    }

    @PutMapping("/{id}")
    public String putInvoice(@PathVariable Integer id, @RequestBody String entity) {
        return "Invoice with id: " + id + " has been updated";
    }
}
