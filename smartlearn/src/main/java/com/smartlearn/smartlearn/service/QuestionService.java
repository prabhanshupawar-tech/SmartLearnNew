package com.smartlearn.smartlearn.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.smartlearn.smartlearn.Question;
import com.smartlearn.smartlearn.Result;
import com.smartlearn.smartlearn.dto.AnswerRequest;
import com.smartlearn.smartlearn.repository.QuestionRepository;
import com.smartlearn.smartlearn.repository.ResultRepository;
import com.smartlearn.smartlearn.repository.TestRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.smartlearn.smartlearn.repository.UserRepository;
import com.smartlearn.smartlearn.entity.User;

@Service
public class QuestionService {

    private final QuestionRepository repo;
    private final ResultRepository resultRepo;
    private final UserRepository userRepo;
    private final TestRepository testRepo;

    // ✅ SINGLE constructor
    public QuestionService(QuestionRepository repo, ResultRepository resultRepo, UserRepository userRepo, TestRepository testRepo) {
        this.repo = repo;
        this.resultRepo = resultRepo;
        this.userRepo = userRepo;
        this.testRepo = testRepo;
    }

    public List<Question> getAllQuestions() {
        return repo.findAll();
    }

    public List<Question> getByTopic(String topic) {
        return repo.findByTopic(topic);
    }

    public List<Question> getByTestId(Long testId) {
        return repo.findByTest_Id(testId);
    }

    public Question addQuestion(Question q) {
        Question saved = repo.save(q);

        if (saved.getTest() != null && saved.getTest().getId() != null) {
            testRepo.findById(saved.getTest().getId()).ifPresent(test -> {
                test.setTotalQuestions((test.getTotalQuestions() > 0 ? test.getTotalQuestions() : 0) + 1);
                testRepo.save(test);
            });
        }

        return saved;
    }

    public void deleteQuestion(Long id) {
        repo.deleteById(id);
    }
    
    public String getAnalytics() {
    	List <Result> result=resultRepo.findAll();
    	
    	if(result.isEmpty()) {
    		return "No data Available";
    		
    	}
    	int totalTest=result.size();
    	int totalScore=0;
    	int totalQuestion=0;
    	
    	for(Result r: result) {
    		totalScore+=r.getScore();
    		totalQuestion+=r.getTotalQuestions();
    	}
    	
    	double accuracy = (double) totalScore / totalQuestion * 100;
    	accuracy = Math.round(accuracy * 100.0) / 100.0;

    	return "Total Tests: " + totalTest + ", Accuracy: " + accuracy + "%";
    }

    public String getUserAnalytics() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return "User not authenticated";
        }

        String username = auth.getName();
        User user = userRepo.findByUsername(username).orElse(null);
        if (user == null) {
            return "User not found";
        }

        List<Result> userResults = resultRepo.findByUserId(user.getId());

        if (userResults.isEmpty()) {
            return "No tests taken yet";
        }

        int totalTests = userResults.size();
        int totalScore = 0;
        int totalQuestions = 0;
        int bestScore = 0;

        for (Result r : userResults) {
            totalScore += r.getScore();
            totalQuestions += r.getTotalQuestions();
            int percentage = (int) ((double) r.getScore() / r.getTotalQuestions() * 100);
            bestScore = Math.max(bestScore, percentage);
        }

        double avgAccuracy = totalQuestions > 0 ? (double) totalScore / totalQuestions * 100 : 0;
        avgAccuracy = Math.round(avgAccuracy * 100.0) / 100.0;

        return "Total Tests: " + totalTests + ", Average Score: " + avgAccuracy + "%, Best Score: " + bestScore + "%";
    }

    public int calculateScore(AnswerRequest request) {
        int score = 0;

        for (AnswerRequest.Answer ans : request.getAnswers()) {

            Question q = repo.findById(ans.getQuestionId()).orElse(null);

            if (q == null) {
                System.out.println("Question not found: " + ans.getQuestionId());
                continue;
            }

            if (q.getCorrectAnswer() != null &&
                    q.getCorrectAnswer().equalsIgnoreCase(ans.getSelectedAnswer())) {
                score++;
            }
        }

        Result result = new Result();
        result.setUserId(request.getUserId());
        if (request.getTestId() != null) {
            result.setTestId(request.getTestId());
        }
        result.setScore(score);
        result.setTotalQuestions(request.getAnswers().size());
        result.setStatus("COMPLETED");
        result.setStartedAt(LocalDateTime.now().minusMinutes(10));
        result.setSubmittedAt(LocalDateTime.now());

        if (request.getQuestionReviews() != null) {
            StringBuilder reviewJson = new StringBuilder("{");
            reviewJson.append("\"reviewed\":[");
            for (int i = 0; i < request.getQuestionReviews().size(); i++) {
                AnswerRequest.QuestionReview qr = request.getQuestionReviews().get(i);
                if (qr.isMarkedForReview()) {
                    reviewJson.append(qr.getQuestionId());
                    reviewJson.append(",");
                }
            }
            if (reviewJson.toString().endsWith(",")) {
                reviewJson.deleteCharAt(reviewJson.length() - 1);
            }
            reviewJson.append("]}");
            result.setReviewFlagJson(reviewJson.toString());
        }

        resultRepo.save(result);

        return score;
    }
}