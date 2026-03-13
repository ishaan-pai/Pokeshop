package com.pai.pokeshop.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String setName;
    private String rarity;
    private String condition;
    private BigDecimal price;
    private int stock;

    public Long getId() { 
        return id; 
    }
    public String getName() { 
        return name; 
    }
    public String getSetName() { 
        return setName; 
    }
    public String getRarity() { 
        return rarity; 
    }
    public String getCondition() { 
        return condition; 
    }
    public BigDecimal getPrice() { 
        return price; 
    }
    public int getStock() { 
        return stock; 
    }
}