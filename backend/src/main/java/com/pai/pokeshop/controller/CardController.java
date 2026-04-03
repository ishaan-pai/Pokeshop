package com.pai.pokeshop.controller;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.pai.pokeshop.dto.CardUpdateRequest;
import com.pai.pokeshop.model.Card;
import com.pai.pokeshop.model.ExpansionSet;
import com.pai.pokeshop.model.Image;
import com.pai.pokeshop.repository.CardRepo;
import com.pai.pokeshop.repository.ExpansionSetRepo;
import com.pai.pokeshop.repository.ImageRepo;
import com.pai.pokeshop.repository.RarityRepo;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:5173")
public class CardController {

    private final CardRepo cardRepository;
    private final ImageRepo imageRepository;
    private final RarityRepo rarityRepository;
    private final ExpansionSetRepo expansionSetRepository;

    public CardController(CardRepo cardRepository, ImageRepo imageRepository,
                          RarityRepo rarityRepository, ExpansionSetRepo expansionSetRepository) {
        this.cardRepository = cardRepository;
        this.imageRepository = imageRepository;
        this.rarityRepository = rarityRepository;
        this.expansionSetRepository = expansionSetRepository;
    }

    @GetMapping
    public List<Card> getAllCards() {
        return cardRepository.findBySoldFalse();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Card> getCardById(@PathVariable Long id) {
        return cardRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createCard(
            @RequestParam String name,
            @RequestParam String condition,
            @RequestParam BigDecimal price,
            @RequestParam int stock,
            @RequestParam(required = false) Long rarityId,
            @RequestParam(required = false) List<Long> expansionSetIds,
            @RequestParam("images") List<MultipartFile> images) throws IOException {

        if (images == null || images.isEmpty()) {
            return ResponseEntity.badRequest().body("At least one image is required.");
        }

        List<Image> validatedImages = new ArrayList<>();
        for (MultipartFile file : images) {
            BufferedImage img = ImageIO.read(file.getInputStream());
            if (img == null || img.getWidth() != 126 || img.getHeight() != 176) {
                return ResponseEntity.badRequest().body("Each image must be exactly 126x176 pixels.");
            }
            Image image = new Image();
            image.setImageData(file.getBytes());
            image.setContentType(file.getContentType());
            validatedImages.add(image);
        }

        Card card = new Card();
        card.setName(name);
        card.setCondition(condition);
        card.setPrice(price);
        card.setStock(stock);

        if (rarityId != null) {
            rarityRepository.findById(rarityId).ifPresent(card::setRarity);
        }

        if (expansionSetIds != null && !expansionSetIds.isEmpty()) {
            List<ExpansionSet> sets = expansionSetRepository.findAllById(expansionSetIds);
            card.setExpansionSets(sets);
        }

        for (Image image : validatedImages) {
            image.setCard(card);
        }
        card.setImages(validatedImages);

        return ResponseEntity.status(HttpStatus.CREATED).body(cardRepository.save(card));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCard(@PathVariable Long id, @RequestBody CardUpdateRequest req) {
        return cardRepository.findById(id).map(card -> {
            card.setName(req.name());
            card.setCondition(req.condition());
            card.setPrice(req.price());
            card.setStock(req.stock());

            if (req.rarityId() != null) {
                rarityRepository.findById(req.rarityId()).ifPresent(card::setRarity);
            } else {
                card.setRarity(null);
            }

            if (req.expansionSetIds() != null && !req.expansionSetIds().isEmpty()) {
                card.setExpansionSets(expansionSetRepository.findAllById(req.expansionSetIds()));
            } else {
                card.setExpansionSets(new ArrayList<>());
            }

            return ResponseEntity.ok(cardRepository.save(card));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        if (!cardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        cardRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/sold")
    public ResponseEntity<Card> markAsSold(@PathVariable Long id) {
        return cardRepository.findById(id).map(card -> {
            card.setSold(true);
            return ResponseEntity.ok(cardRepository.save(card));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file) throws IOException {

        return cardRepository.findById(id).map(card -> {
            try {
                BufferedImage img = ImageIO.read(file.getInputStream());
                if (img == null || img.getWidth() != 126 || img.getHeight() != 176) {
                    return ResponseEntity.badRequest().body("Image must be exactly 126x176 pixels.");
                }
                Image image = new Image();
                image.setImageData(file.getBytes());
                image.setContentType(file.getContentType());
                image.setCard(card);
                return ResponseEntity.status(HttpStatus.CREATED).body(imageRepository.save(image));
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process image.");
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/images/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id, @PathVariable Long imageId) {
        if (!cardRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (imageRepository.countByCardId(id) <= 1) {
            return ResponseEntity.badRequest().body("A card must have at least one image.");
        }
        if (!imageRepository.existsById(imageId)) {
            return ResponseEntity.notFound().build();
        }
        imageRepository.deleteById(imageId);
        return ResponseEntity.noContent().build();
    }
}
