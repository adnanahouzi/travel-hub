package com.travelhub.connectors.nuitee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PlaceDetails {
    @JsonProperty("place_id")
    private String placeId;

    private String description;
    private String city;
    private Location location;

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}
