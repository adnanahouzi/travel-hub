package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Grouped rate representing an offer with room breakdown")
public class GroupedRateDto {

    @Schema(description = "Offer ID required for prebook", example = "3gAVonJzkYykc3JpZ...")
    private String offerId;

    @Schema(description = "Breakdown of rooms in this offer")
    private List<RoomBreakdownDto> roomBreakdown;

    @Schema(description = "Board type", example = "BB")
    private String boardType;

    @Schema(description = "Board name", example = "Breakfast included")
    private String boardName;

    @Schema(description = "Room perks and amenities")
    private List<String> perks;

    @Schema(description = "Retail rate for the offer")
    private RetailRateDetailDto retailRate;

    @Schema(description = "Cancellation policies")
    private CancellationPolicyDetailDto cancellationPolicies;

    @Schema(description = "Available payment types")
    private List<String> paymentTypes;

    // Getters and Setters
    public String getOfferId() {
        return offerId;
    }

    public void setOfferId(String offerId) {
        this.offerId = offerId;
    }

    public List<RoomBreakdownDto> getRoomBreakdown() {
        return roomBreakdown;
    }

    public void setRoomBreakdown(List<RoomBreakdownDto> roomBreakdown) {
        this.roomBreakdown = roomBreakdown;
    }

    public String getBoardType() {
        return boardType;
    }

    public void setBoardType(String boardType) {
        this.boardType = boardType;
    }

    public String getBoardName() {
        return boardName;
    }

    public void setBoardName(String boardName) {
        this.boardName = boardName;
    }

    public List<String> getPerks() {
        return perks;
    }

    public void setPerks(List<String> perks) {
        this.perks = perks;
    }

    public RetailRateDetailDto getRetailRate() {
        return retailRate;
    }

    public void setRetailRate(RetailRateDetailDto retailRate) {
        this.retailRate = retailRate;
    }

    public CancellationPolicyDetailDto getCancellationPolicies() {
        return cancellationPolicies;
    }

    public void setCancellationPolicies(CancellationPolicyDetailDto cancellationPolicies) {
        this.cancellationPolicies = cancellationPolicies;
    }

    public List<String> getPaymentTypes() {
        return paymentTypes;
    }

    public void setPaymentTypes(List<String> paymentTypes) {
        this.paymentTypes = paymentTypes;
    }
}
