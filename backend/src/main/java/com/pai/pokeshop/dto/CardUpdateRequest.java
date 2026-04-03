package com.pai.pokeshop.dto;

import java.math.BigDecimal;
import java.util.List;

public record CardUpdateRequest(
        String name,
        String condition,
        BigDecimal price,
        int stock,
        Long rarityId,
        List<Long> expansionSetIds
) {}
