package com.pai.pokeshop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pai.pokeshop.model.Order;
import com.pai.pokeshop.repository.OrderRepo;

@Service
public class OrderService {

    private final OrderRepo orderRepo;

    public OrderService(OrderRepo orderRepo) {
        this.orderRepo = orderRepo;
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Optional<Order> getOrder(Long id) {
        return orderRepo.findById(id);
    }

    public Order placeOrder(Order order) {
        return orderRepo.save(order);
    }
}
