package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Breakdown of a room type within an offer, including count of identical rooms")
public class RoomBreakdownDto {

    @Schema(description = "Room ID from hotel details", example = "12345")
    private Long mappedRoomId;

    @Schema(description = "Room name", example = "Superior Room - Pool View")
    private String name;

    @Schema(description = "Number of this room type in the offer", example = "2")
    private Integer count;

    @Schema(description = "Number of adults this room accommodates", example = "2")
    private Integer adultCount;

    @Schema(description = "Number of children this room accommodates", example = "1")
    private Integer childCount;

    @Schema(description = "Room size in square units", example = "35")
    private Integer roomSize;

    @Schema(description = "Room size unit", example = "m²")
    private String roomSizeUnit;

    @Schema(description = "Room photos")
    private List<RoomPhotoDto> roomPhotos;

    @Schema(description = "Individual rates for this room type (for booking)")
    private List<RateDto> rates;

    // Getters and Setters
    public Long getMappedRoomId() {
        return mappedRoomId;
    }

    public void setMappedRoomId(Long mappedRoomId) {
        this.mappedRoomId = mappedRoomId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Integer getAdultCount() {
        return adultCount;
    }

    public void setAdultCount(Integer adultCount) {
        this.adultCount = adultCount;
    }

    public Integer getChildCount() {
        return childCount;
    }

    public void setChildCount(Integer childCount) {
        this.childCount = childCount;
    }

    public Integer getRoomSize() {
        return roomSize;
    }

    public void setRoomSize(Integer roomSize) {
        this.roomSize = roomSize;
    }

    public String getRoomSizeUnit() {
        return roomSizeUnit;
    }

    public void setRoomSizeUnit(String roomSizeUnit) {
        this.roomSizeUnit = roomSizeUnit;
    }

    public List<RoomPhotoDto> getRoomPhotos() {
        return roomPhotos;
    }

    public void setRoomPhotos(List<RoomPhotoDto> roomPhotos) {
        this.roomPhotos = roomPhotos;
    }

    public List<RateDto> getRates() {
        return rates;
    }

    public void setRates(List<RateDto> rates) {
        this.rates = rates;
    }
}
