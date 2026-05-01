package com.luminahire.backend.controller;

import com.luminahire.backend.repository.JobListingRepository;
import com.luminahire.backend.service.GeminiAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private JobListingRepository jobRepo;

    @Autowired
    private GeminiAiService aiService;

    // In-memory activity log (replace with DB in production)
    private static final List<Map<String, String>> activityLog = Collections.synchronizedList(new ArrayList<>());
    private static int resumeCount = 0;
    private static int chatCount = 0;

    /**
     * GET /api/dashboard/stats
     * Real-time dashboard statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalJobs = jobRepo.count();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalJobs", totalJobs);
        stats.put("resumesAnalyzed", resumeCount);
        stats.put("chatsCompleted", chatCount);
        stats.put("aiEnabled", aiService.isAiEnabled());
        stats.put("aiMode", aiService.isAiEnabled() ? "PRODUCTION" : "DEMO");
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/dashboard/activity
     * Recent user activity log
     */
    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, String>>> getActivity() {
        // Return last 10 activities, newest first
        List<Map<String, String>> recent = new ArrayList<>(activityLog);
        Collections.reverse(recent);
        return ResponseEntity.ok(recent.subList(0, Math.min(10, recent.size())));
    }

    /**
     * Called internally when user performs actions
     */
    public static void logActivity(String action, String detail, String status, String color) {
        Map<String, String> entry = new LinkedHashMap<>();
        entry.put("action", action);
        entry.put("detail", detail);
        entry.put("status", status);
        entry.put("color", color);
        entry.put("time", java.time.Instant.now().toString());
        activityLog.add(entry);
    }

    public static void incrementResumes() { resumeCount++; }
    public static void incrementChats() { chatCount++; }
}
