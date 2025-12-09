package com.travelhub.booking.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class HotelAvailabilityDto {
    // From HotelInfo - Enhanced with data from hotels list
    private String hotelId;
    private String name;
    private String mainPhoto;
    private String thumbnail;
    private String address;
    private String city;
    private String country;
    private String countryCode;
    private String zip;
    private BigDecimal rating;
    private Integer reviewCount;
    private Integer stars;
    private String hotelDescription;
    private String hotelType;
    private Integer hotelTypeId;
    private String chain;
    private Integer chainId;
    private String currency;
    private LocationDto location;
    private List<Integer> facilityIds;

    // From HotelRate
    private List<RoomTypeDto> roomTypes;
    private Integer et;

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

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
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

    public String getHotelDescription() {
        return hotelDescription;
    }

    public void setHotelDescription(String hotelDescription) {
        this.hotelDescription = hotelDescription;
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

    public String getChain() {
        return chain;
    }

    public void setChain(String chain) {
        this.chain = chain;
    }

    public Integer getChainId() {
        return chainId;
    }

    public void setChainId(Integer chainId) {
        this.chainId = chainId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocationDto getLocation() {
        return location;
    }

    public void setLocation(LocationDto location) {
        this.location = location;
    }

    public List<Integer> getFacilityIds() {
        return facilityIds;
    }

    public void setFacilityIds(List<Integer> facilityIds) {
        this.facilityIds = facilityIds;
    }

    public List<RoomTypeDto> getRoomTypes() {
        return roomTypes;
    }

    public void setRoomTypes(List<RoomTypeDto> roomTypes) {
        this.roomTypes = roomTypes;
    }

    public Integer getEt() {
        return et;
    }

    public void setEt(Integer et) {
        this.et = et;
    }

    public Integer getStars() {
        return stars;
    }

    public void setStars(Integer stars) {
        this.stars = stars;
    }
}
