package com.pai.pokeshop.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pai.pokeshop.model.Rarity;
import com.pai.pokeshop.repository.RarityRepo;

@RestController
@RequestMapping("/api/rarities")
@CrossOrigin(origins = "http://localhost:5173")
public class RarityController {

    private final RarityRepo rarityRepo;

    public RarityController(RarityRepo rarityRepo) {
        this.rarityRepo = rarityRepo;
    }

    @GetMapping
    public List<Rarity> getAll() {
        return rarityRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<Rarity> create(@RequestBody Rarity rarity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rarityRepo.save(rarity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!rarityRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rarityRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
