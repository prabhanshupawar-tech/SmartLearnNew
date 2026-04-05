package com.smartlearn.smartlearn.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartlearn.smartlearn.entity.User;
import com.smartlearn.smartlearn.dto.AuthResponse;
import com.smartlearn.smartlearn.repository.UserRepository;
import com.smartlearn.smartlearn.util.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User dbUser = repo.findByUsername(user.getUsername()).orElse(null);

        if (dbUser != null && dbUser.getPassword().equals(user.getPassword())) {
            String token = jwtUtil.generateToken(dbUser.getUsername(), dbUser.getRole());
            return ResponseEntity.ok(new AuthResponse(token, dbUser.getUsername(), dbUser.getRole(), dbUser.getId()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (repo.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        User savedUser = repo.save(user);
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole(), savedUser.getId()));
    }
}