package com.travelhub.connectors.nuitee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BookResponse {

    private BookData data;
    private Integer guestLevel;
    private Boolean sandbox;

    public BookData getData() {
        return data;
    }

    public void setData(BookData data) {
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

    public static class BookData {
        private String bookingId;
        private String clientReference;
        private String supplierBookingId;
        private String supplierBookingName;
        private String supplier;
        private Integer supplierId;
        private String hotelConfirmationCode;
        private String reference;
        private String status;
        private String checkin;
        private String checkout;
        private BookingHotelInfo hotel;
        @JsonProperty("bookedRooms")
        private List<RoomBooked> rooms;

        @JsonProperty("holder")
        private GuestContact holder;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private CancellationPolicyDetail cancellationPolicies;
        private String specialRemarks;
        private String optionalFees;
        private String mandatoryFees;
        private String knowBeforeYouGo;
        private BigDecimal price;
        private BigDecimal commission;
        private BigDecimal addonsTotalAmount;
        private String currency;
        private String remarks;
        private String voucherCode;
        private BigDecimal voucherTotalAmount;
        private Object addons;
        private Integer guestId;
        private BigDecimal distributorCommission;
        private BigDecimal distributorPrice;
        private String trackingId;
        private String firstName;
        private String lastName;
        private Integer adults;
        private String children;
        private Integer childrenCount;
        private String prebookId;
        private String paymentStatus;
        private String paymentTransactionId;
        private String sellingPrice;
        private BigDecimal exchangeRate;
        private BigDecimal exchangeRateUsd;
        private String email;
        private String tag;
        private String lastFreeCancellationDate;
        private BigDecimal apiCommission;
        private Integer userId;
        private String nationality;
        private String holderTitle;
        private String hotelId;
        private String hotelName;
        private LocalDateTime cancelledAt;
        private LocalDateTime refundedAt;
        private Integer loyaltyGuestId;
        private Integer sandbox;
        private BigDecimal clientCommission;
        private String voucherId;
        private String voucherTransationId;
        private BigDecimal processingFee;
        private BigDecimal amountRefunded;
        private String refundType;
        private LocalDateTime paymentScheduledAt;
        private Object addonsRedemptions;
        private String rebookFrom;
        private Integer agentId;
        private String cancelledBy;
        private Object feed;
        private Object goodwillPayment;
        private BigDecimal newCharges;
        private BigDecimal compensationAmount;
        private String hotelRemarks;

        public BookingHotelInfo getHotel() {
            return hotel;
        }

        public void setHotel(BookingHotelInfo hotel) {
            this.hotel = hotel;
        }

        public GuestContact getHolder() {
            return holder;
        }

        public void setHolder(GuestContact holder) {
            this.holder = holder;
        }

        public String getBookingId() {
            return bookingId;
        }

        public void setBookingId(String bookingId) {
            this.bookingId = bookingId;
        }

        public String getHotelConfirmationCode() {
            return hotelConfirmationCode;
        }

        public void setHotelConfirmationCode(String hotelConfirmationCode) {
            this.hotelConfirmationCode = hotelConfirmationCode;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
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

        public String getHotelId() {
            return hotelId;
        }

        public void setHotelId(String hotelId) {
            this.hotelId = hotelId;
        }

        public String getHotelName() {
            return hotelName;
        }

        public void setHotelName(String hotelName) {
            this.hotelName = hotelName;
        }

        public List<RoomBooked> getRooms() {
            return rooms;
        }

        public void setRooms(List<RoomBooked> rooms) {
            this.rooms = rooms;
        }



        // Getters and Setters for new fields
        public String getClientReference() {
            return clientReference;
        }

        public void setClientReference(String clientReference) {
            this.clientReference = clientReference;
        }

        public String getSupplierBookingId() {
            return supplierBookingId;
        }

        public void setSupplierBookingId(String supplierBookingId) {
            this.supplierBookingId = supplierBookingId;
        }

        public String getSupplierBookingName() {
            return supplierBookingName;
        }

        public void setSupplierBookingName(String supplierBookingName) {
            this.supplierBookingName = supplierBookingName;
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


        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }

        public void setUpdatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
        }

        public CancellationPolicyDetail getCancellationPolicies() {
            return cancellationPolicies;
        }

        public void setCancellationPolicies(CancellationPolicyDetail cancellationPolicies) {
            this.cancellationPolicies = cancellationPolicies;
        }

        public String getSpecialRemarks() {
            return specialRemarks;
        }

        public void setSpecialRemarks(String specialRemarks) {
            this.specialRemarks = specialRemarks;
        }

        public String getOptionalFees() {
            return optionalFees;
        }

        public void setOptionalFees(String optionalFees) {
            this.optionalFees = optionalFees;
        }

        public String getMandatoryFees() {
            return mandatoryFees;
        }

        public void setMandatoryFees(String mandatoryFees) {
            this.mandatoryFees = mandatoryFees;
        }

        public String getKnowBeforeYouGo() {
            return knowBeforeYouGo;
        }

        public void setKnowBeforeYouGo(String knowBeforeYouGo) {
            this.knowBeforeYouGo = knowBeforeYouGo;
        }

        public BigDecimal getCommission() {
            return commission;
        }

        public void setCommission(BigDecimal commission) {
            this.commission = commission;
        }

        public BigDecimal getAddonsTotalAmount() {
            return addonsTotalAmount;
        }

        public void setAddonsTotalAmount(BigDecimal addonsTotalAmount) {
            this.addonsTotalAmount = addonsTotalAmount;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getVoucherCode() {
            return voucherCode;
        }

        public void setVoucherCode(String voucherCode) {
            this.voucherCode = voucherCode;
        }

        public BigDecimal getVoucherTotalAmount() {
            return voucherTotalAmount;
        }

        public void setVoucherTotalAmount(BigDecimal voucherTotalAmount) {
            this.voucherTotalAmount = voucherTotalAmount;
        }

        public Object getAddons() {
            return addons;
        }

        public void setAddons(Object addons) {
            this.addons = addons;
        }

        public Integer getGuestId() {
            return guestId;
        }

        public void setGuestId(Integer guestId) {
            this.guestId = guestId;
        }

        public BigDecimal getDistributorCommission() {
            return distributorCommission;
        }

        public void setDistributorCommission(BigDecimal distributorCommission) {
            this.distributorCommission = distributorCommission;
        }

        public BigDecimal getDistributorPrice() {
            return distributorPrice;
        }

        public void setDistributorPrice(BigDecimal distributorPrice) {
            this.distributorPrice = distributorPrice;
        }

        public String getTrackingId() {
            return trackingId;
        }

        public void setTrackingId(String trackingId) {
            this.trackingId = trackingId;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public Integer getAdults() {
            return adults;
        }

        public void setAdults(Integer adults) {
            this.adults = adults;
        }

        public String getChildren() {
            return children;
        }

        public void setChildren(String children) {
            this.children = children;
        }

        public Integer getChildrenCount() {
            return childrenCount;
        }

        public void setChildrenCount(Integer childrenCount) {
            this.childrenCount = childrenCount;
        }

        public String getPrebookId() {
            return prebookId;
        }

        public void setPrebookId(String prebookId) {
            this.prebookId = prebookId;
        }

        public String getPaymentStatus() {
            return paymentStatus;
        }

        public void setPaymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
        }

        public String getPaymentTransactionId() {
            return paymentTransactionId;
        }

        public void setPaymentTransactionId(String paymentTransactionId) {
            this.paymentTransactionId = paymentTransactionId;
        }

        public String getSellingPrice() {
            return sellingPrice;
        }

        public void setSellingPrice(String sellingPrice) {
            this.sellingPrice = sellingPrice;
        }

        public BigDecimal getExchangeRate() {
            return exchangeRate;
        }

        public void setExchangeRate(BigDecimal exchangeRate) {
            this.exchangeRate = exchangeRate;
        }

        public BigDecimal getExchangeRateUsd() {
            return exchangeRateUsd;
        }

        public void setExchangeRateUsd(BigDecimal exchangeRateUsd) {
            this.exchangeRateUsd = exchangeRateUsd;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getTag() {
            return tag;
        }

        public void setTag(String tag) {
            this.tag = tag;
        }

        public String getLastFreeCancellationDate() {
            return lastFreeCancellationDate;
        }

        public void setLastFreeCancellationDate(String lastFreeCancellationDate) {
            this.lastFreeCancellationDate = lastFreeCancellationDate;
        }

        public BigDecimal getApiCommission() {
            return apiCommission;
        }

        public void setApiCommission(BigDecimal apiCommission) {
            this.apiCommission = apiCommission;
        }

        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public String getNationality() {
            return nationality;
        }

        public void setNationality(String nationality) {
            this.nationality = nationality;
        }

        public String getHolderTitle() {
            return holderTitle;
        }

        public void setHolderTitle(String holderTitle) {
            this.holderTitle = holderTitle;
        }

        public LocalDateTime getCancelledAt() {
            return cancelledAt;
        }

        public void setCancelledAt(LocalDateTime cancelledAt) {
            this.cancelledAt = cancelledAt;
        }

        public LocalDateTime getRefundedAt() {
            return refundedAt;
        }

        public void setRefundedAt(LocalDateTime refundedAt) {
            this.refundedAt = refundedAt;
        }

        public Integer getLoyaltyGuestId() {
            return loyaltyGuestId;
        }

        public void setLoyaltyGuestId(Integer loyaltyGuestId) {
            this.loyaltyGuestId = loyaltyGuestId;
        }

        public Integer getSandbox() {
            return sandbox;
        }

        public void setSandbox(Integer sandbox) {
            this.sandbox = sandbox;
        }

        public BigDecimal getClientCommission() {
            return clientCommission;
        }

        public void setClientCommission(BigDecimal clientCommission) {
            this.clientCommission = clientCommission;
        }

        public String getVoucherId() {
            return voucherId;
        }

        public void setVoucherId(String voucherId) {
            this.voucherId = voucherId;
        }

        public String getVoucherTransationId() {
            return voucherTransationId;
        }

        public void setVoucherTransationId(String voucherTransationId) {
            this.voucherTransationId = voucherTransationId;
        }

        public BigDecimal getProcessingFee() {
            return processingFee;
        }

        public void setProcessingFee(BigDecimal processingFee) {
            this.processingFee = processingFee;
        }

        public BigDecimal getAmountRefunded() {
            return amountRefunded;
        }

        public void setAmountRefunded(BigDecimal amountRefunded) {
            this.amountRefunded = amountRefunded;
        }

        public String getRefundType() {
            return refundType;
        }

        public void setRefundType(String refundType) {
            this.refundType = refundType;
        }

        public LocalDateTime getPaymentScheduledAt() {
            return paymentScheduledAt;
        }

        public void setPaymentScheduledAt(LocalDateTime paymentScheduledAt) {
            this.paymentScheduledAt = paymentScheduledAt;
        }

        public Object getAddonsRedemptions() {
            return addonsRedemptions;
        }

        public void setAddonsRedemptions(Object addonsRedemptions) {
            this.addonsRedemptions = addonsRedemptions;
        }

        public String getRebookFrom() {
            return rebookFrom;
        }

        public void setRebookFrom(String rebookFrom) {
            this.rebookFrom = rebookFrom;
        }

        public Integer getAgentId() {
            return agentId;
        }

        public void setAgentId(Integer agentId) {
            this.agentId = agentId;
        }

        public String getCancelledBy() {
            return cancelledBy;
        }

        public void setCancelledBy(String cancelledBy) {
            this.cancelledBy = cancelledBy;
        }

        public Object getFeed() {
            return feed;
        }

        public void setFeed(Object feed) {
            this.feed = feed;
        }

        public Object getGoodwillPayment() {
            return goodwillPayment;
        }

        public void setGoodwillPayment(Object goodwillPayment) {
            this.goodwillPayment = goodwillPayment;
        }

        public BigDecimal getNewCharges() {
            return newCharges;
        }

        public void setNewCharges(BigDecimal newCharges) {
            this.newCharges = newCharges;
        }

        public BigDecimal getCompensationAmount() {
            return compensationAmount;
        }

        public void setCompensationAmount(BigDecimal compensationAmount) {
            this.compensationAmount = compensationAmount;
        }

        public String getHotelRemarks() {
            return hotelRemarks;
        }

        public void setHotelRemarks(String hotelRemarks) {
            this.hotelRemarks = hotelRemarks;
        }
    }

    public static class RoomBooked {
        private RoomType roomType;
        private String roomName;

        private String boardType;

        private String boardName;

        private String boardCode;
        private Integer adults;
        private Integer children;
        private List<Integer> childrenAges;
        private RateDetail rate;
        private String firstName;
        private String lastName;
        private CancellationPolicyDetail cancellationPolicies;

        @JsonProperty("occupancy_number")
        private Integer occupancy_number;
        private BigDecimal amount;
        private String currency;
        @JsonProperty("children_count")
        private Integer children_count;
        private String remarks;
        private List<GuestContact> guests;


        public String getRoomName() {
           return roomName;

        }

        public void setRoomName(String roomName) {
            this.roomName = roomName;
        }

        public String getBoardName() {
            return boardName;
        }

        public void setBoardName(String boardName) {
            this.boardName = boardName;
        }

        
        public RoomType getRoomType() {
            return roomType;
        }
        
        public void setRoomType(RoomType roomType) {
            this.roomType = roomType;
        }

        // Getters and Setters for enriched fields
        public String getBoardType() {
            return boardType;
        }

        public void setBoardType(String boardType) {
            this.boardType = boardType;
        }

        public String getBoardCode() {
            return boardCode;
        }

        public void setBoardCode(String boardCode) {
            this.boardCode = boardCode;
        }

        public Integer getAdults() {
            return adults;
        }

        public void setAdults(Integer adults) {
            this.adults = adults;
        }

        public Integer getChildren() {
            return children;
        }

        public void setChildren(Integer children) {
            this.children = children;
        }

        public List<Integer> getChildrenAges() {
            return childrenAges;
        }

        public void setChildrenAges(List<Integer> childrenAges) {
            this.childrenAges = childrenAges;
        }

        public RateDetail getRate() {
            return rate;
        }

        public void setRate(RateDetail rate) {
            this.rate = rate;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public CancellationPolicyDetail getCancellationPolicies() {
            return cancellationPolicies;
        }

        public void setCancellationPolicies(CancellationPolicyDetail cancellationPolicies) {
            this.cancellationPolicies = cancellationPolicies;
        }


        public Integer getOccupancy_number() {
            return occupancy_number;
        }

        public void setOccupancy_number(Integer occupancy_number) {
            this.occupancy_number = occupancy_number;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public Integer getChildren_count() {
            return children_count;
        }

        public void setChildren_count(Integer children_count) {
            this.children_count = children_count;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public List<GuestContact> getGuests() {
            return guests;
        }

        public void setGuests(List<GuestContact> guests) {
            this.guests = guests;
        }
        
        public static class RoomType {
            @JsonProperty("roomTypeId")
            private String roomTypeId;
            
            private String name;
            
            public String getRoomTypeId() {
                return roomTypeId;
            }
            
            public void setRoomTypeId(String roomTypeId) {
                this.roomTypeId = roomTypeId;
            }
            
            public String getName() {
                return name;
            }
            
            public void setName(String name) {
                this.name = name;
            }
        }
        
        public static class RateDetail {
            private String rateId;
            private BookRetailRateDetail retailRate;
            private CancellationPolicyDetail cancellationPolicies;
            private Integer maxOccupancy;
            private String boardType;
            private String boardName;
            private String remarks;
            private List<String> perks;

            public String getRateId() {
                return rateId;
            }

            public void setRateId(String rateId) {
                this.rateId = rateId;
            }

            public BookRetailRateDetail getRetailRate() {
                return retailRate;
            }

            public void setRetailRate(BookRetailRateDetail retailRate) {
                this.retailRate = retailRate;
            }

            public CancellationPolicyDetail getCancellationPolicies() {
                return cancellationPolicies;
            }

            public void setCancellationPolicies(CancellationPolicyDetail cancellationPolicies) {
                this.cancellationPolicies = cancellationPolicies;
            }

            public Integer getMaxOccupancy() {
                return maxOccupancy;
            }

            public void setMaxOccupancy(Integer maxOccupancy) {
                this.maxOccupancy = maxOccupancy;
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

            public List<String> getPerks() {
                return perks;
            }

            public void setPerks(List<String> perks) {
                this.perks = perks;
            }
        }
        
        // RetailRateDetail for BookResponse - uses single Price objects instead of lists
        public static class BookRetailRateDetail {
            private com.travelhub.connectors.nuitee.dto.common.Price total;
            private com.travelhub.connectors.nuitee.dto.common.Price suggestedSellingPrice;
            private List<TaxAndFee> taxesAndFees;

            public com.travelhub.connectors.nuitee.dto.common.Price getTotal() {
                return total;
            }

            public void setTotal(com.travelhub.connectors.nuitee.dto.common.Price total) {
                this.total = total;
            }

            public com.travelhub.connectors.nuitee.dto.common.Price getSuggestedSellingPrice() {
                return suggestedSellingPrice;
            }

            public void setSuggestedSellingPrice(com.travelhub.connectors.nuitee.dto.common.Price suggestedSellingPrice) {
                this.suggestedSellingPrice = suggestedSellingPrice;
            }

            public List<TaxAndFee> getTaxesAndFees() {
                return taxesAndFees;
            }

            public void setTaxesAndFees(List<TaxAndFee> taxesAndFees) {
                this.taxesAndFees = taxesAndFees;
            }
        }
    }

    public static class GuestContact {
        private String firstName;
        private String lastName;
        private String email;
        private String phone;

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }
}
