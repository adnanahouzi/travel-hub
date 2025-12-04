package com.travelhub.connectors.nuitee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;

public class HotelData {
    private String id;
    private String name;
    private String hotelDescription;
    private String hotelImportantInformation;
    private CheckinCheckoutTimes checkinCheckoutTimes;
    private List<HotelImage> hotelImages;

    @JsonProperty("main_photo")
    private String mainPhoto;

    private String thumbnail;
    private String country;
    private String city;
    private Integer starRating;
    private Location location;
    private String address;
    private List<String> hotelFacilities;
    private String zip;
    private Integer chainId;
    private String chain;
    private String currency;
    private String primaryHotelId;
    private List<Integer> facilityIds;
    private List<Facility> facilities;
    private List<Room> rooms;

    private String phone;
    private String fax;
    private String email;
    private String hotelType;
    private Integer hotelTypeId;
    private String airportCode;

    private BigDecimal rating;
    private Integer reviewCount;
    private String parking;
    private Integer groupRoomMin;
    private Boolean childAllowed;
    private Boolean petsAllowed;

    private List<Policy> policies;
    private Integer rohId;
    private Accessibility accessibility;

    @JsonProperty("sentiment_analysis")
    private SentimentAnalysis sentimentAnalysis;

    @JsonProperty("sentiment_updated_at")
    private String sentimentUpdatedAt;

    private String deletedAt;

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHotelDescription() {
        return hotelDescription;
    }

    public void setHotelDescription(String hotelDescription) {
        this.hotelDescription = hotelDescription;
    }

    public String getHotelImportantInformation() {
        return hotelImportantInformation;
    }

    public void setHotelImportantInformation(String hotelImportantInformation) {
        this.hotelImportantInformation = hotelImportantInformation;
    }

    public CheckinCheckoutTimes getCheckinCheckoutTimes() {
        return checkinCheckoutTimes;
    }

    public void setCheckinCheckoutTimes(CheckinCheckoutTimes checkinCheckoutTimes) {
        this.checkinCheckoutTimes = checkinCheckoutTimes;
    }

    public List<HotelImage> getHotelImages() {
        return hotelImages;
    }

    public void setHotelImages(List<HotelImage> hotelImages) {
        this.hotelImages = hotelImages;
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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getStarRating() {
        return starRating;
    }

    public void setStarRating(Integer starRating) {
        this.starRating = starRating;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<String> getHotelFacilities() {
        return hotelFacilities;
    }

    public void setHotelFacilities(List<String> hotelFacilities) {
        this.hotelFacilities = hotelFacilities;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public Integer getChainId() {
        return chainId;
    }

    public void setChainId(Integer chainId) {
        this.chainId = chainId;
    }

    public String getChain() {
        return chain;
    }

    public void setChain(String chain) {
        this.chain = chain;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPrimaryHotelId() {
        return primaryHotelId;
    }

    public void setPrimaryHotelId(String primaryHotelId) {
        this.primaryHotelId = primaryHotelId;
    }

    public List<Integer> getFacilityIds() {
        return facilityIds;
    }

    public void setFacilityIds(List<Integer> facilityIds) {
        this.facilityIds = facilityIds;
    }

    public List<Facility> getFacilities() {
        return facilities;
    }

    public void setFacilities(List<Facility> facilities) {
        this.facilities = facilities;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHotelType() {
        return hotelType;
    }

    public void setHotelType(String hotelType) {
        this.hotelType = hotelType;
    }

    public Integer getHotelTypeId() {
        return hotelTypeId;
    }

    public void setHotelTypeId(Integer hotelTypeId) {
        this.hotelTypeId = hotelTypeId;
    }

    public String getAirportCode() {
        return airportCode;
    }

    public void setAirportCode(String airportCode) {
        this.airportCode = airportCode;
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

    public String getParking() {
        return parking;
    }

    public void setParking(String parking) {
        this.parking = parking;
    }

    public Integer getGroupRoomMin() {
        return groupRoomMin;
    }

    public void setGroupRoomMin(Integer groupRoomMin) {
        this.groupRoomMin = groupRoomMin;
    }

    public Boolean getChildAllowed() {
        return childAllowed;
    }

    public void setChildAllowed(Boolean childAllowed) {
        this.childAllowed = childAllowed;
    }

    public Boolean getPetsAllowed() {
        return petsAllowed;
    }

    public void setPetsAllowed(Boolean petsAllowed) {
        this.petsAllowed = petsAllowed;
    }

    public List<Policy> getPolicies() {
        return policies;
    }

    public void setPolicies(List<Policy> policies) {
        this.policies = policies;
    }

    public Integer getRohId() {
        return rohId;
    }

    public void setRohId(Integer rohId) {
        this.rohId = rohId;
    }

    public Accessibility getAccessibility() {
        return accessibility;
    }

    public void setAccessibility(Accessibility accessibility) {
        this.accessibility = accessibility;
    }

    public SentimentAnalysis getSentimentAnalysis() {
        return sentimentAnalysis;
    }

    public void setSentimentAnalysis(SentimentAnalysis sentimentAnalysis) {
        this.sentimentAnalysis = sentimentAnalysis;
    }

    public String getSentimentUpdatedAt() {
        return sentimentUpdatedAt;
    }

    public void setSentimentUpdatedAt(String sentimentUpdatedAt) {
        this.sentimentUpdatedAt = sentimentUpdatedAt;
    }

    public String getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(String deletedAt) {
        this.deletedAt = deletedAt;
    }
}
