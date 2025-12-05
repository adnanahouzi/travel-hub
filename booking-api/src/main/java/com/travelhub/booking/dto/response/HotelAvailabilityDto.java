package com.travelhub.booking.dto.response;

import java.math.BigDecimal;
import java.util.List;

    public class HotelAvailabilityDto {
    // From HotelInfo
    private String hotelId;
    private String name;
    private String mainPhoto;
    private String address;
    private BigDecimal rating;


    
    // From HotelRate
    private List<RoomTypeDto> roomTypes;
    private Integer et;

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
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
}

