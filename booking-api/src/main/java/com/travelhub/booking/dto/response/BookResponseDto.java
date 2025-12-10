package com.travelhub.booking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BookResponseDto {

    private BookDataDto data;


    public BookDataDto getData() {
        return data;
    }

    public void setData(BookDataDto data) {
        this.data = data;
    }



    public static class BookDataDto {
        private String bookingId;
        private String clientReference;
        private String supplierBookingId;
        private String supplierBookingName;
        private String supplier;
        private Integer supplierId;
        private String hotelConfirmationCode;
        private String reference;
        private String status;
        private HotelInfoDto hotel;
        private BigDecimal price;
        private String currency;
        private String checkin;
        private String checkout;
        private String hotelId;
        private String hotelName;
        private List<RoomBookedDto> rooms;
        private GuestContactDto guest;
        private GuestContactDto holder;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private CancellationPolicyDetailDto cancellationPolicies;
        private String specialRemarks;
        private String optionalFees;
        private String mandatoryFees;
        private String knowBeforeYouGo;
        private BigDecimal commission;
        private BigDecimal addonsTotalAmount;
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

        private String paymentStatus;

        private String sellingPrice;
        private BigDecimal exchangeRate;
        private BigDecimal exchangeRateUsd;
        private String email;
        private String tag;
        private String lastFreeCancellationDate;


        private String nationality;
        private String holderTitle;
        private LocalDateTime cancelledAt;
        private LocalDateTime refundedAt;
        private Integer loyaltyGuestId;

        private BigDecimal clientCommission;
        private String voucherId;
        private String voucherTransationId;
        private BigDecimal processingFee;
        private BigDecimal amountRefunded;
        private String refundType;
        private LocalDateTime paymentScheduledAt;
        private Object addonsRedemptions;
        private String rebookFrom;

        private String cancelledBy;
        private Object feed;

        private String hotelRemarks;

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

        public String getClientReference() {
            return clientReference;
        }

        public void setClientReference(String clientReference) {
            this.clientReference = clientReference;
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

        public List<RoomBookedDto> getRooms() {
            return rooms;
        }

        public void setRooms(List<RoomBookedDto> rooms) {
            this.rooms = rooms;
        }

        public GuestContactDto getGuest() {
            return guest;
        }

        public void setGuest(GuestContactDto guest) {
            this.guest = guest;
        }

        public HotelInfoDto getHotel() {
            return hotel;
        }

        public void setHotel(HotelInfoDto hotel) {
            this.hotel = hotel;
        }

        public GuestContactDto getHolder() {
            return holder;
        }

        public void setHolder(GuestContactDto holder) {
            this.holder = holder;
        }

        // Getters and Setters for new fields
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

        public CancellationPolicyDetailDto getCancellationPolicies() {
            return cancellationPolicies;
        }

        public void setCancellationPolicies(CancellationPolicyDetailDto cancellationPolicies) {
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


        public String getPaymentStatus() {
            return paymentStatus;
        }

        public void setPaymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
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





        public String getHotelRemarks() {
            return hotelRemarks;
        }

        public void setHotelRemarks(String hotelRemarks) {
            this.hotelRemarks = hotelRemarks;
        }
    }

    public static class HotelInfoDto {
        private String hotelId;
        private String name;
        private String mainPhoto;
        private String thumbnail;
        private String address;
        private String city;
        private String country;
        private String zip;
        private Integer starRating;
        private BigDecimal rating;
        private Integer reviewCount;
        private LocationDto location;
        private CheckinCheckoutTimesDto checkinCheckoutTimes;
        private String phone;
        private String email;
        private List<HotelImageDto> images;

        public String getHotelId() {
            return hotelId;
        }

        public void setHotelId(String hotelId) {
            this.hotelId = hotelId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getMainPhoto() {
            return mainPhoto;
        }

        public void setMainPhoto(String mainPhoto) {
            this.mainPhoto = mainPhoto;
        }

        public String getThumbnail() {
            return thumbnail;
        }

        public void setThumbnail(String thumbnail) {
            this.thumbnail = thumbnail;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getZip() {
            return zip;
        }

        public void setZip(String zip) {
            this.zip = zip;
        }

        public Integer getStarRating() {
            return starRating;
        }

        public void setStarRating(Integer starRating) {
            this.starRating = starRating;
        }

        public BigDecimal getRating() {
            return rating;
        }

        public void setRating(BigDecimal rating) {
            this.rating = rating;
        }

        public Integer getReviewCount() {
            return reviewCount;
        }

        public void setReviewCount(Integer reviewCount) {
            this.reviewCount = reviewCount;
        }

        public LocationDto getLocation() {
            return location;
        }

        public void setLocation(LocationDto location) {
            this.location = location;
        }

        public CheckinCheckoutTimesDto getCheckinCheckoutTimes() {
            return checkinCheckoutTimes;
        }

        public void setCheckinCheckoutTimes(CheckinCheckoutTimesDto checkinCheckoutTimes) {
            this.checkinCheckoutTimes = checkinCheckoutTimes;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public List<HotelImageDto> getImages() {
            return images;
        }

        public void setImages(List<HotelImageDto> images) {
            this.images = images;
        }
    }

    public static class RoomBookedDto {
        private String roomId;
        private String roomName;
        private String boardName;
        private RoomTypeDto roomType;
        private String boardType;
        private String boardCode;
        private Integer adults;
        private Integer children;
        private List<Integer> childrenAges;
        private RateDetailDto rate;
        private String firstName;
        private String lastName;
        private CancellationPolicyDetailDto cancellationPolicies;
        private String room_id;
        private Integer occupancy_number;
        private BigDecimal amount;
        private String currency;
        private Integer children_count;
        private String remarks;
        private List<GuestContactDto> guests;

        public String getRoomId() {
            return roomId;
        }

        public void setRoomId(String roomId) {
            this.roomId = roomId;
        }

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

        public RoomTypeDto getRoomType() {
            return roomType;
        }

        public void setRoomType(RoomTypeDto roomType) {
            this.roomType = roomType;
        }

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

        public RateDetailDto getRate() {
            return rate;
        }

        public void setRate(RateDetailDto rate) {
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

        public CancellationPolicyDetailDto getCancellationPolicies() {
            return cancellationPolicies;
        }

        public void setCancellationPolicies(CancellationPolicyDetailDto cancellationPolicies) {
            this.cancellationPolicies = cancellationPolicies;
        }

        public String getRoom_id() {
            return room_id;
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

        public List<GuestContactDto> getGuests() {
            return guests;
        }

        public void setGuests(List<GuestContactDto> guests) {
            this.guests = guests;
        }
        
        public static class RoomTypeDto {
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
        
        public static class RateDetailDto {
            private String rateId;
            private RetailRateDetailDto retailRate;
            private CancellationPolicyDetailDto cancellationPolicies;
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
    }

    public static class GuestContactDto {
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
