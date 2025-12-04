package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Response containing a list of matching places")
public class PlaceSearchResponseDto {

    @Schema(description = "List of places matching the search criteria")
    private List<PlaceDto> places;

    public PlaceSearchResponseDto() {
    }

    public PlaceSearchResponseDto(List<PlaceDto> places) {
        this.places = places;
    }

    public List<PlaceDto> getPlaces() {
        return places;
    }

    public void setPlaces(List<PlaceDto> places) {
        this.places = places;
    }
}

