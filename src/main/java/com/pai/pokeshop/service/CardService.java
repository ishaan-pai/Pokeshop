package com.pai.pokeshop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pai.pokeshop.model.Card;
import com.pai.pokeshop.repository.CardRepo;

@Service
public class CardService {

    private final CardRepo cardRepo;

    public CardService(CardRepo cardRepo) {
        this.cardRepo = cardRepo;
    }

    public List<Card> getAllCards() {
        return cardRepo.findAll();
    }

    public Optional<Card> getCard(Long id) {
        return cardRepo.findById(id);
    }

    public Card addCard(Card card) {
        return cardRepo.save(card);
    }

    public void deleteCard(Long id) {
        cardRepo.deleteById(id);
    }

    public boolean exists(Long id) {
        return cardRepo.existsById(id);
    }
}
