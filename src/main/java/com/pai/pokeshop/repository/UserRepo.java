package com.pai.pokeshop.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pai.pokeshop.model.User;

public interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
