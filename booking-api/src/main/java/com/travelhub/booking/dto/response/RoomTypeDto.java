package com.travelhub.booking.dto.response;

import java.util.List;

public class RoomTypeDto {
    private String roomTypeId;
    private String offerId;
    private String supplier;
    private Integer supplierId;
    private List<RateDto> rates;
    
    private PriceDto offerRetailRate;
    private PriceDto suggestedSellingPrice;
    private PriceDto offerInitialPrice;
    
    private String priceType;
    private String rateType;
    
    private List<String> paymentTypes;
    
    // Enriched fields from hotel details
    private String description;
    private Integer roomSize;
    private String roomSizeUnit;
    private Integer maxAdults;
    private Integer maxChildren;
    private Integer maxOccupancy;

    public String getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(String roomTypeId) {
        this.roomTypeId = roomTypeId;
    }

    public String getOfferId() {
        return offerId;
    }

    public void setOfferId(String offerId) {
        this.offerId = offerId;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public Integer getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Integer supplierId) {
        this.supplierId = supplierId;
    }

    public List<RateDto> getRates() {
        return rates;
    }

    public void setRates(List<RateDto> rates) {
        this.rates = rates;
    }

    public PriceDto getOfferRetailRate() {
        return offerRetailRate;
    }

    public void setOfferRetailRate(PriceDto offerRetailRate) {
        this.offerRetailRate = offerRetailRate;
    }

    public PriceDto getSuggestedSellingPrice() {
        return suggestedSellingPrice;
    }

    public void setSuggestedSellingPrice(PriceDto suggestedSellingPrice) {
        this.suggestedSellingPrice = suggestedSellingPrice;
    }

    public PriceDto getOfferInitialPrice() {
        return offerInitialPrice;
    }

    public void setOfferInitialPrice(PriceDto offerInitialPrice) {
        this.offerInitialPrice = offerInitialPrice;
    }

    public String getPriceType() {
        return priceType;
    }

    public void setPriceType(String priceType) {
        this.priceType = priceType;
    }

    public String getRateType() {
        return rateType;
    }

    public void setRateType(String rateType) {
        this.rateType = rateType;
    }

    public List<String> getPaymentTypes() {
        return paymentTypes;
    }

    public void setPaymentTypes(List<String> paymentTypes) {
        this.paymentTypes = paymentTypes;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Integer getMaxOccupancy() {
        return maxOccupancy;
    }

    public void setMaxOccupancy(Integer maxOccupancy) {
        this.maxOccupancy = maxOccupancy;
    }
}

