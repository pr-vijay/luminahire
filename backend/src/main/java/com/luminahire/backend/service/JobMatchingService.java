package com.luminahire.backend.service;

import com.luminahire.backend.model.JobListing;
import com.luminahire.backend.repository.JobListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Job Matching Service
 * Uses AI-extracted skills from resume to find and rank matching jobs across India.
 */
@Service
public class JobMatchingService {

    @Autowired
    private JobListingRepository jobRepo;

    @Autowired
    private GeminiAiService aiService;

    /**
     * Find jobs matching a resume — the core AI-powered matching logic.
     * 1. Extract skills from resume using LangChain/Gemini
     * 2. Search all jobs in the database
     * 3. Score each job against the extracted skills
     * 4. Return sorted by match percentage
     */
    public List<Map<String, Object>> findJobsForResume(String resumeText, String locationFilter) {
        // Step 1: Extract skills using AI
        List<String> skills = aiService.extractSkillsFromResume(resumeText);

        // Step 2: Get all active jobs (optionally filtered by location)
        List<JobListing> allJobs;
        if (locationFilter != null && !locationFilter.isBlank()) {
            allJobs = jobRepo.findByLocation(locationFilter);
        } else {
            allJobs = jobRepo.findByActiveTrue();
        }

        // Step 3: Score and rank each job
        List<Map<String, Object>> results = new ArrayList<>();
        for (JobListing job : allJobs) {
            int matchScore = calculateMatchScore(skills, job);
            Map<String, Object> jobResult = new LinkedHashMap<>();
            jobResult.put("id", job.getId());
            jobResult.put("company", job.getCompany());
            jobResult.put("title", job.getTitle());
            jobResult.put("location", job.getLocation());
            jobResult.put("type", job.getType());
            jobResult.put("salary", job.getSalary());
            jobResult.put("logo", job.getLogoUrl());
            jobResult.put("description", job.getDescription());
            jobResult.put("requirements", job.getRequirements());
            jobResult.put("applyUrl", job.getApplyUrl());
            jobResult.put("linkedinUrl", job.getLinkedinUrl());
            jobResult.put("website", job.getWebsiteUrl());
            jobResult.put("category", job.getCategory());
            jobResult.put("experienceLevel", job.getExperienceLevel());
            jobResult.put("posted", job.getPostedDate() != null ? job.getPostedDate().toString() : "Recently");
            jobResult.put("match", matchScore);
            jobResult.put("matchedSkills", getMatchedSkills(skills, job));
            results.add(jobResult);
        }

        // Step 4: Sort by match score (highest first)
        results.sort((a, b) -> (int) b.get("match") - (int) a.get("match"));
        return results;
    }

    /**
     * Search jobs by keyword, location, and experience level
     */
    public List<Map<String, Object>> searchJobs(String query, String location, String experienceLevel) {
        List<JobListing> jobs = new ArrayList<>(jobRepo.searchJobsAdvanced(query, location, experienceLevel));
        
        // Dynamic Company Result Generation if no jobs found
        if (jobs.isEmpty() && query != null && !query.isBlank()) {
            JobListing virtualJob = new JobListing();
            virtualJob.setId((long) (Math.random() * 100000));
            virtualJob.setCompany(query);
            virtualJob.setTitle("General Application / Open Roles");
            virtualJob.setLocation(location != null && !location.isBlank() ? location : "Remote / Various");
            virtualJob.setType("Full-time");
            virtualJob.setSalary("Competitive");
            virtualJob.setLogoUrl("https://ui-avatars.com/api/?name=" + query + "&background=random&color=fff&bold=true&size=64");
            virtualJob.setDescription("We couldn't find active listings directly in our database for " + query + ". However, they are likely hiring! Explore their official website and connect with their HR associates and talent acquisition team using the referral links below.");
            virtualJob.setRequirements("Depends on the specific role.");
            
            // Guess URLs
            String sanitizedCompany = query.replaceAll("\\s+", "").toLowerCase();
            if (sanitizedCompany.endsWith(".ai") || sanitizedCompany.endsWith(".com")) {
                virtualJob.setWebsiteUrl("https://www." + sanitizedCompany);
                virtualJob.setApplyUrl("https://www." + sanitizedCompany + "/careers");
            } else {
                virtualJob.setWebsiteUrl("https://www." + sanitizedCompany + ".com");
                virtualJob.setApplyUrl("https://www." + sanitizedCompany + ".com/careers");
            }
            virtualJob.setLinkedinUrl("https://www.linkedin.com/company/" + sanitizedCompany);
            virtualJob.setCategory("Various");
            virtualJob.setExperienceLevel(experienceLevel != null && !experienceLevel.isBlank() ? experienceLevel : "All Levels");
            
            jobs.add(virtualJob);
        }
        
        return jobs.stream().map(this::toJobMap).collect(Collectors.toList());
    }

    /**
     * Calculate match percentage between user skills and a job listing
     */
    private int calculateMatchScore(List<String> userSkills, JobListing job) {
        if (userSkills.isEmpty()) return 50; // Default score if no skills extracted

        String jobText = (job.getRequirements() + " " + job.getDescription() + " " + job.getTitle()).toLowerCase();
        long matched = userSkills.stream()
                .filter(skill -> jobText.contains(skill.toLowerCase()))
                .count();

        // Score formula: base 40 + skill match percentage * 60
        double matchRatio = (double) matched / userSkills.size();
        return Math.min(99, (int) (40 + matchRatio * 60));
    }

    /**
     * Get list of matched skills for a specific job
     */
    private List<String> getMatchedSkills(List<String> userSkills, JobListing job) {
        String jobText = (job.getRequirements() + " " + job.getDescription()).toLowerCase();
        return userSkills.stream()
                .filter(skill -> jobText.contains(skill.toLowerCase()))
                .collect(Collectors.toList());
    }

    private Map<String, Object> toJobMap(JobListing job) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", job.getId());
        map.put("company", job.getCompany());
        map.put("title", job.getTitle());
        map.put("location", job.getLocation());
        map.put("type", job.getType());
        map.put("salary", job.getSalary());
        map.put("logo", job.getLogoUrl());
        map.put("description", job.getDescription());
        map.put("requirements", job.getRequirements());
        map.put("applyUrl", job.getApplyUrl());
        map.put("linkedinUrl", job.getLinkedinUrl());
        map.put("website", job.getWebsiteUrl());
        map.put("category", job.getCategory());
        map.put("experienceLevel", job.getExperienceLevel());
        map.put("posted", job.getPostedDate() != null ? job.getPostedDate().toString() : "Recently");
        map.put("match", 70); // Default match for keyword search
        return map;
    }
}
