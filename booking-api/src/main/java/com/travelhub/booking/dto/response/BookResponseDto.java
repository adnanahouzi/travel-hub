package com.travelhub.booking.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class BookResponseDto {

    private BookDataDto data;
    private Integer guestLevel;
    private Boolean sandbox;

    public BookDataDto getData() {
        return data;
    }

    public void setData(BookDataDto data) {
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

    public static class BookDataDto {
        private String bookingId;
        private String hotelConfirmationCode;
        private String reference;
        private String status;
        private BigDecimal price;
        private String currency;
        private String checkin;
        private String checkout;
        private String hotelId;
        private String hotelName;
        private List<RoomBookedDto> rooms;
        private GuestContactDto guest;

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
    }

    public static class RoomBookedDto {
        private String roomId;
        private String roomName;
        private String boardName;

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
