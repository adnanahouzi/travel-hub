package com.travelhub.connectors.nuitee.dto.response;

import java.util.List;

public class HotelReviewsResponse {
    private List<Review> data;
    private Integer total;
    private SentimentAnalysis sentimentAnalysis;

    public List<Review> getData() {
        return data;
    }

    public void setData(List<Review> data) {
        this.data = data;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public SentimentAnalysis getSentimentAnalysis() {
        return sentimentAnalysis;
    }

    public void setSentimentAnalysis(SentimentAnalysis sentimentAnalysis) {
        this.sentimentAnalysis = sentimentAnalysis;
    }
}

