package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Sentiment analysis of reviews")
public class SentimentAnalysisDto {

    @Schema(description = "List of consolidated negative points")
    private List<String> cons;

    @Schema(description = "List of consolidated positive points")
    private List<String> pros;

    @Schema(description = "List of sentiment scores by category")
    private List<SentimentCategoryDto> categories;

    public List<String> getCons() {
        return cons;
    }

    public void setCons(List<String> cons) {
        this.cons = cons;
    }

    public List<String> getPros() {
        return pros;
    }

    public void setPros(List<String> pros) {
        this.pros = pros;
    }

    public List<SentimentCategoryDto> getCategories() {
        return categories;
    }

    public void setCategories(List<SentimentCategoryDto> categories) {
        this.categories = categories;
    }
}

