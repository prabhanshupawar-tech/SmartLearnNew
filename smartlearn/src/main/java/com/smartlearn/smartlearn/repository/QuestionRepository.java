package com.smartlearn.smartlearn.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartlearn.smartlearn.Question;
import com.smartlearn.smartlearn.entity.Test;

public interface QuestionRepository extends JpaRepository<Question,Long>{
	List <Question> findByTopic(String topic);
	List<Question> findByTest(Test test);
	List<Question> findByTest_Id(Long testId);
}
