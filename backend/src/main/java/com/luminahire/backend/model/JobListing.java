package com.luminahire.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "job_listings")
public class JobListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String title;
    private String location;
    private String type; // Full-time, Part-time, Contract
    private String salary;
    private String logoUrl;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String requirements; // comma-separated skills

    private String applyUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String category; // Frontend, Backend, Fullstack, DevOps, Data, AI/ML
    private String experienceLevel; // Entry, Mid, Senior
    private LocalDate postedDate;
    private boolean active = true;

    public JobListing() {}

    public JobListing(String company, String title, String location, String type, String salary,
                      String logoUrl, String description, String requirements, String applyUrl,
                      String linkedinUrl, String websiteUrl, String category, String experienceLevel, LocalDate postedDate) {
        this.company = company;
        this.title = title;
        this.location = location;
        this.type = type;
        this.salary = salary;
        this.logoUrl = logoUrl;
        this.description = description;
        this.requirements = requirements;
        this.applyUrl = applyUrl;
        this.linkedinUrl = linkedinUrl;
        this.websiteUrl = websiteUrl;
        this.category = category;
        this.experienceLevel = experienceLevel;
        this.postedDate = postedDate;
        this.active = true;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }
    public String getApplyUrl() { return applyUrl; }
    public void setApplyUrl(String applyUrl) { this.applyUrl = applyUrl; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public LocalDate getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDate postedDate) { this.postedDate = postedDate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
