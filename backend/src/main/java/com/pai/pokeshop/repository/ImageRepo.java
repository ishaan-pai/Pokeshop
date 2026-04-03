package com.pai.pokeshop.repository;

import com.pai.pokeshop.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepo extends JpaRepository<Image, Long> {
    long countByCardId(Long cardId);
}
