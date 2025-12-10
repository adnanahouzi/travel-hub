package com.travelhub.booking.mapper;

import com.travelhub.booking.dto.response.*;
import com.travelhub.connectors.nuitee.dto.response.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class HotelDataMapper {

    // Place mapping methods
    public PlaceSearchResponseDto toPlaceSearchResponseDto(PlaceResponse placeResponse) {
        if (placeResponse == null || placeResponse.getData() == null) {
            return new PlaceSearchResponseDto();
        }
        List<PlaceDto> places = placeResponse.getData().stream()
                .map(this::toPlaceDto)
                .collect(Collectors.toList());
        return new PlaceSearchResponseDto(places);
    }

    public PlaceDto toPlaceDto(Place place) {
        if (place == null) {
            return null;
        }
        PlaceDto placeDto = new PlaceDto();
        placeDto.setPlaceId(place.getPlaceId());
        placeDto.setDisplayName(place.getDisplayName());
        placeDto.setTypes(place.getTypes());
        return placeDto;
    }

    public PlaceDetailsDto toPlaceDetailsDto(PlaceDetailsResponse response) {
        if (response == null || response.getData() == null) {
            return null;
        }
        PlaceDetails data = response.getData();
        PlaceDetailsDto placeDetails = new PlaceDetailsDto();
        placeDetails.setPlaceId(data.getPlaceId());
        placeDetails.setDescription(data.getDescription());
        placeDetails.setCity(data.getCity());
        placeDetails.setLocation(toLocationDto(data.getLocation()));
        return placeDetails;
    }

    // Hotel rate response mapping
    public HotelRateResponseDto toHotelRateResponseDto(HotelData hotelData,
            List<RoomType> roomTypes, RateMapper rateMapper, String checkin, String checkout) {
        if (hotelData == null) {
            return null;
        }

        HotelRateResponseDto response = mapHotelData(hotelData);

        // Calculate number of nights
        Integer numberOfNights = rateMapper.calculateNumberOfNights(checkin, checkout);

        // Group rates by offerId with room breakdown, then by configuration
        List<GroupedRateDto> offers = rateMapper.groupByOffer(roomTypes, hotelData.getRooms(), numberOfNights);

        response.setGroupedRates(rateMapper.groupRatesByConfiguration(offers));

        return response;
    }
    
    /**
     * Overloaded method for backward compatibility
     */
    public HotelRateResponseDto toHotelRateResponseDto(HotelData hotelData,
            List<RoomType> roomTypes, RateMapper rateMapper) {
        return toHotelRateResponseDto(hotelData, roomTypes, rateMapper, null, null);
    }

    private HotelRateResponseDto mapHotelData(HotelData hotelData) {
        HotelRateResponseDto response = new HotelRateResponseDto();
        response.setHotelId(hotelData.getId());
        response.setName(hotelData.getName());
        response.setDescription(hotelData.getHotelDescription());
        response.setImportantInformation(hotelData.getHotelImportantInformation());
        response.setStarRating(hotelData.getStarRating());
        response.setRating(hotelData.getRating());
        response.setReviewCount(hotelData.getReviewCount());
        response.setAddress(hotelData.getAddress());
        response.setCity(hotelData.getCity());
        response.setCountry(hotelData.getCountry());
        response.setZip(hotelData.getZip());
        response.setLocation(toLocationDto(hotelData.getLocation()));
        response.setMainPhoto(hotelData.getMainPhoto());
        response.setThumbnail(hotelData.getThumbnail());
        response.setImages(toHotelImageDtos(hotelData.getHotelImages()));
        response.setFacilities(hotelData.getHotelFacilities());
        response.setPhone(hotelData.getPhone());
        response.setEmail(hotelData.getEmail());
        response.setCheckinCheckoutTimes(toCheckinCheckoutTimesDto(hotelData.getCheckinCheckoutTimes()));

        // Map sentiment analysis from HotelData
        if (hotelData.getSentimentAnalysis() != null) {
            SentimentAnalysisDto sentimentDto = toSentimentAnalysisDto(hotelData.getSentimentAnalysis());
            response.setSentimentAnalysis(sentimentDto);
        }
        return response;
    }

    public LocationDto toLocationDto(Location location) {
        if (location == null) {
            return null;
        }
        LocationDto locationDto = new LocationDto();
        locationDto.setLatitude(location.getLatitude());
        locationDto.setLongitude(location.getLongitude());
        return locationDto;
    }

    public LocationDto toLocationDto(BigDecimal longitude, BigDecimal latitude) {
        if (longitude == null) {
            return null;
        }
        LocationDto locationDto = new LocationDto();
        locationDto.setLatitude(latitude);
        locationDto.setLongitude(longitude);
        return locationDto;
    }

    private List<HotelImageDto> toHotelImageDtos(List<HotelImage> images) {
        if (images == null) {
            return null;
        }
        return images.stream()
                .map(this::toHotelImageDto)
                .collect(Collectors.toList());
    }

    private HotelImageDto toHotelImageDto(HotelImage image) {
        if (image == null) {
            return null;
        }
        HotelImageDto hotelImage = new HotelImageDto();
        hotelImage.setUrl(image.getUrl());
        hotelImage.setCaption(image.getCaption());
        hotelImage.setDefaultImage(image.getDefaultImage());
        return hotelImage;
    }

    private CheckinCheckoutTimesDto toCheckinCheckoutTimesDto(CheckinCheckoutTimes times) {
        if (times == null) {
            return null;
        }
        CheckinCheckoutTimesDto checkinCheckoutTimes = new CheckinCheckoutTimesDto();
        checkinCheckoutTimes.setCheckinFrom(times.getCheckin());
        checkinCheckoutTimes.setCheckout(times.getCheckout());
        return checkinCheckoutTimes;
    }

    // Review mapping methods
    public HotelReviewsResponseDto toHotelReviewsResponseDto(HotelReviewsResponse response) {
        if (response == null) {
            return null;
        }
        HotelReviewsResponseDto hotelReviewsResponse = new HotelReviewsResponseDto();
        hotelReviewsResponse.setTotal(response.getTotal());
        hotelReviewsResponse.setData(toReviewDtos(response.getData()));
        hotelReviewsResponse.setSentimentAnalysis(toSentimentAnalysisDto(response.getSentimentAnalysis()));
        return hotelReviewsResponse;
    }

    private List<ReviewDto> toReviewDtos(List<Review> reviews) {
        if (reviews == null) {
            return null;
        }
        return reviews.stream()
                .map(this::toReviewDto)
                .collect(Collectors.toList());
    }

    private ReviewDto toReviewDto(Review review) {
        if (review == null) {
            return null;
        }
        ReviewDto reviewDto = new ReviewDto();
        reviewDto.setAverageScore(review.getAverageScore());
        reviewDto.setCountry(review.getCountry());
        reviewDto.setType(review.getType());
        reviewDto.setName(review.getName());
        reviewDto.setDate(review.getDate());
        reviewDto.setHeadline(review.getHeadline());
        reviewDto.setLanguage(review.getLanguage());
        reviewDto.setPros(review.getPros());
        reviewDto.setCons(review.getCons());
        reviewDto.setSource(review.getSource());
        return reviewDto;
    }

    private SentimentAnalysisDto toSentimentAnalysisDto(SentimentAnalysis analysis) {
        if (analysis == null) {
            return null;
        }
        SentimentAnalysisDto sentimentAnalysis = new SentimentAnalysisDto();
        sentimentAnalysis.setCons(analysis.getCons());
        sentimentAnalysis.setPros(analysis.getPros());
        sentimentAnalysis.setCategories(toSentimentCategoryDtos(analysis.getCategories()));
        return sentimentAnalysis;
    }

    private List<SentimentCategoryDto> toSentimentCategoryDtos(List<SentimentCategory> categories) {
        if (categories == null) {
            return null;
        }
        return categories.stream()
                .map(this::toSentimentCategoryDto)
                .collect(Collectors.toList());
    }

    private SentimentCategoryDto toSentimentCategoryDto(SentimentCategory category) {
        if (category == null) {
            return null;
        }
        SentimentCategoryDto sentimentCategory = new SentimentCategoryDto();
        sentimentCategory.setName(category.getName());
        sentimentCategory.setRating(category.getRating());
        sentimentCategory.setDescription(category.getDescription());
        return sentimentCategory;
    }

    public BookResponseDto.HotelInfoDto toHotelInfoDto(HotelData hotelData) {
        if (hotelData == null) {
            return null;
        }

        BookResponseDto.HotelInfoDto hotelInfo = new BookResponseDto.HotelInfoDto();
        hotelInfo.setHotelId(hotelData.getId());
        hotelInfo.setName(hotelData.getName());
        hotelInfo.setMainPhoto(hotelData.getMainPhoto());
        hotelInfo.setThumbnail(hotelData.getThumbnail());
        hotelInfo.setAddress(hotelData.getAddress());
        hotelInfo.setCity(hotelData.getCity());
        hotelInfo.setCountry(hotelData.getCountry());
        hotelInfo.setZip(hotelData.getZip());
        hotelInfo.setStarRating(hotelData.getStarRating());
        hotelInfo.setRating(hotelData.getRating());
        hotelInfo.setReviewCount(hotelData.getReviewCount());
        hotelInfo.setLocation(toLocationDto(hotelData.getLocation()));
        hotelInfo.setCheckinCheckoutTimes(toCheckinCheckoutTimesDto(hotelData.getCheckinCheckoutTimes()));
        hotelInfo.setPhone(hotelData.getPhone());
        hotelInfo.setEmail(hotelData.getEmail());
        hotelInfo.setImages(toHotelImageDtos(hotelData.getHotelImages()));
        return hotelInfo;
    }

    public BookResponseDto.HotelInfoDto toHotelInfoDto(BookingHotelInfo source) {
        if (source == null) {
            return null;
        }
        BookResponseDto.HotelInfoDto hotelInfo = new BookResponseDto.HotelInfoDto();
        hotelInfo.setHotelId(source.getHotelId());
        hotelInfo.setName(source.getName());
        return hotelInfo;
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param lat1 Latitude of first point
     * @param lon1 Longitude of first point
     * @param lat2 Latitude of second point
     * @param lon2 Longitude of second point
     * @return Distance in kilometers
     */
    public BigDecimal calculateDistance(BigDecimal lat1, BigDecimal lon1, BigDecimal lat2, BigDecimal lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return null;
        }
        
        final int EARTH_RADIUS_KM = 6371;
        
        double lat1Rad = Math.toRadians(lat1.doubleValue());
        double lat2Rad = Math.toRadians(lat2.doubleValue());
        double deltaLat = Math.toRadians(lat2.doubleValue() - lat1.doubleValue());
        double deltaLon = Math.toRadians(lon2.doubleValue() - lon1.doubleValue());
        
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                   Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                   Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        double distance = EARTH_RADIUS_KM * c;
        
        return BigDecimal.valueOf(distance).setScale(2, java.math.RoundingMode.HALF_UP);
    }
}

