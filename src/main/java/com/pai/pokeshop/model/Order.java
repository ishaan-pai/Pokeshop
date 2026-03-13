package com.pai.pokeshop.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "card_id")
    private Card card;

    private BigDecimal totalCost;
    private LocalDate date;

    public Long getId() {
        return id;
    }

    public Card getCard() {
        return card;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public LocalDate getDate() {
        return date;
    }
}
