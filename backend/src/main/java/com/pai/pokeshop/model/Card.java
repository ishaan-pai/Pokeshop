package com.pai.pokeshop.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String condition;
    private BigDecimal price;
    private int stock;
    private boolean sold = false;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rarity_id")
    private Rarity rarity;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "card_expansion_sets",
        joinColumns = @JoinColumn(name = "card_id"),
        inverseJoinColumns = @JoinColumn(name = "expansion_set_id")
    )
    private List<ExpansionSet> expansionSets = new ArrayList<>();

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Image> images = new ArrayList<>();

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCondition() { return condition; }
    public BigDecimal getPrice() { return price; }
    public int getStock() { return stock; }
    public boolean isSold() { return sold; }
    public Rarity getRarity() { return rarity; }
    public List<ExpansionSet> getExpansionSets() { return expansionSets; }
    public List<Image> getImages() { return images; }

    public void setName(String name) { this.name = name; }
    public void setCondition(String condition) { this.condition = condition; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setStock(int stock) { this.stock = stock; }
    public void setSold(boolean sold) { this.sold = sold; }
    public void setRarity(Rarity rarity) { this.rarity = rarity; }
    public void setExpansionSets(List<ExpansionSet> expansionSets) { this.expansionSets = expansionSets; }
    public void setImages(List<Image> images) { this.images = images; }
}
