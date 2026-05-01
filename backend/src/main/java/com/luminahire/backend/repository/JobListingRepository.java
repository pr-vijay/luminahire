package com.luminahire.backend.repository;

import com.luminahire.backend.model.JobListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobListingRepository extends JpaRepository<JobListing, Long> {

    List<JobListing> findByActiveTrue();

    @Query("SELECT j FROM JobListing j WHERE j.active = true AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.requirements) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<JobListing> searchJobs(@Param("query") String query);

    @Query("SELECT j FROM JobListing j WHERE j.active = true AND " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<JobListing> findByLocation(@Param("location") String location);

    @Query("SELECT j FROM JobListing j WHERE j.active = true AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.requirements) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<JobListing> searchJobsByQueryAndLocation(@Param("query") String query, @Param("location") String location);

    @Query("SELECT j FROM JobListing j WHERE j.active = true AND j.category = :category")
    List<JobListing> findByCategory(@Param("category") String category);

    @Query("SELECT j FROM JobListing j WHERE j.active = true AND " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.requirements) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:experienceLevel IS NULL OR :experienceLevel = '' OR :experienceLevel = 'All Levels' OR LOWER(j.experienceLevel) = LOWER(:experienceLevel))")
    List<JobListing> searchJobsAdvanced(@Param("query") String query, 
                                        @Param("location") String location, 
                                        @Param("experienceLevel") String experienceLevel);
}
