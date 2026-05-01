package com.luminahire.backend.controller;

import com.luminahire.backend.model.Application;
import com.luminahire.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository appRepo;

    /**
     * GET /api/applications?email=user@example.com
     * Get all applications for a user
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getApplications(@RequestParam String email) {
        List<Application> apps = appRepo.findByUserEmailOrderByDateDesc(email);
        List<Map<String, Object>> result = apps.stream().map(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("company", a.getCompany());
            m.put("title", a.getTitle());
            m.put("status", a.getStatus());
            m.put("date", a.getDate());
            m.put("url", a.getUrl());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/applications
     * Add new application
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addApplication(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email required"));
        }
        Application app = new Application();
        app.setUserEmail(email);
        app.setCompany(payload.getOrDefault("company", ""));
        app.setTitle(payload.getOrDefault("title", ""));
        app.setStatus(payload.getOrDefault("status", "wishlist"));
        app.setDate(payload.getOrDefault("date", LocalDate.now().toString()));
        app.setUrl(payload.getOrDefault("url", ""));
        appRepo.save(app);

        DashboardController.logActivity("Application added", app.getCompany() + " — " + app.getTitle(), "Added", "#66FCF1");

        return ResponseEntity.ok(Map.of("success", true, "id", app.getId()));
    }

    /**
     * PUT /api/applications/{id}/status
     * Update application status (drag & drop)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Application> opt = appRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Application app = opt.get();
        String newStatus = payload.getOrDefault("status", app.getStatus());
        app.setStatus(newStatus);
        appRepo.save(app);

        DashboardController.logActivity("Application status", app.getCompany() + " → " + newStatus, newStatus, "#a855f7");

        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * DELETE /api/applications/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteApplication(@PathVariable Long id) {
        appRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * GET /api/applications/stats?email=user@example.com
     * Stats for dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestParam String email) {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("total", appRepo.countByUserEmail(email));
        stats.put("applied", appRepo.countByUserEmailAndStatus(email, "applied"));
        stats.put("interview", appRepo.countByUserEmailAndStatus(email, "interview"));
        stats.put("offer", appRepo.countByUserEmailAndStatus(email, "offer"));
        stats.put("rejected", appRepo.countByUserEmailAndStatus(email, "rejected"));
        return ResponseEntity.ok(stats);
    }
}
