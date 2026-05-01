package com.luminahire.backend.controller;

import com.luminahire.backend.model.UserProfile;
import com.luminahire.backend.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserProfileRepository profileRepo;

    /**
     * GET /api/profile?email=user@example.com
     * Load user profile
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getProfile(@RequestParam String email) {
        Optional<UserProfile> opt = profileRepo.findByEmail(email);
        if (opt.isEmpty()) {
            return ResponseEntity.ok(Map.of("exists", false));
        }
        UserProfile p = opt.get();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("exists", true);
        result.put("name", p.getName() != null ? p.getName() : "");
        result.put("email", p.getEmail());
        result.put("phone", p.getPhone() != null ? p.getPhone() : "");
        result.put("location", p.getLocation() != null ? p.getLocation() : "");
        result.put("title", p.getTitle() != null ? p.getTitle() : "");
        result.put("experience", p.getExperience() != null ? p.getExperience() : "");
        result.put("avatar", p.getAvatar() != null ? p.getAvatar() : "");
        result.put("bio", p.getBio() != null ? p.getBio() : "");

        Map<String, String> socials = new LinkedHashMap<>();
        socials.put("github", p.getGithub() != null ? p.getGithub() : "");
        socials.put("linkedin", p.getLinkedin() != null ? p.getLinkedin() : "");
        socials.put("twitter", p.getTwitter() != null ? p.getTwitter() : "");
        socials.put("portfolio", p.getPortfolio() != null ? p.getPortfolio() : "");
        result.put("socials", socials);

        result.put("skills", p.getSkills() != null && !p.getSkills().isBlank()
                ? Arrays.asList(p.getSkills().split(",")) : List.of());
        result.put("certifications", p.getCertifications() != null && !p.getCertifications().isBlank()
                ? Arrays.asList(p.getCertifications().split(";;;")) : List.of());

        // Parse education JSON
        if (p.getEducation() != null && !p.getEducation().isBlank()) {
            try {
                var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                result.put("education", mapper.readValue(p.getEducation(), List.class));
            } catch (Exception e) {
                result.put("education", List.of(Map.of("degree", "", "school", "", "year", "")));
            }
        } else {
            result.put("education", List.of(Map.of("degree", "", "school", "", "year", "")));
        }

        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/profile
     * Save/update user profile
     */
    @PostMapping
    @SuppressWarnings("unchecked")
    public ResponseEntity<Map<String, Object>> saveProfile(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        UserProfile p = profileRepo.findByEmail(email).orElse(new UserProfile());
        p.setEmail(email);
        p.setName((String) payload.getOrDefault("name", ""));
        p.setPhone((String) payload.getOrDefault("phone", ""));
        p.setLocation((String) payload.getOrDefault("location", ""));
        p.setTitle((String) payload.getOrDefault("title", ""));
        p.setExperience((String) payload.getOrDefault("experience", ""));
        p.setAvatar((String) payload.getOrDefault("avatar", ""));
        p.setBio((String) payload.getOrDefault("bio", ""));

        // Social links
        Map<String, String> socials = (Map<String, String>) payload.getOrDefault("socials", Map.of());
        p.setGithub(socials.getOrDefault("github", ""));
        p.setLinkedin(socials.getOrDefault("linkedin", ""));
        p.setTwitter(socials.getOrDefault("twitter", ""));
        p.setPortfolio(socials.getOrDefault("portfolio", ""));

        // Skills as comma-separated
        List<String> skills = (List<String>) payload.getOrDefault("skills", List.of());
        p.setSkills(String.join(",", skills));

        // Certifications
        List<String> certs = (List<String>) payload.getOrDefault("certifications", List.of());
        p.setCertifications(String.join(";;;", certs));

        // Education as JSON
        try {
            var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            p.setEducation(mapper.writeValueAsString(payload.getOrDefault("education", List.of())));
        } catch (Exception e) {
            p.setEducation("[]");
        }

        profileRepo.save(p);
        DashboardController.logActivity("Profile updated", email, "Saved", "#66FCF1");

        return ResponseEntity.ok(Map.of("success", true, "id", p.getId()));
    }
}
