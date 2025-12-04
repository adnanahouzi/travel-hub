package com.travelhub.connectors.nuitee.dto.response;

import com.travelhub.connectors.nuitee.dto.common.Price;
import java.util.List;

public class RoomType {
    private String roomTypeId;
    private String offerId;
    private String supplier;
    private Integer supplierId;
    private List<Rate> rates;
    
    private Price offerRetailRate;
    private Price suggestedSellingPrice;
    private Price offerInitialPrice;
    
    private String priceType; // e.g., "commission"
    private String rateType; // e.g., "package", "standard"
    
    private List<String> paymentTypes;

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

    public List<Rate> getRates() {
        return rates;
    }

    public void setRates(List<Rate> rates) {
        this.rates = rates;
    }

    public Price getOfferRetailRate() {
        return offerRetailRate;
    }

    public void setOfferRetailRate(Price offerRetailRate) {
        this.offerRetailRate = offerRetailRate;
    }

    public Price getSuggestedSellingPrice() {
        return suggestedSellingPrice;
    }

    public void setSuggestedSellingPrice(Price suggestedSellingPrice) {
        this.suggestedSellingPrice = suggestedSellingPrice;
    }

    public Price getOfferInitialPrice() {
        return offerInitialPrice;
    }

    public void setOfferInitialPrice(Price offerInitialPrice) {
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
}
