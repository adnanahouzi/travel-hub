package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Sentiment analysis category information")
public class SentimentCategoryDto {

    @Schema(description = "Category name (e.g., Location, Service)", example = "Location")
    private String name;

    @Schema(description = "Rating for the category", example = "8.5")
    private BigDecimal rating;

    @Schema(description = "Category description")
    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

