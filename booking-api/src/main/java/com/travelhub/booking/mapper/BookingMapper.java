package com.travelhub.booking.mapper;

import com.travelhub.booking.dto.request.RateSearchRequestDto;
import com.travelhub.booking.dto.response.*;
import com.travelhub.booking.dto.response.BookResponseDto;
import com.travelhub.connectors.nuitee.dto.common.Price;
import com.travelhub.connectors.nuitee.dto.request.HotelRatesRequest;
import com.travelhub.connectors.nuitee.dto.request.BookRequest;
import com.travelhub.booking.dto.request.BookingInitiationRequestDto;
import com.travelhub.connectors.nuitee.dto.response.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BookingMapper {

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
        placeDto.setFormattedAddress(place.getFormattedAddress());
        placeDto.setTypes(place.getTypes());
        return placeDto;
    }

    public PlaceDetailsDto toPlaceDetailsDto(
            com.travelhub.connectors.nuitee.dto.response.PlaceDetailsResponse response) {
        if (response == null || response.getData() == null) {
            return null;
        }
        com.travelhub.connectors.nuitee.dto.response.PlaceDetails data = response.getData();
        PlaceDetailsDto dto = new PlaceDetailsDto();
        dto.setPlaceId(data.getPlaceId());
        dto.setDescription(data.getDescription());
        dto.setCity(data.getCity());
        dto.setLocation(toLocationDto(data.getLocation()));
        return dto;
    }

    // Hotel rate mapping methods
    public HotelRateResponseDto toHotelRateResponseDto(HotelData hotelData,
            List<com.travelhub.connectors.nuitee.dto.response.RoomType> roomTypes) {
        if (hotelData == null) {
            return null;
        }

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

        // Map rates and enrich with room details from hotel data
        response.setRates(enrichRatesWithRoomDetails(roomTypes, hotelData.getRooms()));

        return response;
    }

    private LocationDto toLocationDto(Location location) {
        if (location == null) {
            return null;
        }
        LocationDto dto = new LocationDto();
        dto.setLatitude(location.getLatitude());
        dto.setLongitude(location.getLongitude());
        return dto;
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
        HotelImageDto dto = new HotelImageDto();
        dto.setUrl(image.getUrl());
        dto.setCaption(image.getCaption());
        dto.setDefaultImage(image.getDefaultImage());
        return dto;
    }

    private CheckinCheckoutTimesDto toCheckinCheckoutTimesDto(CheckinCheckoutTimes times) {
        if (times == null) {
            return null;
        }
        CheckinCheckoutTimesDto dto = new CheckinCheckoutTimesDto();
        dto.setCheckinFrom(times.getCheckin());
        dto.setCheckout(times.getCheckout());
        return dto;
    }

    private List<RateDto> enrichRatesWithRoomDetails(
            List<com.travelhub.connectors.nuitee.dto.response.RoomType> roomTypes, List<Room> hotelRooms) {
        if (roomTypes == null) {
            return null;
        }

        // For each RoomType, we need to map its rates and enrich with room details
        return roomTypes.stream()
                .flatMap(roomType -> {
                    if (roomType.getRates() == null) {
                        return java.util.stream.Stream.empty();
                    }
                    return roomType.getRates().stream().map(rate -> {
                        RateDto rateDto = toRateDto(rate);
                        if (rateDto != null) {
                            // Set offerId from the parent RoomType
                            rateDto.setOfferId(roomType.getOfferId());

                            // Enrich with room details from hotel data
                            if (hotelRooms != null && rate.getMappedRoomId() != null) {
                                Long mappedRoomId = rate.getMappedRoomId();
                                Room matchingRoom = hotelRooms.stream()
                                        .filter(room -> mappedRoomId.equals(room.getId().longValue()))
                                        .findFirst()
                                        .orElse(null);
                                if (matchingRoom != null) {
                                    enrichRateWithRoomDetails(rateDto, matchingRoom);
                                }
                            }
                        }
                        return rateDto;
                    });
                })
                .collect(Collectors.toList());
    }

    private void enrichRateWithRoomDetails(RateDto rateDto, Room room) {
        if (rateDto == null || room == null) {
            return;
        }
        // Add detailed room information from hotel details to the rate
        rateDto.setRoomDescription(room.getDescription());
        rateDto.setRoomSize(room.getRoomSizeSquare());
        rateDto.setRoomSizeUnit(room.getRoomSizeUnit());
        rateDto.setMaxAdults(room.getMaxAdults());
        rateDto.setMaxChildren(room.getMaxChildren());
        rateDto.setMaxOccupancy(room.getMaxOccupancy());
        rateDto.setRoomPhotos(mapRoomPhotos(room.getPhotos()));
    }

    private List<RoomPhotoDto> mapRoomPhotos(List<com.travelhub.connectors.nuitee.dto.response.RoomPhoto> photos) {
        if (photos == null) {
            return null;
        }
        return photos.stream()
                .map(this::mapRoomPhoto)
                .collect(Collectors.toList());
    }

    private RoomPhotoDto mapRoomPhoto(com.travelhub.connectors.nuitee.dto.response.RoomPhoto photo) {
        if (photo == null) {
            return null;
        }
        RoomPhotoDto dto = new RoomPhotoDto();
        dto.setUrl(photo.getUrl());
        dto.setHdUrl(photo.getHdUrl());
        dto.setImageDescription(photo.getImageDescription());
        dto.setMainPhoto(photo.getMainPhoto());
        return dto;
    }

    public HotelRatesRequest toHotelRatesRequest(RateSearchRequestDto request) {
        if (request == null) {
            return null;
        }
        HotelRatesRequest hotelRatesRequest = new HotelRatesRequest();
        hotelRatesRequest.setOccupancies(request.getOccupancies());
        hotelRatesRequest.setCurrency(request.getCurrency());
        hotelRatesRequest.setGuestNationality(request.getGuestNationality());
        hotelRatesRequest.setCheckin(request.getCheckin());
        hotelRatesRequest.setCheckout(request.getCheckout());
        hotelRatesRequest.setHotelIds(request.getHotelIds());
        hotelRatesRequest.setCountryCode(request.getCountryCode());
        hotelRatesRequest.setCityName(request.getCityName());
        hotelRatesRequest.setLatitude(request.getLatitude());
        hotelRatesRequest.setLongitude(request.getLongitude());
        hotelRatesRequest.setRadius(request.getRadius());
        hotelRatesRequest.setIataCode(request.getIataCode());
        hotelRatesRequest.setPlaceId(request.getPlaceId());
        hotelRatesRequest.setAiSearch(request.getAiSearch());
        hotelRatesRequest.setTimeout(request.getTimeout());
        hotelRatesRequest.setRoomMapping(request.getRoomMapping());
        hotelRatesRequest.setLimit(request.getLimit());
        hotelRatesRequest.setOffset(request.getOffset());
        hotelRatesRequest.setWeatherInfo(request.getWeatherInfo());
        hotelRatesRequest.setStream(request.getStream());
        hotelRatesRequest.setHotelName(request.getHotelName());
        hotelRatesRequest.setMinReviewsCount(request.getMinReviewsCount());
        hotelRatesRequest.setMinRating(request.getMinRating());
        hotelRatesRequest.setZip(request.getZip());
        hotelRatesRequest.setStarRating(request.getStarRating());
        hotelRatesRequest.setFacilities(request.getFacilities());
        hotelRatesRequest.setStrictFacilityFiltering(request.getStrictFacilityFiltering());
        hotelRatesRequest.setSort(mapSortCriteria(request.getSort()));
        return hotelRatesRequest;
    }

    private List<com.travelhub.connectors.nuitee.dto.common.SortCriteria> mapSortCriteria(
            List<com.travelhub.booking.dto.common.SortCriteriaDto> sortDtos) {
        if (sortDtos == null) {
            return null;
        }
        return sortDtos.stream()
                .map(dto -> new com.travelhub.connectors.nuitee.dto.common.SortCriteria(dto.getField(),
                        dto.getDirection()))
                .collect(Collectors.toList());
    }

    public RateSearchResponseDto toRateSearchResponseDto(HotelRatesResponse response) {
        if (response == null) {
            return null;
        }
        RateSearchResponseDto rateSearchResponse = new RateSearchResponseDto();
        rateSearchResponse.setHotels(mergeHotelData(response.getData(), response.getHotels()));
        rateSearchResponse.setGuestLevel(response.getGuestLevel());
        rateSearchResponse.setSandbox(response.getSandbox());
        rateSearchResponse.setSessionId(response.getSessionId());
        return rateSearchResponse;
    }

    private List<HotelAvailabilityDto> mergeHotelData(List<HotelRate> hotelRates, List<HotelInfo> hotelInfos) {
        if (hotelRates == null) {
            return null;
        }

        // Create a map of hotel info by hotel id for quick lookup
        java.util.Map<String, HotelInfo> hotelInfoMap = new java.util.HashMap<>();
        if (hotelInfos != null) {
            for (HotelInfo info : hotelInfos) {
                hotelInfoMap.put(info.getId(), info);
            }
        }

        return hotelRates.stream()
                .map(rate -> mergeHotelAvailability(rate, hotelInfoMap.get(rate.getHotelId())))
                .collect(Collectors.toList());
    }

    private HotelAvailabilityDto mergeHotelAvailability(HotelRate hotelRate, HotelInfo hotelInfo) {
        if (hotelRate == null) {
            return null;
        }

        HotelAvailabilityDto dto = new HotelAvailabilityDto();

        // Set data from HotelRate
        dto.setHotelId(hotelRate.getHotelId());
        dto.setRoomTypes(mapRoomTypes(hotelRate.getRoomTypes()));
        dto.setEt(hotelRate.getEt());

        // Set data from HotelInfo if available
        if (hotelInfo != null) {
            dto.setName(hotelInfo.getName());
            dto.setMainPhoto(hotelInfo.getMainPhoto());
            dto.setAddress(hotelInfo.getAddress());
            dto.setRating(hotelInfo.getRating());
            dto.setLocation(toLocationDto(hotelInfo.getLocation()));
        }

        return dto;
    }

    private List<RoomTypeDto> mapRoomTypes(List<RoomType> roomTypes) {
        if (roomTypes == null) {
            return null;
        }
        return roomTypes.stream()
                .map(this::mapRoomType)
                .collect(Collectors.toList());
    }

    private RoomTypeDto mapRoomType(RoomType roomType) {
        if (roomType == null) {
            return null;
        }
        RoomTypeDto dto = new RoomTypeDto();
        dto.setRoomTypeId(roomType.getRoomTypeId());
        dto.setOfferId(roomType.getOfferId());
        dto.setSupplier(roomType.getSupplier());
        dto.setSupplierId(roomType.getSupplierId());
        dto.setRates(mapRates(roomType.getRates(), roomType.getOfferId()));
        dto.setOfferRetailRate(mapPrice(roomType.getOfferRetailRate()));
        dto.setSuggestedSellingPrice(mapPrice(roomType.getSuggestedSellingPrice()));
        dto.setOfferInitialPrice(mapPrice(roomType.getOfferInitialPrice()));
        dto.setPriceType(roomType.getPriceType());
        dto.setRateType(roomType.getRateType());
        dto.setPaymentTypes(roomType.getPaymentTypes());
        return dto;
    }

    private List<RateDto> mapRates(List<Rate> rates, String offerId) {
        if (rates == null) {
            return null;
        }
        return rates.stream()
                .map(rate -> {
                    RateDto rateDto = toRateDto(rate);
                    if (rateDto != null) {
                        rateDto.setOfferId(offerId);
                    }
                    return rateDto;
                })
                .collect(Collectors.toList());
    }

    public RateDto toRateDto(Rate rate) {
        if (rate == null) {
            return null;
        }
        RateDto dto = new RateDto();
        dto.setRateId(rate.getRateId());
        dto.setOccupancyNumber(rate.getOccupancyNumber());
        dto.setName(rate.getName());
        dto.setMaxOccupancy(rate.getMaxOccupancy());
        dto.setAdultCount(rate.getAdultCount());
        dto.setChildCount(rate.getChildCount());
        dto.setChildrenAges(rate.getChildrenAges());
        dto.setBoardType(rate.getBoardType());
        dto.setBoardName(rate.getBoardName());
        dto.setRemarks(rate.getRemarks());
        dto.setPriceType(rate.getPriceType());
        dto.setCommission(mapPrices(rate.getCommission()));
        dto.setRetailRate(mapRetailRateDetail(rate.getRetailRate()));
        dto.setCancellationPolicies(mapCancellationPolicyDetail(rate.getCancellationPolicies()));
        dto.setMappedRoomId(rate.getMappedRoomId());
        dto.setPaymentTypes(rate.getPaymentTypes());
        dto.setProviderCommission(mapPrice(rate.getProviderCommission()));
        dto.setPerks(rate.getPerks());
        return dto;
    }

    private List<PriceDto> mapPrices(List<Price> prices) {
        if (prices == null) {
            return null;
        }
        return prices.stream()
                .map(this::mapPrice)
                .collect(Collectors.toList());
    }

    private PriceDto mapPrice(Price price) {
        if (price == null) {
            return null;
        }
        PriceDto dto = new PriceDto();
        dto.setAmount(price.getAmount());
        dto.setCurrency(price.getCurrency());
        dto.setSource(price.getSource());
        return dto;
    }

    private RetailRateDetailDto mapRetailRateDetail(RetailRateDetail retailRateDetail) {
        if (retailRateDetail == null) {
            return null;
        }
        RetailRateDetailDto dto = new RetailRateDetailDto();
        dto.setTotal(mapPrices(retailRateDetail.getTotal()));
        dto.setSuggestedSellingPrice(mapPrices(retailRateDetail.getSuggestedSellingPrice()));
        dto.setInitialPrice(mapPrices(retailRateDetail.getInitialPrice()));
        dto.setTaxesAndFees(mapTaxesAndFees(retailRateDetail.getTaxesAndFees()));
        return dto;
    }

    private List<TaxAndFeeDto> mapTaxesAndFees(List<TaxAndFee> taxesAndFees) {
        if (taxesAndFees == null) {
            return null;
        }
        return taxesAndFees.stream()
                .map(this::mapTaxAndFee)
                .collect(Collectors.toList());
    }

    private TaxAndFeeDto mapTaxAndFee(TaxAndFee taxAndFee) {
        if (taxAndFee == null) {
            return null;
        }
        TaxAndFeeDto dto = new TaxAndFeeDto();
        dto.setIncluded(taxAndFee.isIncluded());
        dto.setDescription(taxAndFee.getDescription());
        dto.setAmount(taxAndFee.getAmount());
        dto.setCurrency(taxAndFee.getCurrency());
        return dto;
    }

    private CancellationPolicyDetailDto mapCancellationPolicyDetail(CancellationPolicyDetail cancellationPolicyDetail) {
        if (cancellationPolicyDetail == null) {
            return null;
        }
        CancellationPolicyDetailDto dto = new CancellationPolicyDetailDto();
        dto.setCancelPolicyInfos(mapCancellationPolicyInfos(cancellationPolicyDetail.getCancelPolicyInfos()));
        dto.setHotelRemarks(cancellationPolicyDetail.getHotelRemarks());
        dto.setRefundableTag(cancellationPolicyDetail.getRefundableTag());
        return dto;
    }

    private List<CancellationPolicyInfoDto> mapCancellationPolicyInfos(List<CancellationPolicyInfo> infos) {
        if (infos == null) {
            return null;
        }
        return infos.stream()
                .map(this::mapCancellationPolicyInfo)
                .collect(Collectors.toList());
    }

    private CancellationPolicyInfoDto mapCancellationPolicyInfo(CancellationPolicyInfo info) {
        if (info == null) {
            return null;
        }
        CancellationPolicyInfoDto dto = new CancellationPolicyInfoDto();
        dto.setCancelTime(info.getCancelTime());
        dto.setAmount(info.getAmount());
        dto.setCurrency(info.getCurrency());
        dto.setType(info.getType());
        dto.setTimezone(info.getTimezone());
        return dto;
    }

    // Review mapping methods
    public com.travelhub.booking.dto.response.HotelReviewsResponseDto toHotelReviewsResponseDto(
            com.travelhub.connectors.nuitee.dto.response.HotelReviewsResponse response) {
        if (response == null) {
            return null;
        }
        com.travelhub.booking.dto.response.HotelReviewsResponseDto dto = new com.travelhub.booking.dto.response.HotelReviewsResponseDto();
        dto.setTotal(response.getTotal());
        dto.setData(toReviewDtos(response.getData()));
        dto.setSentimentAnalysis(toSentimentAnalysisDto(response.getSentimentAnalysis()));
        return dto;
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
        ReviewDto dto = new ReviewDto();
        dto.setAverageScore(review.getAverageScore());
        dto.setCountry(review.getCountry());
        dto.setType(review.getType());
        dto.setName(review.getName());
        dto.setDate(review.getDate());
        dto.setHeadline(review.getHeadline());
        dto.setLanguage(review.getLanguage());
        dto.setPros(review.getPros());
        dto.setCons(review.getCons());
        dto.setSource(review.getSource());
        return dto;
    }

    private SentimentAnalysisDto toSentimentAnalysisDto(SentimentAnalysis analysis) {
        if (analysis == null) {
            return null;
        }
        SentimentAnalysisDto dto = new SentimentAnalysisDto();
        dto.setCons(analysis.getCons());
        dto.setPros(analysis.getPros());
        dto.setCategories(toSentimentCategoryDtos(analysis.getCategories()));
        return dto;
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
        SentimentCategoryDto dto = new SentimentCategoryDto();
        dto.setName(category.getName());
        dto.setRating(category.getRating());
        dto.setDescription(category.getDescription());
        return dto;
    }

    // Prebook mapping methods
    public com.travelhub.connectors.nuitee.dto.request.PrebookRequest toPrebookRequest(
            com.travelhub.booking.dto.request.PrebookRequestDto requestDto) {
        if (requestDto == null) {
            return null;
        }
        com.travelhub.connectors.nuitee.dto.request.PrebookRequest request = new com.travelhub.connectors.nuitee.dto.request.PrebookRequest();
        request.setOfferId(requestDto.getOfferId());
        request.setUsePaymentSdk(requestDto.getUsePaymentSdk());
        return request;
    }

    public com.travelhub.booking.dto.response.PrebookResponseDto toPrebookResponseDto(
            com.travelhub.connectors.nuitee.dto.response.PrebookResponse response) {
        if (response == null) {
            return null;
        }
        com.travelhub.booking.dto.response.PrebookResponseDto dto = new com.travelhub.booking.dto.response.PrebookResponseDto();
        dto.setData(toPrebookDataDto(response.getData()));
        dto.setGuestLevel(response.getGuestLevel());
        dto.setSandbox(response.getSandbox());
        return dto;
    }

    private com.travelhub.booking.dto.response.PrebookResponseDto.PrebookDataDto toPrebookDataDto(
            com.travelhub.connectors.nuitee.dto.response.PrebookResponse.PrebookData data) {
        if (data == null) {
            return null;
        }
        com.travelhub.booking.dto.response.PrebookResponseDto.PrebookDataDto dto = new com.travelhub.booking.dto.response.PrebookResponseDto.PrebookDataDto();
        dto.setPrebookId(data.getPrebookId());
        dto.setOfferId(data.getOfferId());
        dto.setHotelId(data.getHotelId());
        dto.setCurrency(data.getCurrency());
        dto.setTermsAndConditions(data.getTermsAndConditions());

        // Map roomTypes if present
        if (data.getRoomTypes() != null) {
            List<RoomTypeDto> roomTypeDtos = data.getRoomTypes().stream()
                    .map(this::mapRoomType)
                    .collect(Collectors.toList());
            dto.setRoomTypes(roomTypeDtos);
        }

        dto.setSuggestedSellingPrice(data.getSuggestedSellingPrice());
        dto.setIsPackageRate(data.getIsPackageRate());
        dto.setCommission(data.getCommission());
        dto.setPrice(data.getPrice());
        dto.setPriceType(data.getPriceType());
        dto.setPriceDifferencePercent(data.getPriceDifferencePercent());
        dto.setCancellationChanged(data.getCancellationChanged());
        dto.setBoardChanged(data.getBoardChanged());
        dto.setSupplier(data.getSupplier());
        dto.setSupplierId(data.getSupplierId());
        dto.setPaymentTypes(data.getPaymentTypes());
        dto.setCheckin(data.getCheckin());
        dto.setCheckout(data.getCheckout());

        // Calculate total included and excluded taxes
        BigDecimal totalIncludedTaxes = BigDecimal.ZERO;
        BigDecimal totalExcludedTaxes = BigDecimal.ZERO;

        if (data.getRoomTypes() != null) {
            for (RoomType roomType : data.getRoomTypes()) {
                if (roomType.getRates() != null) {
                    for (Rate rate : roomType.getRates()) {
                        if (rate.getRetailRate() != null && rate.getRetailRate().getTaxesAndFees() != null) {
                            for (TaxAndFee taxAndFee : rate.getRetailRate().getTaxesAndFees()) {
                                if (taxAndFee.getAmount() != null) {
                                    if (taxAndFee.isIncluded()) {
                                        totalIncludedTaxes = totalIncludedTaxes.add(taxAndFee.getAmount());
                                    } else {
                                        totalExcludedTaxes = totalExcludedTaxes.add(taxAndFee.getAmount());
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        dto.setTotalIncludedTaxes(totalIncludedTaxes);
        dto.setTotalExcludedTaxes(totalExcludedTaxes);

        return dto;
    }

    public BookRequest toBookRequest(BookingInitiationRequestDto requestDto, String prebookId) {
        if (requestDto == null) {
            return null;
        }

        BookRequest request = new BookRequest();
        request.setPrebookId(prebookId);

        // Map Holder to Guest (single guest for now)
        BookRequest.Guest guest = new BookRequest.Guest();
        guest.setFirstName(requestDto.getHolder().getFirstName());
        guest.setLastName(requestDto.getHolder().getLastName());
        guest.setEmail(requestDto.getHolder().getEmail());
        guest.setPhone(requestDto.getHolder().getPhone());
        // Default occupancy to 1 if not specified (adjust as needed)
        guest.setOccupancyNumber(1);

        request.setGuests(java.util.Collections.singletonList(guest));

        // Map Payment
        BookRequest.Payment payment = new BookRequest.Payment();
        payment.setMethod("CREDIT");
        // payment.setTransactionId(requestDto.getBankingAccount()); // Not needed for
        // CREDIT

        request.setPayment(payment);

        return request;
    }

    public BookResponseDto toBookResponseDto(com.travelhub.connectors.nuitee.dto.response.BookResponse source) {
        if (source == null) {
            return null;
        }
        BookResponseDto dto = new BookResponseDto();
        dto.setGuestLevel(source.getGuestLevel());
        dto.setSandbox(source.getSandbox());
        dto.setData(toBookDataDto(source.getData()));
        return dto;
    }

    private BookResponseDto.BookDataDto toBookDataDto(
            com.travelhub.connectors.nuitee.dto.response.BookResponse.BookData source) {
        if (source == null) {
            return null;
        }
        BookResponseDto.BookDataDto dto = new BookResponseDto.BookDataDto();
        dto.setBookingId(source.getBookingId());
        dto.setHotelConfirmationCode(source.getHotelConfirmationCode());
        dto.setReference(source.getReference());
        dto.setStatus(source.getStatus());
        dto.setPrice(source.getPrice());
        dto.setCurrency(source.getCurrency());
        dto.setCheckin(source.getCheckin());
        dto.setCheckout(source.getCheckout());
        dto.setHotelId(source.getHotelId());
        dto.setHotelName(source.getHotelName());
        dto.setRooms(toRoomBookedDtos(source.getRooms()));
        dto.setGuest(toGuestContactDto(source.getGuest()));
        return dto;
    }

    private List<BookResponseDto.RoomBookedDto> toRoomBookedDtos(
            List<com.travelhub.connectors.nuitee.dto.response.BookResponse.RoomBooked> sourceList) {
        if (sourceList == null) {
            return null;
        }
        return sourceList.stream().map(this::toRoomBookedDto).collect(Collectors.toList());
    }

    private BookResponseDto.RoomBookedDto toRoomBookedDto(
            com.travelhub.connectors.nuitee.dto.response.BookResponse.RoomBooked source) {
        if (source == null) {
            return null;
        }
        BookResponseDto.RoomBookedDto dto = new BookResponseDto.RoomBookedDto();
        dto.setRoomId(source.getRoomId());
        dto.setRoomName(source.getRoomName());
        dto.setBoardName(source.getBoardName());
        return dto;
    }

    private BookResponseDto.GuestContactDto toGuestContactDto(
            com.travelhub.connectors.nuitee.dto.response.BookResponse.GuestContact source) {
        if (source == null) {
            return null;
        }
        BookResponseDto.GuestContactDto dto = new BookResponseDto.GuestContactDto();
        dto.setFirstName(source.getFirstName());
        dto.setLastName(source.getLastName());
        dto.setEmail(source.getEmail());
        dto.setPhone(source.getPhone());
        return dto;
    }

    // Booking List mapping methods
    public BookingListResponseDto toBookingListResponseDto(
            BookingListResponse response) {
        if (response == null || response.getData() == null) {
            return new BookingListResponseDto();
        }

        BookingListResponseDto dto = new BookingListResponseDto();
        List<BookingListResponseDto.BookingDataDto> bookings = response.getData().stream()
                .map(this::toBookingDataDto)
                .collect(Collectors.toList());
        dto.setData(bookings);
        return dto;
    }

    private BookingListResponseDto.BookingDataDto toBookingDataDto(
            com.travelhub.connectors.nuitee.dto.response.BookingListResponse.BookingData data) {
        if (data == null) {
            return null;
        }

        BookingListResponseDto.BookingDataDto dto = new BookingListResponseDto.BookingDataDto();
        dto.setBookingId(data.getBookingId());
        dto.setClientReference(data.getClientReference());
        dto.setStatus(data.getStatus());
        dto.setCheckin(data.getCheckin());
        dto.setCheckout(data.getCheckout());
        dto.setPrice(data.getPrice());
        dto.setCurrency(data.getCurrency());

        if (data.getHotel() != null) {
            BookingListResponseDto.HotelInfoDto hotelDto = new BookingListResponseDto.HotelInfoDto();
            hotelDto.setHotelId(data.getHotel().getHotelId());
            hotelDto.setName(data.getHotel().getName());
            dto.setHotel(hotelDto);
        }

        if (data.getRooms() != null) {
            List<BookingListResponseDto.RoomInfoDto> rooms = data.getRooms().stream()
                    .map(this::toRoomInfoDto)
                    .collect(Collectors.toList());
            dto.setRooms(rooms);
        }

        return dto;
    }

    private BookingListResponseDto.RoomInfoDto toRoomInfoDto(
            com.travelhub.connectors.nuitee.dto.response.BookingListResponse.RoomInfo room) {
        if (room == null) {
            return null;
        }

        BookingListResponseDto.RoomInfoDto dto = new BookingListResponseDto.RoomInfoDto();
        dto.setRoomId(room.getRoomId());
        dto.setAdults(room.getAdults());
        dto.setAmount(room.getAmount());
        dto.setCurrency(room.getCurrency());
        return dto;
    }
}
