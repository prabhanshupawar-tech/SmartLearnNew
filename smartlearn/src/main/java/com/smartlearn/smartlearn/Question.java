package com.smartlearn.smartlearn;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.smartlearn.smartlearn.entity.Test;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String correctAnswer;
    private String topic;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

    // ✅ GETTERS

    public Long getId() {
        return id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getOption1() {
        return option1;
    }

    public String getOption2() {
        return option2;
    }

    public String getOption3() {
        return option3;
    }

    public String getOption4() {
        return option4;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public String getTopic() {
        return topic;
    }

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }

    // ✅ SETTERS (important for POST API)

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public void setOption1(String option1) {
        this.option1 = option1;
    }

    public void setOption2(String option2) {
        this.option2 = option2;
    }

    public void setOption3(String option3) {
        this.option3 = option3;
    }

    public void setOption4(String option4) {
        this.option4 = option4;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    // ✅ Get options as array for frontend compatibility
    public String[] getOptions() {
        return new String[]{option1, option2, option3, option4};
    }
}