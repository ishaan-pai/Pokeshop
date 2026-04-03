package com.pai.pokeshop.repository;

import com.pai.pokeshop.model.Rarity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RarityRepo extends JpaRepository<Rarity, Long> {
}
