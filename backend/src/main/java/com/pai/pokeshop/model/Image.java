package com.pai.pokeshop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_data", nullable = false, columnDefinition = "bytea")
    @JsonIgnore
    private byte[] imageData;

    @Column(name = "content_type", nullable = false)
    private String contentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    @JsonIgnore
    private Card card;

    public Long getId() { return id; }
    public byte[] getImageData() { return imageData; }
    public String getContentType() { return contentType; }
    public Card getCard() { return card; }

    public void setImageData(byte[] imageData) { this.imageData = imageData; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public void setCard(Card card) { this.card = card; }
}
