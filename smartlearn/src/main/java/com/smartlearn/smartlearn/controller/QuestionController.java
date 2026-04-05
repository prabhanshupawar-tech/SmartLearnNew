package com.smartlearn.smartlearn.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartlearn.smartlearn.Question;
import com.smartlearn.smartlearn.dto.AnswerRequest;
import com.smartlearn.smartlearn.service.QuestionService;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "*")

public class QuestionController {
	private final QuestionService service;
	
	public QuestionController (QuestionService service) {
		this.service=service;
		
	}
	
	@GetMapping
	public List <Question> getAll(){
		return service.getAllQuestions();
	}
	@GetMapping("/topic/{topic}")
	public List<Question>getByTopic(@PathVariable String topic){
		return service.getByTopic(topic);
	}

	@GetMapping("/test/{testId}")
	public List<Question> getByTestId(@PathVariable Long testId) {
		return service.getByTestId(testId);
	}
	@PostMapping
	public Question add(@RequestBody Question q) {
		return service.addQuestion(q);
		
	}
	@DeleteMapping("/{id}")
	public String delete (@PathVariable Long id) {
		service.deleteQuestion(id);
		return "Deleted successfully";
	}
	@PostMapping("/submit")
	public ResponseEntity<String> submitTest(@RequestBody AnswerRequest request) {
		int score = service.calculateScore(request);
		return ResponseEntity.ok(String.format("Test submitted successfully. Score: %d/%d", score, request.getAnswers().size()));
	}
	@GetMapping("/analytics")
	public String getAnalytics(){
		return service.getAnalytics();
		
	}
	@GetMapping("/user/analytics")
	public String getUserAnalytics(){
		return service.getUserAnalytics();
		
	}
	
}
