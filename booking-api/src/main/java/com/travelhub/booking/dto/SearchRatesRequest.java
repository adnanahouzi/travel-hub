package com.travelhub.booking.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class SearchRatesRequest {
    private List<String> hotelIds;
    private LocalDate checkin;
    private LocalDate checkout;
    private List<SearchOccupancy> occupancies;
    private String currency;
    private String guestNationality;
    private String countryCode;
    private String cityName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer radius;
    
    public List<String> getHotelIds() { return hotelIds; }
    public void setHotelIds(List<String> hotelIds) { this.hotelIds = hotelIds; }
    
    public LocalDate getCheckin() { return checkin; }
    public void setCheckin(LocalDate checkin) { this.checkin = checkin; }
    
    public LocalDate getCheckout() { return checkout; }
    public void setCheckout(LocalDate checkout) { this.checkout = checkout; }
    
    public List<SearchOccupancy> getOccupancies() { return occupancies; }
    public void setOccupancies(List<SearchOccupancy> occupancies) { this.occupancies = occupancies; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public String getGuestNationality() { return guestNationality; }
    public void setGuestNationality(String guestNationality) { this.guestNationality = guestNationality; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Integer getRadius() { return radius; }
    public void setRadius(Integer radius) { this.radius = radius; }

    public static class SearchOccupancy {
        private Integer adults;
        private Integer children;
        private List<Integer> childrenAges;

        public Integer getAdults() { return adults; }
        public void setAdults(Integer adults) { this.adults = adults; }

        public Integer getChildren() { return children; }
        public void setChildren(Integer children) { this.children = children; }

        public List<Integer> getChildrenAges() { return childrenAges; }
        public void setChildrenAges(List<Integer> childrenAges) { this.childrenAges = childrenAges; }
    }
}

