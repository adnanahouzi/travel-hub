package com.travelhub.booking.dto.response;

import java.util.List;

public class RetailRateDetailDto {
    private List<PriceDto> total;
    private List<PriceDto> suggestedSellingPrice;
    private List<PriceDto> initialPrice;
    private List<TaxAndFeeDto> taxesAndFees;
    private List<PriceDto> totalPerNight;

    public List<PriceDto> getTotal() {
        return total;
    }

    public void setTotal(List<PriceDto> total) {
        this.total = total;
    }

    public List<PriceDto> getSuggestedSellingPrice() {
        return suggestedSellingPrice;
    }

    public void setSuggestedSellingPrice(List<PriceDto> suggestedSellingPrice) {
        this.suggestedSellingPrice = suggestedSellingPrice;
    }

    public List<PriceDto> getInitialPrice() {
        return initialPrice;
    }

    public void setInitialPrice(List<PriceDto> initialPrice) {
        this.initialPrice = initialPrice;
    }

    public List<TaxAndFeeDto> getTaxesAndFees() {
        return taxesAndFees;
    }

    public void setTaxesAndFees(List<TaxAndFeeDto> taxesAndFees) {
        this.taxesAndFees = taxesAndFees;
    }

    public List<PriceDto> getTotalPerNight() {
        return totalPerNight;
    }

    public void setTotalPerNight(List<PriceDto> totalPerNight) {
        this.totalPerNight = totalPerNight;
    }
}

