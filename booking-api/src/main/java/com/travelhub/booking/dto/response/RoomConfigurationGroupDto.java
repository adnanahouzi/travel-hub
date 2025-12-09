package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Group of room offers with identical configuration")
public class RoomConfigurationGroupDto {

    @Schema(description = "Unique key identifying this configuration")
    private String configurationKey;

    @Schema(description = "Display name for the room configuration")
    private String name;

    @Schema(description = "Room breakdown specific to this configuration (for display)")
    private List<RoomBreakdownDto> roomBreakdown; // Can take from the first offer

    @Schema(description = "Lowest available price for this configuration")
    private RetailRateDetailDto startingPrice;

    @Schema(description = "List of all offers/rates available for this configuration")
    private List<GroupedRateDto> offers;

    // Getters and Setters
    public String getConfigurationKey() {
        return configurationKey;
    }

    public void setConfigurationKey(String configurationKey) {
        this.configurationKey = configurationKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<RoomBreakdownDto> getRoomBreakdown() {
        return roomBreakdown;
    }

    public void setRoomBreakdown(List<RoomBreakdownDto> roomBreakdown) {
        this.roomBreakdown = roomBreakdown;
    }

    public RetailRateDetailDto getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(RetailRateDetailDto startingPrice) {
        this.startingPrice = startingPrice;
    }

    public List<GroupedRateDto> getOffers() {
        return offers;
    }

    public void setOffers(List<GroupedRateDto> offers) {
        this.offers = offers;
    }
}
