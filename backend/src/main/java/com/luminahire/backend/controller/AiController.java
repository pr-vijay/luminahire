package com.luminahire.backend.controller;

import com.luminahire.backend.service.GeminiAiService;
import com.luminahire.backend.service.JobMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private GeminiAiService aiService;

    @Autowired
    private JobMatchingService jobMatchingService;

    @PostMapping("/analyze-resume")
    public ResponseEntity<Map<String, Object>> analyzeResume(@RequestBody Map<String, String> payload) {
        String resumeText = payload.getOrDefault("resume", "");
        String jobDescription = payload.getOrDefault("jobDescription", "");
        if (resumeText.isBlank()) return ResponseEntity.badRequest().body(Map.of("error", "Resume text is required"));

        Map<String, Object> analysis = aiService.analyzeResume(resumeText, jobDescription);
        analysis.put("aiEnabled", aiService.isAiEnabled());

        // Log real activity
        DashboardController.incrementResumes();
        DashboardController.logActivity("Resume analyzed",
                "Score: " + analysis.getOrDefault("score", "N/A") + "% | ATS: " + analysis.getOrDefault("atsScore", "N/A") + "%",
                "Score: " + analysis.getOrDefault("score", "N/A") + "%", "#22c55e");

        return ResponseEntity.ok(analysis);
    }

    @PostMapping("/extract-skills")
    public ResponseEntity<Map<String, Object>> extractSkills(@RequestBody Map<String, String> payload) {
        String resumeText = payload.getOrDefault("resume", "");
        List<String> skills = aiService.extractSkillsFromResume(resumeText);
        return ResponseEntity.ok(Map.of("skills", skills, "count", skills.size(), "aiEnabled", aiService.isAiEnabled()));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        String message = payload.getOrDefault("message", "");
        String context = payload.getOrDefault("context", "");
        String reply = aiService.chat(message, context);

        DashboardController.incrementChats();
        DashboardController.logActivity("AI Chat", message.length() > 60 ? message.substring(0, 60) + "..." : message, "Completed", "#66FCF1");

        return ResponseEntity.ok(Map.of("reply", reply));
    }

    @PostMapping("/cover-letter")
    public ResponseEntity<Map<String, String>> generateCoverLetter(@RequestBody Map<String, String> payload) {
        String resumeText = payload.getOrDefault("resume", "");
        String jobDescription = payload.getOrDefault("jobDescription", "");
        String companyName = payload.getOrDefault("company", "the company");
        String coverLetter = aiService.generateCoverLetter(resumeText, jobDescription, companyName);

        DashboardController.logActivity("Cover letter generated", companyName, "Ready", "#f59e0b");
        return ResponseEntity.ok(Map.of("coverLetter", coverLetter));
    }

    @PostMapping("/match-jobs")
    public ResponseEntity<Map<String, Object>> matchJobsForResume(@RequestBody Map<String, String> payload) {
        String resumeText = payload.getOrDefault("resume", "");
        String location = payload.getOrDefault("location", "");
        if (resumeText.isBlank()) return ResponseEntity.badRequest().body(Map.of("error", "Resume text is required"));

        List<String> skills = aiService.extractSkillsFromResume(resumeText);
        List<Map<String, Object>> matchedJobs = jobMatchingService.findJobsForResume(resumeText, location);

        DashboardController.logActivity("Job matching", skills.size() + " skills → " + matchedJobs.size() + " jobs found", matchedJobs.size() + " matched", "#a855f7");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("extractedSkills", skills);
        result.put("totalJobs", matchedJobs.size());
        result.put("jobs", matchedJobs);
        result.put("aiEnabled", aiService.isAiEnabled());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        return ResponseEntity.ok(Map.of(
                "aiEnabled", aiService.isAiEnabled(),
                "mode", aiService.isAiEnabled() ? "PRODUCTION" : "DEMO",
                "message", aiService.isAiEnabled() ? "LangChain4j + Gemini AI active." : "DEMO mode. Set GEMINI_API_KEY for real AI."
        ));
    }
}
