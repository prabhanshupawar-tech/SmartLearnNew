package com.smartlearn.smartlearn.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartlearn.smartlearn.entity.Test;
import com.smartlearn.smartlearn.repository.TestRepository;

@RestController
@RequestMapping("/tests")
@CrossOrigin(origins = "*")
public class TestController {

    private final TestRepository testRepository;

    public TestController(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    @GetMapping
    public List<Test> getAllTests() {
        List<Test> tests = testRepository.findAll();
        for (Test test : tests) {
            if (test.getQuestions() != null) {
                test.setTotalQuestions(test.getQuestions().size());
            }
        }
        return tests;
    }

    @GetMapping("/available")
    public List<Test> getAvailableTests() {
        return testRepository.findAll().stream()
            .peek(t -> {
                if (t.getQuestions() != null) {
                    t.setTotalQuestions(t.getQuestions().size());
                }
            })
            .filter(t -> (t.getTotalQuestions() > 0))
            .toList();
    }

    @GetMapping("/{id}")
    public Test getTestById(@PathVariable Long id) {
        return testRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Test createTest(@RequestBody Test test) {
        return testRepository.save(test);
    }

    @DeleteMapping("/{id}")
    public String deleteTest(@PathVariable Long id) {
        testRepository.deleteById(id);
        return "Test deleted successfully";
    }
}
