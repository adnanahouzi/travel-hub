package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.List;

@Schema(description = "Response containing detailed hotel information with available rates")
public class HotelRateResponseDto {

    @Schema(description = "Hotel ID")
    private String hotelId;

    @Schema(description = "Hotel name")
    private String name;

    @Schema(description = "Hotel description")
    private String description;

    @Schema(description = "Important information about the hotel")
    private String importantInformation;

    @Schema(description = "Hotel star rating")
    private Integer starRating;

    @Schema(description = "Hotel rating from reviews")
    private BigDecimal rating;

    @Schema(description = "Number of reviews")
    private Integer reviewCount;

    @Schema(description = "Hotel address")
    private String address;

    @Schema(description = "City")
    private String city;

    @Schema(description = "Country")
    private String country;

    @Schema(description = "Postal code")
    private String zip;

    @Schema(description = "Hotel location coordinates")
    private LocationDto location;

    @Schema(description = "Main photo URL")
    private String mainPhoto;

    @Schema(description = "Thumbnail URL")
    private String thumbnail;

    @Schema(description = "List of hotel images")
    private List<HotelImageDto> images;

    @Schema(description = "Hotel facilities")
    private List<String> facilities;

    @Schema(description = "Contact phone number")
    private String phone;

    @Schema(description = "Contact email")
    private String email;

    @Schema(description = "Check-in and check-out times")
    private CheckinCheckoutTimesDto checkinCheckoutTimes;

    @Schema(description = "Grouped rates by room configuration")
    private List<RoomConfigurationGroupDto> groupedRates;

    @Schema(description = "Sentiment analysis from reviews")
    private SentimentAnalysisDto sentimentAnalysis;

    // Getters and Setters

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImportantInformation() {
        return importantInformation;
    }

    public void setImportantInformation(String importantInformation) {
        this.importantInformation = importantInformation;
    }

    public Integer getStarRating() {
        return starRating;
    }

    public void setStarRating(Integer starRating) {
        this.starRating = starRating;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public LocationDto getLocation() {
        return location;
    }

    public void setLocation(LocationDto location) {
        this.location = location;
    }

    public String getMainPhoto() {
        return mainPhoto;
    }

    public void setMainPhoto(String mainPhoto) {
        this.mainPhoto = mainPhoto;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public List<HotelImageDto> getImages() {
        return images;
    }

    public void setImages(List<HotelImageDto> images) {
        this.images = images;
    }

    public List<String> getFacilities() {
        return facilities;
    }

    public void setFacilities(List<String> facilities) {
        this.facilities = facilities;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public CheckinCheckoutTimesDto getCheckinCheckoutTimes() {
        return checkinCheckoutTimes;
    }

    public void setCheckinCheckoutTimes(CheckinCheckoutTimesDto checkinCheckoutTimes) {
        this.checkinCheckoutTimes = checkinCheckoutTimes;
    }

    public List<RoomConfigurationGroupDto> getGroupedRates() {
        return groupedRates;
    }

    public void setGroupedRates(List<RoomConfigurationGroupDto> groupedRates) {
        this.groupedRates = groupedRates;
    }

    public SentimentAnalysisDto getSentimentAnalysis() {
        return sentimentAnalysis;
    }

    public void setSentimentAnalysis(SentimentAnalysisDto sentimentAnalysis) {
        this.sentimentAnalysis = sentimentAnalysis;
    }
}
