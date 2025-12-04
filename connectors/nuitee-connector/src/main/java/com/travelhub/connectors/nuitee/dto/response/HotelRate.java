package com.travelhub.connectors.nuitee.dto.response;

import java.util.List;

public class HotelRate {
    private String hotelId;
    private List<RoomType> roomTypes;
    private Integer et; // e.g. 10800

    public String getHotelId() {
        return hotelId;
    }

    public void setHotelId(String hotelId) {
        this.hotelId = hotelId;
    }

    public List<RoomType> getRoomTypes() {
        return roomTypes;
    }

    public void setRoomTypes(List<RoomType> roomTypes) {
        this.roomTypes = roomTypes;
    }

    public Integer getEt() {
        return et;
    }

    public void setEt(Integer et) {
        this.et = et;
    }
}
