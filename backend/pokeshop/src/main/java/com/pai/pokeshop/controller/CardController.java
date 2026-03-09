package com.pai.pokeshop.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pai.pokeshop.model.Card;
import com.pai.pokeshop.repository.CardRepo;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:5173")
public class CardController {

    private final CardRepo cardRepository;

    public CardController(CardRepo cardRepository) {
        this.cardRepository = cardRepository;
    }

    @GetMapping
    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }
}