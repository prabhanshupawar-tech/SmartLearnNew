package com.smartlearn.smartlearn.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartlearn.smartlearn.Result;

import java.util.List;

	public interface ResultRepository extends JpaRepository<Result, Long> {
	    List<Result> findByUserId(Long userId);
	    List<Result> findByTestId(Long testId);
	    List<Result> findByUserIdAndTestId(Long userId, Long testId);
}

