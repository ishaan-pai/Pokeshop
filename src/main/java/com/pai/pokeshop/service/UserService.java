package com.pai.pokeshop.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pai.pokeshop.model.User;
import com.pai.pokeshop.repository.UserRepo;

@Service
public class UserService {

    private final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public Optional<User> getUser(Long id) {
        return userRepo.findById(id);
    }

    public User createUser(User user) {
        return userRepo.save(user);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    public boolean exists(Long id) {
        return userRepo.existsById(id);
    }
}
