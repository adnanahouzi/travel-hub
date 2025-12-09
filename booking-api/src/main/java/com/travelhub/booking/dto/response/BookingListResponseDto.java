package com.travelhub.booking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BookingListResponseDto {

    private List<BookingDataDto> data;

    public List<BookingDataDto> getData() {
        return data;
    }

    public void setData(List<BookingDataDto> data) {
        this.data = data;
    }

    public static class BookingDataDto {
        private String bookingId;
        private String clientReference;
        private String status;
        private String checkin;
        private String checkout;
        private HotelInfoDto hotel;
        private BigDecimal price;
        private String currency;
        private List<RoomInfoDto> rooms;

        // Additional fields from Booking entity
        private String holderFirstName;
        private String holderLastName;
        private String holderEmail;
        private String holderPhone;
        private String simulationId;
        private String bankingAccount;
        private String confirmationCode;
        private String hotelConfirmationCode;
        private String reference;
        private String hotelId;
        private String hotelName;
        private Integer guestLevel;
        private Boolean sandbox;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public String getBookingId() {
            return bookingId;
        }

        public void setBookingId(String bookingId) {
            this.bookingId = bookingId;
        }

        public String getClientReference() {
            return clientReference;
        }

        public void setClientReference(String clientReference) {
            this.clientReference = clientReference;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
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

        public HotelInfoDto getHotel() {
            return hotel;
        }

        public void setHotel(HotelInfoDto hotel) {
            this.hotel = hotel;
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

        public List<RoomInfoDto> getRooms() {
            return rooms;
        }

        public void setRooms(List<RoomInfoDto> rooms) {
            this.rooms = rooms;
        }

        // Getters and Setters for Booking entity fields
        public String getHolderFirstName() {
            return holderFirstName;
        }

        public void setHolderFirstName(String holderFirstName) {
            this.holderFirstName = holderFirstName;
        }

        public String getHolderLastName() {
            return holderLastName;
        }

        public void setHolderLastName(String holderLastName) {
            this.holderLastName = holderLastName;
        }

        public String getHolderEmail() {
            return holderEmail;
        }

        public void setHolderEmail(String holderEmail) {
            this.holderEmail = holderEmail;
        }

        public String getHolderPhone() {
            return holderPhone;
        }

        public void setHolderPhone(String holderPhone) {
            this.holderPhone = holderPhone;
        }

        public String getSimulationId() {
            return simulationId;
        }

        public void setSimulationId(String simulationId) {
            this.simulationId = simulationId;
        }

        public String getBankingAccount() {
            return bankingAccount;
        }

        public void setBankingAccount(String bankingAccount) {
            this.bankingAccount = bankingAccount;
        }

        public String getConfirmationCode() {
            return confirmationCode;
        }

        public void setConfirmationCode(String confirmationCode) {
            this.confirmationCode = confirmationCode;
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
    }

    public static class HotelInfoDto {
        private String hotelId;
        private String name;
        private String mainPhoto;
        private String thumbnail;

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
    }

    public static class RoomInfoDto {
        private String roomId;
        private Integer adults;
        private BigDecimal amount;
        private String currency;

        public String getRoomId() {
            return roomId;
        }

        public void setRoomId(String roomId) {
            this.roomId = roomId;
        }

        public Integer getAdults() {
            return adults;
        }

        public void setAdults(Integer adults) {
            this.adults = adults;
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
    }
}
