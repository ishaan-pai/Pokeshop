package com.pai.pokeshop.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.pai.pokeshop.model.Card;
import com.pai.pokeshop.model.Order;
import com.pai.pokeshop.model.User;
import com.pai.pokeshop.service.CardService;
import com.pai.pokeshop.service.OrderService;
import com.pai.pokeshop.service.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ShopController {

    private final CardService cardService;
    private final OrderService orderService;
    private final UserService userService;

    public ShopController(CardService cardService, OrderService orderService, UserService userService) {
        this.cardService = cardService;
        this.orderService = orderService;
        this.userService = userService;
    }

    // --- Cards ---

    @GetMapping("/cards")
    public List<Card> getAllCards() {
        return cardService.getAllCards();
    }

    @GetMapping("/cards/{id}")
    public ResponseEntity<Card> getCard(@PathVariable Long id) {
        return cardService.getCard(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/cards")
    public Card addCard(@RequestBody Card card) {
        return cardService.addCard(card);
    }

    @DeleteMapping("/cards/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        if (!cardService.exists(id)) return ResponseEntity.notFound().build();
        cardService.deleteCard(id);
        return ResponseEntity.noContent().build();
    }

    // --- Orders ---

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return orderService.getOrder(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/orders")
    public Order placeOrder(@RequestBody Order order) {
        return orderService.placeOrder(order);
    }

    // --- Users ---

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userService.getUser(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userService.exists(id)) return ResponseEntity.notFound().build();
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
