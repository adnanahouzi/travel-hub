package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Response containing hotel reviews and sentiment analysis")
public class HotelReviewsResponseDto {

    @Schema(description = "List of individual reviews")
    private List<ReviewDto> data;

    @Schema(description = "Total number of reviews available")
    private Integer total;

    @Schema(description = "Sentiment analysis summary")
    private SentimentAnalysisDto sentimentAnalysis;

    public List<ReviewDto> getData() {
        return data;
    }

    public void setData(List<ReviewDto> data) {
        this.data = data;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public SentimentAnalysisDto getSentimentAnalysis() {
        return sentimentAnalysis;
    }

    public void setSentimentAnalysis(SentimentAnalysisDto sentimentAnalysis) {
        this.sentimentAnalysis = sentimentAnalysis;
    }
}

