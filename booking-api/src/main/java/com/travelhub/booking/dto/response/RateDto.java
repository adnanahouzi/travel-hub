package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Rate information for a specific room type and occupancy")
public class RateDto {
    @Schema(description = "Offer ID required for prebook", example = "3gAVonJzkYykc3JpZ...")
    private String offerId;  // Required for prebook
    
    @Schema(description = "Unique identifier for this rate", example = "rate_12345")
    private String rateId;
    private Integer occupancyNumber;
    private String name;
    private Integer maxOccupancy;
    private Integer adultCount;
    private Integer childCount;
    private List<Integer> childrenAges;
    
    private String boardType;
    private String boardName;
    private String remarks;
    private String priceType;
    
    private List<PriceDto> commission;
    private RetailRateDetailDto retailRate;
    private CancellationPolicyDetailDto cancellationPolicies;
    
    private Long mappedRoomId;
    private List<String> paymentTypes;
    private PriceDto providerCommission;
    private List<String> perks;
    
    // Enriched fields from hotel room details
    private String roomDescription;
    private Integer roomSize;
    private String roomSizeUnit;
    private Integer maxAdults;
    private Integer maxChildren;
    
    @Schema(description = "Room photos")
    private List<RoomPhotoDto> roomPhotos;

    public String getOfferId() {
        return offerId;
    }

    public void setOfferId(String offerId) {
        this.offerId = offerId;
    }

    public String getRateId() {
        return rateId;
    }

    public void setRateId(String rateId) {
        this.rateId = rateId;
    }

    public Integer getOccupancyNumber() {
        return occupancyNumber;
    }

    public void setOccupancyNumber(Integer occupancyNumber) {
        this.occupancyNumber = occupancyNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getMaxOccupancy() {
        return maxOccupancy;
    }

    public void setMaxOccupancy(Integer maxOccupancy) {
        this.maxOccupancy = maxOccupancy;
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

    public List<Integer> getChildrenAges() {
        return childrenAges;
    }

    public void setChildrenAges(List<Integer> childrenAges) {
        this.childrenAges = childrenAges;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getPriceType() {
        return priceType;
    }

    public void setPriceType(String priceType) {
        this.priceType = priceType;
    }

    public List<PriceDto> getCommission() {
        return commission;
    }

    public void setCommission(List<PriceDto> commission) {
        this.commission = commission;
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

    public Long getMappedRoomId() {
        return mappedRoomId;
    }

    public void setMappedRoomId(Long mappedRoomId) {
        this.mappedRoomId = mappedRoomId;
    }

    public List<String> getPaymentTypes() {
        return paymentTypes;
    }

    public void setPaymentTypes(List<String> paymentTypes) {
        this.paymentTypes = paymentTypes;
    }

    public PriceDto getProviderCommission() {
        return providerCommission;
    }

    public void setProviderCommission(PriceDto providerCommission) {
        this.providerCommission = providerCommission;
    }

    public List<String> getPerks() {
        return perks;
    }

    public void setPerks(List<String> perks) {
        this.perks = perks;
    }

    public String getRoomDescription() {
        return roomDescription;
    }

    public void setRoomDescription(String roomDescription) {
        this.roomDescription = roomDescription;
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

    public Integer getMaxAdults() {
        return maxAdults;
    }

    public void setMaxAdults(Integer maxAdults) {
        this.maxAdults = maxAdults;
    }

    public Integer getMaxChildren() {
        return maxChildren;
    }

    public void setMaxChildren(Integer maxChildren) {
        this.maxChildren = maxChildren;
    }

    public List<RoomPhotoDto> getRoomPhotos() {
        return roomPhotos;
    }

    public void setRoomPhotos(List<RoomPhotoDto> roomPhotos) {
        this.roomPhotos = roomPhotos;
    }
}

