package com.luminahire.backend.controller;

import com.luminahire.backend.service.JobMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobMatchingService jobMatchingService;

    /**
     * GET /api/jobs/search?query=react&location=bangalore
     * Search jobs by keyword and/or location across all India
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchJobs(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "") String location,
            @RequestParam(required = false, defaultValue = "") String experienceLevel) {

        List<Map<String, Object>> jobs = jobMatchingService.searchJobs(query, location, experienceLevel);
        return ResponseEntity.ok(Map.of(
                "jobs", jobs,
                "total", jobs.size(),
                "query", query,
                "location", location,
                "experienceLevel", experienceLevel
        ));
    }

    /**
     * POST /api/jobs/match
     * Match jobs for a resume across India — AI-powered
     */
    @PostMapping("/match")
    public ResponseEntity<Map<String, Object>> matchJobs(@RequestBody Map<String, String> payload) {
        String resumeText = payload.getOrDefault("resume", "");
        String location = payload.getOrDefault("location", "");

        List<Map<String, Object>> matchedJobs = jobMatchingService.findJobsForResume(resumeText, location);
        return ResponseEntity.ok(Map.of(
                "jobs", matchedJobs,
                "total", matchedJobs.size()
        ));
    }
}
