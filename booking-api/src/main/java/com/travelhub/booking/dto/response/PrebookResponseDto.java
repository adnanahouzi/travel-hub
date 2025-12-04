package com.travelhub.booking.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class PrebookResponseDto {

    private PrebookDataDto data;
    private Integer guestLevel;
    private Boolean sandbox;

    public PrebookDataDto getData() {
        return data;
    }

    public void setData(PrebookDataDto data) {
        this.data = data;
    }

    public Integer getGuestLevel() {
        return guestLevel;
    }

    public void setGuestLevel(Integer guestLevel) {
        this.guestLevel = guestLevel;
    }

    public Boolean getSandbox() {
        return sandbox;
    }

    public void setSandbox(Boolean sandbox) {
        this.sandbox = sandbox;
    }

    public static class PrebookDataDto {
        private String prebookId;
        private String offerId;
        private String hotelId;
        private String currency;
        private String termsAndConditions;
        private List<RoomTypeDto> roomTypes;
        private BigDecimal suggestedSellingPrice;
        private Boolean isPackageRate;
        private BigDecimal commission;
        private BigDecimal price;
        private String priceType;
        private BigDecimal priceDifferencePercent;
        private Boolean cancellationChanged;
        private Boolean boardChanged;
        private String supplier;
        private Integer supplierId;
        private List<String> paymentTypes;
        private String checkin;
        private String checkout;

        public String getPrebookId() {
            return prebookId;
        }

        public void setPrebookId(String prebookId) {
            this.prebookId = prebookId;
        }

        public String getOfferId() {
            return offerId;
        }

        public void setOfferId(String offerId) {
            this.offerId = offerId;
        }

        public String getHotelId() {
            return hotelId;
        }

        public void setHotelId(String hotelId) {
            this.hotelId = hotelId;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getTermsAndConditions() {
            return termsAndConditions;
        }

        public void setTermsAndConditions(String termsAndConditions) {
            this.termsAndConditions = termsAndConditions;
        }

        public List<RoomTypeDto> getRoomTypes() {
            return roomTypes;
        }

        public void setRoomTypes(List<RoomTypeDto> roomTypes) {
            this.roomTypes = roomTypes;
        }

        public BigDecimal getSuggestedSellingPrice() {
            return suggestedSellingPrice;
        }

        public void setSuggestedSellingPrice(BigDecimal suggestedSellingPrice) {
            this.suggestedSellingPrice = suggestedSellingPrice;
        }

        public Boolean getIsPackageRate() {
            return isPackageRate;
        }

        public void setIsPackageRate(Boolean packageRate) {
            isPackageRate = packageRate;
        }

        public BigDecimal getCommission() {
            return commission;
        }

        public void setCommission(BigDecimal commission) {
            this.commission = commission;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getPriceType() {
            return priceType;
        }

        public void setPriceType(String priceType) {
            this.priceType = priceType;
        }

        public BigDecimal getPriceDifferencePercent() {
            return priceDifferencePercent;
        }

        public void setPriceDifferencePercent(BigDecimal priceDifferencePercent) {
            this.priceDifferencePercent = priceDifferencePercent;
        }

        public Boolean getCancellationChanged() {
            return cancellationChanged;
        }

        public void setCancellationChanged(Boolean cancellationChanged) {
            this.cancellationChanged = cancellationChanged;
        }

        public Boolean getBoardChanged() {
            return boardChanged;
        }

        public void setBoardChanged(Boolean boardChanged) {
            this.boardChanged = boardChanged;
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

        public List<String> getPaymentTypes() {
            return paymentTypes;
        }

        public void setPaymentTypes(List<String> paymentTypes) {
            this.paymentTypes = paymentTypes;
        }

        public String getCheckin() {
            return checkin;
        }

        public void setCheckin(String checkin) {
            this.checkin = checkin;
        }

        public String getCheckout() {
            return checkout;
        }

        public void setCheckout(String checkout) {
            this.checkout = checkout;
        }
    }
}

