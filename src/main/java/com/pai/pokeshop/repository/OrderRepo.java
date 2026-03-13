package com.pai.pokeshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pai.pokeshop.model.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {}
