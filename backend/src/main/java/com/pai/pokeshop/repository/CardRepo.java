package com.pai.pokeshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pai.pokeshop.model.Card;

public interface CardRepo extends JpaRepository<Card, Long> {
    List<Card> findBySoldFalse();
}