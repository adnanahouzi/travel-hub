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
        private String clientReference;
        private String hotelConfirmationCode;
        private String reference;
        private String status;
        private BigDecimal price;
        private String currency;
        private String checkin;
        private String checkout;
        private String hotelId;
        private String hotelName;
        private HotelInfoDto hotel;
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
