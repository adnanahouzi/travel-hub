package com.travelhub.connectors.nuitee.dto.response;

import java.util.List;

public class Room {
    private Integer id;
    private String roomName;
    private String description;
    private Integer roomSizeSquare;
    private String roomSizeUnit;
    private String hotelId;
    private Integer maxAdults;
    private Integer maxChildren;
    private Integer maxOccupancy;
    
    private List<BedType> bedTypes;
    private List<RoomAmenity> roomAmenities;
    private List<RoomPhoto> photos;
    
    @com.fasterxml.jackson.annotation.JsonFormat(with = com.fasterxml.jackson.annotation.JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<Object> views;
    
    private String bedRelation;

    // Getters and Setters

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getRoomSizeSquare() { return roomSizeSquare; }
    public void setRoomSizeSquare(Integer roomSizeSquare) { this.roomSizeSquare = roomSizeSquare; }

    public String getRoomSizeUnit() { return roomSizeUnit; }
    public void setRoomSizeUnit(String roomSizeUnit) { this.roomSizeUnit = roomSizeUnit; }

    public String getHotelId() { return hotelId; }
    public void setHotelId(String hotelId) { this.hotelId = hotelId; }

    public Integer getMaxAdults() { return maxAdults; }
    public void setMaxAdults(Integer maxAdults) { this.maxAdults = maxAdults; }

    public Integer getMaxChildren() { return maxChildren; }
    public void setMaxChildren(Integer maxChildren) { this.maxChildren = maxChildren; }

    public Integer getMaxOccupancy() { return maxOccupancy; }
    public void setMaxOccupancy(Integer maxOccupancy) { this.maxOccupancy = maxOccupancy; }

    public List<BedType> getBedTypes() { return bedTypes; }
    public void setBedTypes(List<BedType> bedTypes) { this.bedTypes = bedTypes; }

    public List<RoomAmenity> getRoomAmenities() { return roomAmenities; }
    public void setRoomAmenities(List<RoomAmenity> roomAmenities) { this.roomAmenities = roomAmenities; }

    public List<RoomPhoto> getPhotos() { return photos; }
    public void setPhotos(List<RoomPhoto> photos) { this.photos = photos; }

    public List<Object> getViews() { return views; }
    public void setViews(List<Object> views) { this.views = views; }

    public String getBedRelation() { return bedRelation; }
    public void setBedRelation(String bedRelation) { this.bedRelation = bedRelation; }
}

