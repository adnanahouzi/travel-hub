package com.travelhub.connectors.nuitee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

public class MinimalHotelData {
    private String id;
    private String primaryHotelId;
    private String name;
    private String hotelDescription;
    private String hotelImportantInformation;
    private String hotelType;
    private Integer hotelTypeId;
    private Integer chainId;
    private String chain;
    private String currency;
    private Integer stars;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private String zip;
    private String city;
    private String country;
    private String countryCode;
    @JsonProperty("main_photo")
    private String mainPhoto;
    private String thumbnail;
    private Double rating;
    private Integer reviewCount;
    private List<Integer> facilityIds;
    private AccessibilityAttributes accessibilityAttributes;
    private String deletedAt;

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPrimaryHotelId() {
        return primaryHotelId;
    }

    public void setPrimaryHotelId(String primaryHotelId) {
        this.primaryHotelId = primaryHotelId;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
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

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public List<Integer> getFacilityIds() {
        return facilityIds;
    }

    public void setFacilityIds(List<Integer> facilityIds) {
        this.facilityIds = facilityIds;
    }

    public AccessibilityAttributes getAccessibilityAttributes() {
        return accessibilityAttributes;
    }

    public void setAccessibilityAttributes(AccessibilityAttributes accessibilityAttributes) {
        this.accessibilityAttributes = accessibilityAttributes;
    }

    public String getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(String deletedAt) {
        this.deletedAt = deletedAt;
    }

    public Integer getStars() {
        return stars;
    }

    public void setStars(Integer stars) {
        this.stars = stars;
    }

    public static class AccessibilityAttributes {
        private List<String> attributes;
        private String showerChair;
        private String entranceType;
        private String petFriendly;
        private Integer rampAngle;
        private Integer rampLength;
        private Integer entranceDoorWidth;
        private Integer roomMaxGuestsNumber;
        private Integer distanceFromTheElevatorToTheAccessibleRoom;

        public List<String> getAttributes() {
            return attributes;
        }

        public void setAttributes(List<String> attributes) {
            this.attributes = attributes;
        }

        public String getShowerChair() {
            return showerChair;
        }

        public void setShowerChair(String showerChair) {
            this.showerChair = showerChair;
        }

        public String getEntranceType() {
            return entranceType;
        }

        public void setEntranceType(String entranceType) {
            this.entranceType = entranceType;
        }

        public String getPetFriendly() {
            return petFriendly;
        }

        public void setPetFriendly(String petFriendly) {
            this.petFriendly = petFriendly;
        }

        public Integer getRampAngle() {
            return rampAngle;
        }

        public void setRampAngle(Integer rampAngle) {
            this.rampAngle = rampAngle;
        }

        public Integer getRampLength() {
            return rampLength;
        }

        public void setRampLength(Integer rampLength) {
            this.rampLength = rampLength;
        }

        public Integer getEntranceDoorWidth() {
            return entranceDoorWidth;
        }

        public void setEntranceDoorWidth(Integer entranceDoorWidth) {
            this.entranceDoorWidth = entranceDoorWidth;
        }

        public Integer getRoomMaxGuestsNumber() {
            return roomMaxGuestsNumber;
        }

        public void setRoomMaxGuestsNumber(Integer roomMaxGuestsNumber) {
            this.roomMaxGuestsNumber = roomMaxGuestsNumber;
        }

        public Integer getDistanceFromTheElevatorToTheAccessibleRoom() {
            return distanceFromTheElevatorToTheAccessibleRoom;
        }

        public void setDistanceFromTheElevatorToTheAccessibleRoom(Integer distanceFromTheElevatorToTheAccessibleRoom) {
            this.distanceFromTheElevatorToTheAccessibleRoom = distanceFromTheElevatorToTheAccessibleRoom;
        }
    }


    public static class Location {
        private BigDecimal latitude;
        private BigDecimal longitude;

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
    }

    public static class Viewport {
        private Coordinate high;
        private Coordinate low;

        public Coordinate getHigh() {
            return high;
        }

        public void setHigh(Coordinate high) {
            this.high = high;
        }

        public Coordinate getLow() {
            return low;
        }

        public void setLow(Coordinate low) {
            this.low = low;
        }
    }

    public static class Coordinate {
        private BigDecimal latitude;
        private BigDecimal longitude;

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
    }
}
