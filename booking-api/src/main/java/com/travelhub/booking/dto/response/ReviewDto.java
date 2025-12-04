package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Hotel review information")
public class ReviewDto {

    @Schema(description = "Average score given by the reviewer", example = "9.5")
    private Double averageScore;

    @Schema(description = "Reviewer's country", example = "United States")
    private String country;

    @Schema(description = "Type of traveler (e.g., Couple, Solo)", example = "Couple")
    private String type;

    @Schema(description = "Reviewer's name", example = "John Doe")
    private String name;

    @Schema(description = "Date of the review", example = "2024-01-15")
    private String date;

    @Schema(description = "Review headline", example = "Great stay!")
    private String headline;

    @Schema(description = "Language of the review", example = "en")
    private String language;

    @Schema(description = "Positive aspects mentioned in the review")
    private String pros;

    @Schema(description = "Negative aspects mentioned in the review")
    private String cons;

    @Schema(description = "Source of the review", example = "Booking.com")
    private String source;

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getPros() {
        return pros;
    }

    public void setPros(String pros) {
        this.pros = pros;
    }

    public String getCons() {
        return cons;
    }

    public void setCons(String cons) {
        this.cons = cons;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}

