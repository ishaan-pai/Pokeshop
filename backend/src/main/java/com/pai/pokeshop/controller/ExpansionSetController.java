package com.pai.pokeshop.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pai.pokeshop.model.ExpansionSet;
import com.pai.pokeshop.repository.ExpansionSetRepo;

@RestController
@RequestMapping("/api/sets")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpansionSetController {

    private final ExpansionSetRepo expansionSetRepo;

    public ExpansionSetController(ExpansionSetRepo expansionSetRepo) {
        this.expansionSetRepo = expansionSetRepo;
    }

    @GetMapping
    public List<ExpansionSet> getAll() {
        return expansionSetRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<ExpansionSet> create(@RequestBody ExpansionSet set) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expansionSetRepo.save(set));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!expansionSetRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        expansionSetRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
