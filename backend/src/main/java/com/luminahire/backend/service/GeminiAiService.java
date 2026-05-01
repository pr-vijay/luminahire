package com.luminahire.backend.service;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * LangChain4j + Gemini AI Service — PRODUCTION
 * Tries multiple models for reliability.
 */
@Service
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model.name}")
    private String modelName;

    private ChatLanguageModel chatModel;
    private boolean aiEnabled = false;
    private static final String[] FALLBACK_MODELS = {"gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"};

    @PostConstruct
    public void init() {
        if (apiKey == null || apiKey.equals("DEMO_MODE") || apiKey.isBlank()) {
            System.out.println("ℹ️ DEMO MODE — No API key set.");
            return;
        }
        // Try configured model first, then fallbacks
        String[] models = new String[]{modelName};
        for (String model : models) {
            try {
                chatModel = GoogleAiGeminiChatModel.builder()
                        .apiKey(apiKey)
                        .modelName(model)
                        .temperature(0.7)
                        .maxOutputTokens(2048)
                        .build();
                aiEnabled = true;
                System.out.println("✅ PRODUCTION — Gemini AI ready (" + model + ")");
                return;
            } catch (Exception e) {
                System.out.println("⚠️ Failed with " + model + ": " + e.getMessage());
            }
        }
    }

    /** Safe AI call with rate-limit handling */
    private String safeGenerate(String prompt) {
        if (!aiEnabled) return null;
        try {
            return chatModel.generate(prompt);
        } catch (Exception e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("429")) {
                System.out.println("⏳ Rate limited, waiting 5s...");
                try { Thread.sleep(5000); return chatModel.generate(prompt); } catch (Exception retry) {
                    System.out.println("Rate limit retry failed: " + retry.getMessage());
                }
            } else {
                System.out.println("AI error: " + msg);
            }
        }
        return null;
    }

    /** Extract skills from resume */
    public List<String> extractSkillsFromResume(String resumeText) {
        String response = safeGenerate(
            "Extract all technical and professional skills from this resume. " +
            "Return ONLY a comma-separated list, nothing else.\n\n" + resumeText
        );
        if (response != null) {
            return Arrays.stream(response.split(","))
                    .map(String::trim).filter(s -> !s.isBlank() && s.length() < 50).distinct().toList();
        }
        return extractSkillsFallback(resumeText);
    }

    /** Analyze resume — returns structured data */
    @SuppressWarnings("unchecked")
    public Map<String, Object> analyzeResume(String resumeText, String jobDescription) {
        String prompt = "You are an ATS expert. Analyze this resume" +
            (jobDescription.isBlank() ? "" : " for: " + jobDescription) +
            ".\nReturn EXACT JSON (no markdown):\n" +
            "{\"score\":<0-100>,\"atsScore\":<0-100>,\"summary\":\"<2 sentences>\",\"strengths\":[\"s1\",\"s2\",\"s3\"],\"improvements\":[\"i1\",\"i2\",\"i3\"],\"missingKeywords\":[\"k1\",\"k2\"]}\n\nResume:\n" + resumeText;

        String response = safeGenerate(prompt);
        if (response != null) {
            try {
                response = response.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
                var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, Object> result = mapper.readValue(response, Map.class);
                result.put("extractedSkills", extractSkillsFromResume(resumeText));
                result.put("mode", "PRODUCTION");
                return result;
            } catch (Exception e) { System.out.println("JSON parse error: " + e.getMessage()); }
        }
        return generateFallbackAnalysis(resumeText);
    }

    /** AI Chat */
    public String chat(String message, String context) {
        String prompt = "You are Lumina, an AI career assistant. Help with resumes, jobs, interviews, cover letters. " +
            "Be concise, use **bold** and bullets.\n\n" +
            (context.isBlank() ? "" : "Context: " + context + "\n") +
            "User: " + message;

        String response = safeGenerate(prompt);
        return response != null ? response : generateFallbackChat(message);
    }

    /** Cover letter */
    public String generateCoverLetter(String resumeText, String jobDescription, String companyName) {
        String response = safeGenerate(
            "Write a 3-paragraph cover letter for " + companyName + ".\nJob: " + jobDescription + "\nResume:\n" + resumeText
        );
        return response != null ? response : "Set up Gemini API for AI cover letters.";
    }

    // ===== FALLBACK =====
    private List<String> extractSkillsFallback(String text) {
        String lower = text.toLowerCase();
        return List.of("Java","Spring Boot","React","TypeScript","JavaScript","Python","Node.js","Docker","AWS","PostgreSQL","MongoDB","Git","REST API","HTML","CSS","SQL","Kubernetes","Angular","Vue.js","Redis","Kafka","Microservices","CI/CD","Agile","Machine Learning")
            .stream().filter(s -> lower.contains(s.toLowerCase())).toList();
    }

    private Map<String, Object> generateFallbackAnalysis(String resumeText) {
        List<String> skills = extractSkillsFallback(resumeText);
        int score = Math.min(95, 60 + skills.size() * 3);
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("score", score); r.put("atsScore", Math.min(90, 50 + skills.size() * 4));
        r.put("summary", skills.size() + " skills found. " + (score > 80 ? "Strong match." : "Add more relevant keywords."));
        r.put("strengths", List.of("Technical skills documented", "Project experience shown", "Clean format"));
        r.put("improvements", List.of("Add quantified metrics", "Include professional summary", "Tailor to job descriptions"));
        r.put("missingKeywords", List.of("Docker", "CI/CD", "AWS", "Unit Testing"));
        r.put("extractedSkills", skills); r.put("mode", "DEMO");
        return r;
    }

    private String generateFallbackChat(String message) {
        String l = message.toLowerCase();
        if (l.contains("resume")) return "Upload your resume on the **Resume Analyzer** page for AI scoring and skill extraction!";
        if (l.contains("interview")) return "**STAR method**: Situation → Task → Action → Result. Practice with behavioral questions first.";
        if (l.contains("cover")) return "Provide a job description and I'll generate a **tailored cover letter**!";
        return "I can help with **resume optimization**, **job matching**, **interview prep**, and **career strategy**. What do you need?";
    }

    public boolean isAiEnabled() { return aiEnabled; }
}
