package com.smartlearn.smartlearn.dto;



import java.util.List;

public class AnswerRequest {

    private Long userId;
    private Long testId;
    private List<Answer> answers;
    private List<QuestionReview> questionReviews;

    // ✅ Getter
    public List<Answer> getAnswers() {
        return answers;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getTestId() {
        return testId;
    }

    public List<QuestionReview> getQuestionReviews() {
        return questionReviews;
    }

    public static class QuestionReview {
        private Long questionId;
        private boolean markedForReview;

        public Long getQuestionId() {
            return questionId;
        }

        public boolean isMarkedForReview() {
            return markedForReview;
        }
    }

    // ✅ Inner class
    public static class Answer {
        private Long questionId;
        private String selectedAnswer;

        public Long getQuestionId() {
            return questionId;
        }

        public String getSelectedAnswer() {
            return selectedAnswer;
        }
    }
}