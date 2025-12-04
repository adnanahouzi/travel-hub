package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Place information (city, region, etc.)")
public class PlaceDto {

    @Schema(description = "Unique identifier for the place", example = "ChIJD7fiBh9u5kcRYJSMaMOCCwQ")
    private String placeId;

    @Schema(description = "Display name of the place", example = "Paris")
    private String displayName;

    @Schema(description = "Formatted address of the place", example = "Paris, France")
    private String formattedAddress;

    @Schema(description = "Types/categories of the place", example = "[\"locality\", \"political\"]")
    private List<String> types;

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getFormattedAddress() {
        return formattedAddress;
    }

    public void setFormattedAddress(String formattedAddress) {
        this.formattedAddress = formattedAddress;
    }

    public List<String> getTypes() {
        return types;
    }

    public void setTypes(List<String> types) {
        this.types = types;
    }
}

