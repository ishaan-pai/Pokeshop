package com.pai.pokeshop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "expansion_sets")
public class ExpansionSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "expansionSets")
    @JsonIgnore
    private List<Card> cards = new ArrayList<>();

    public Long getId() { return id; }
    public String getName() { return name; }
    public List<Card> getCards() { return cards; }

    public void setName(String name) { this.name = name; }
}
