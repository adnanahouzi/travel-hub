package com.travelhub.booking.dto.request;

import com.travelhub.booking.dto.common.SortCriteriaDto;
import com.travelhub.connectors.nuitee.dto.common.Occupancy;
import java.time.LocalDate;
import java.util.List;
import java.math.BigDecimal;

public class RateSearchRequestDto {
    // Required Fields
    private List<Occupancy> occupancies;
    private LocalDate checkin;
    private LocalDate checkout;

    // Search Methods
    private List<String> hotelIds;
    private String countryCode;
    private String hotelName;
    private String cityName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer radius;
    private String iataCode;
    private String placeId;
    private String aiSearch;

    // Filters & Options

    private Boolean roomMapping;
    private Integer limit;
    private Integer offset;
    private Boolean weatherInfo;
    private Boolean stream;
    private Boolean refundableRatesOnly;
    private String boardType;  // RO BB, HB


    private Integer minReviewsCount;
    private BigDecimal minRating;
    private String zip;
    private String feed;
    private List<Integer> starRating;
    private List<Integer> chainIds;
    private List<Integer> hotelTypeIds;
    private List<String> facilities;
    private Boolean strictFacilityFiltering;
    private List<SortCriteriaDto> sort;

    // Getters and Setters
    public List<Occupancy> getOccupancies() {
        return occupancies;
    }

    public void setOccupancies(List<Occupancy> occupancies) {
        this.occupancies = occupancies;
    }

    public Boolean getRefundableRatesOnly() {
        return refundableRatesOnly;
    }

    public void setRefundableRatesOnly(Boolean refundableRatesOnly) {
        this.refundableRatesOnly = refundableRatesOnly;
    }

    public String getBoardType() {
        return boardType;
    }

    public void setBoardType(String boardType) {
        this.boardType = boardType;
    }

    public String getFeed() {
        return feed;
    }

    public void setFeed(String feed) {
        this.feed = feed;
    }

    public List<Integer> getChainIds() {
        return chainIds;
    }

    public void setChainIds(List<Integer> chainIds) {
        this.chainIds = chainIds;
    }

    public List<Integer> getHotelTypeIds() {
        return hotelTypeIds;
    }

    public void setHotelTypeIds(List<Integer> hotelTypeIds) {
        this.hotelTypeIds = hotelTypeIds;
    }

    public LocalDate getCheckin() {
        return checkin;
    }

    public void setCheckin(LocalDate checkin) {
        this.checkin = checkin;
    }

    public LocalDate getCheckout() {
        return checkout;
    }

    public void setCheckout(LocalDate checkout) {
        this.checkout = checkout;
    }

    public List<String> getHotelIds() {
        return hotelIds;
    }

    public void setHotelIds(List<String> hotelIds) {
        this.hotelIds = hotelIds;
    }

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

    public String getIataCode() {
        return iataCode;
    }

    public void setIataCode(String iataCode) {
        this.iataCode = iataCode;
    }

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public String getAiSearch() {
        return aiSearch;
    }

    public void setAiSearch(String aiSearch) {
        this.aiSearch = aiSearch;
    }


    public Boolean getRoomMapping() {
        return roomMapping;
    }

    public void setRoomMapping(Boolean roomMapping) {
        this.roomMapping = roomMapping;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public Integer getOffset() {
        return offset;
    }

    public void setOffset(Integer offset) {
        this.offset = offset;
    }

    public Boolean getWeatherInfo() {
        return weatherInfo;
    }

    public void setWeatherInfo(Boolean weatherInfo) {
        this.weatherInfo = weatherInfo;
    }

    public Boolean getStream() {
        return stream;
    }

    public void setStream(Boolean stream) {
        this.stream = stream;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public Integer getMinReviewsCount() {
        return minReviewsCount;
    }

    public void setMinReviewsCount(Integer minReviewsCount) {
        this.minReviewsCount = minReviewsCount;
    }

    public BigDecimal getMinRating() {
        return minRating;
    }

    public void setMinRating(BigDecimal minRating) {
        this.minRating = minRating;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public List<Integer> getStarRating() {
        return starRating;
    }

    public void setStarRating(List<Integer> starRating) {
        this.starRating = starRating;
    }

    public List<String> getFacilities() {
        return facilities;
    }

    public void setFacilities(List<String> facilities) {
        this.facilities = facilities;
    }

    public Boolean getStrictFacilityFiltering() {
        return strictFacilityFiltering;
    }

    public void setStrictFacilityFiltering(Boolean strictFacilityFiltering) {
        this.strictFacilityFiltering = strictFacilityFiltering;
    }

    public List<com.travelhub.booking.dto.common.SortCriteriaDto> getSort() {
        return sort;
    }

    public void setSort(List<com.travelhub.booking.dto.common.SortCriteriaDto> sort) {
        this.sort = sort;
    }
}
