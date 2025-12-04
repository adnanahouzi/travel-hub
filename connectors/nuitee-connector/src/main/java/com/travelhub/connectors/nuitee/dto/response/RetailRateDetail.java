package com.travelhub.connectors.nuitee.dto.response;

import com.travelhub.connectors.nuitee.dto.common.Price;
import java.util.List;

public class RetailRateDetail {
    private List<Price> total;
    private List<Price> suggestedSellingPrice;
    private List<Price> initialPrice;
    private List<TaxAndFee> taxesAndFees;

    public List<Price> getTotal() {
        return total;
    }

    public void setTotal(List<Price> total) {
        this.total = total;
    }

    public List<Price> getSuggestedSellingPrice() {
        return suggestedSellingPrice;
    }

    public void setSuggestedSellingPrice(List<Price> suggestedSellingPrice) {
        this.suggestedSellingPrice = suggestedSellingPrice;
    }

    public List<Price> getInitialPrice() {
        return initialPrice;
    }

    public void setInitialPrice(List<Price> initialPrice) {
        this.initialPrice = initialPrice;
    }

    public List<TaxAndFee> getTaxesAndFees() {
        return taxesAndFees;
    }

    public void setTaxesAndFees(List<TaxAndFee> taxesAndFees) {
        this.taxesAndFees = taxesAndFees;
    }
}

