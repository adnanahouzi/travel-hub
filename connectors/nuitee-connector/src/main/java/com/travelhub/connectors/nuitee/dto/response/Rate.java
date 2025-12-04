package com.travelhub.connectors.nuitee.dto.response;

import com.travelhub.connectors.nuitee.dto.common.Price;
import java.math.BigDecimal;
import java.util.List;

public class Rate {
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
    private String priceType; // e.g., "commission"
    
    private List<Price> commission;
    private RetailRateDetail retailRate;
    private CancellationPolicyDetail cancellationPolicies;
    
    private Long mappedRoomId;
    private List<String> paymentTypes;
    private Price providerCommission;
    private List<String> perks;

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

    public List<Price> getCommission() {
        return commission;
    }

    public void setCommission(List<Price> commission) {
        this.commission = commission;
    }

    public RetailRateDetail getRetailRate() {
        return retailRate;
    }

    public void setRetailRate(RetailRateDetail retailRate) {
        this.retailRate = retailRate;
    }

    public CancellationPolicyDetail getCancellationPolicies() {
        return cancellationPolicies;
    }

    public void setCancellationPolicies(CancellationPolicyDetail cancellationPolicies) {
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

    public Price getProviderCommission() {
        return providerCommission;
    }

    public void setProviderCommission(Price providerCommission) {
        this.providerCommission = providerCommission;
    }

    public List<String> getPerks() {
        return perks;
    }

    public void setPerks(List<String> perks) {
        this.perks = perks;
    }
}
