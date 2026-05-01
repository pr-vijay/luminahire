package com.luminahire.backend.controller;

import com.luminahire.backend.model.UserProfile;
import com.luminahire.backend.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserProfileRepository userProfileRepo;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        if (userProfileRepo.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already registered"));
        }

        UserProfile user = new UserProfile();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password); // In production, this should be hashed using BCrypt!
        user.setAvatar("https://ui-avatars.com/api/?name=" + (name != null ? name : "User") + "&background=66FCF1&color=0a0a0f&bold=true&size=128");

        userProfileRepo.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "Registration successful",
            "user", Map.of(
                "name", user.getName() != null ? user.getName() : "",
                "email", user.getEmail(),
                "avatar", user.getAvatar(),
                "provider", "local"
            )
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        Optional<UserProfile> userOpt = userProfileRepo.findByEmail(email);
        
        if (userOpt.isPresent()) {
            UserProfile user = userOpt.get();
            // In production, compare hashes!
            if (password.equals(user.getPassword())) {
                return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "user", Map.of(
                        "name", user.getName() != null ? user.getName() : "",
                        "email", user.getEmail(),
                        "avatar", user.getAvatar() != null ? user.getAvatar() : "",
                        "provider", "local"
                    )
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
    }
}
