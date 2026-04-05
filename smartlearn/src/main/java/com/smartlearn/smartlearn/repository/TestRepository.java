package com.smartlearn.smartlearn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartlearn.smartlearn.entity.Test;

public interface TestRepository extends JpaRepository<Test, Long> {
    
}
