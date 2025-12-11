package com.travelhub.connectors.nuitee.dto.request;

import java.math.BigDecimal;

public class HotelsListRequest {

    private String countryCode;
    private String cityName;
    private String hotelName;
    private Integer offset;
    private Integer limit;
    private String lastUpdatedAt;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer radius; // in meters (min 1000m)
    private String aiSearch;
    private Float timeout;
    private String zip;
    private BigDecimal minRating;
    private Integer minReviewsCount;
    private String facilityIds; // Comma-separated
    private String hotelTypeIds; // Comma-separated
    private String chainIds; // Comma-separated
    private Boolean strictFacilitiesFiltering;
    private String starRating; // Comma-separated
    private String placeId;
    private String language;
    private String hotelIds; // Comma-separated
    private Boolean advancedAccessibilityOnly;

    // Getters and Setters

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public Integer getOffset() {
        return offset;
    }

    public void setOffset(Integer offset) {
        this.offset = offset;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public String getLastUpdatedAt() {
        return lastUpdatedAt;
    }

    public void setLastUpdatedAt(String lastUpdatedAt) {
        this.lastUpdatedAt = lastUpdatedAt;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public Integer getRadius() {
        return radius;
    }

    public void setRadius(Integer radius) {
        this.radius = radius;
    }

    public String getAiSearch() {
        return aiSearch;
    }

    public void setAiSearch(String aiSearch) {
        this.aiSearch = aiSearch;
    }

    public Float getTimeout() {
        return timeout;
    }

    public void setTimeout(Float timeout) {
        this.timeout = timeout;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public BigDecimal getMinRating() {
        return minRating;
    }

    public void setMinRating(BigDecimal minRating) {
        this.minRating = minRating;
    }

    public Integer getMinReviewsCount() {
        return minReviewsCount;
    }

    public void setMinReviewsCount(Integer minReviewsCount) {
        this.minReviewsCount = minReviewsCount;
    }

    public String getFacilityIds() {
        return facilityIds;
    }

    public void setFacilityIds(String facilityIds) {
        this.facilityIds = facilityIds;
    }

    public String getHotelTypeIds() {
        return hotelTypeIds;
    }

    public void setHotelTypeIds(String hotelTypeIds) {
        this.hotelTypeIds = hotelTypeIds;
    }

    public String getChainIds() {
        return chainIds;
    }

    public void setChainIds(String chainIds) {
        this.chainIds = chainIds;
    }

    public Boolean getStrictFacilitiesFiltering() {
        return strictFacilitiesFiltering;
    }

    public void setStrictFacilitiesFiltering(Boolean strictFacilitiesFiltering) {
        this.strictFacilitiesFiltering = strictFacilitiesFiltering;
    }

    public String getStarRating() {
        return starRating;
    }

    public void setStarRating(String starRating) {
        this.starRating = starRating;
    }

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getHotelIds() {
        return hotelIds;
    }

    public void setHotelIds(String hotelIds) {
        this.hotelIds = hotelIds;
    }

    public Boolean getAdvancedAccessibilityOnly() {
        return advancedAccessibilityOnly;
    }

    public void setAdvancedAccessibilityOnly(Boolean advancedAccessibilityOnly) {
        this.advancedAccessibilityOnly = advancedAccessibilityOnly;
    }
}
