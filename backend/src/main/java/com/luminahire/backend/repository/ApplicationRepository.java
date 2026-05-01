package com.luminahire.backend.repository;

import com.luminahire.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserEmailOrderByDateDesc(String userEmail);
    long countByUserEmail(String userEmail);
    long countByUserEmailAndStatus(String userEmail, String status);
}
