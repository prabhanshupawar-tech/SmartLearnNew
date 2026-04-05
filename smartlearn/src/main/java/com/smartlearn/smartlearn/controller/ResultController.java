package com.smartlearn.smartlearn.controller;

import com.smartlearn.smartlearn.Result;
import com.smartlearn.smartlearn.repository.ResultRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ResultController {

    private final ResultRepository resultRepository;

    public ResultController(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    @GetMapping
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Result> getByUser(@PathVariable Long userId) {
        return resultRepository.findByUserId(userId);
    }

    @GetMapping("/test/{testId}")
    public List<Result> getByTest(@PathVariable Long testId) {
        return resultRepository.findByTestId(testId);
    }

    @GetMapping("/user/{userId}/test/{testId}")
    public List<Result> getByUserAndTest(@PathVariable Long userId, @PathVariable Long testId) {
        return resultRepository.findByUserIdAndTestId(userId, testId);
    }

    @PostMapping
    public ResponseEntity<Result> saveResult(@RequestBody Result result) {
        Result saved = resultRepository.save(result);
        return ResponseEntity.ok(saved);
    }
}
