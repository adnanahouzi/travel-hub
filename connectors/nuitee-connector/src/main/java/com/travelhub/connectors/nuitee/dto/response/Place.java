package com.travelhub.connectors.nuitee.dto.response;

import java.util.List;

public class Place {
    private List<AddressComponent> addressComponents;
    private String displayName;
    private MinimalHotelData.Location location;
    private String placeId;
    private List<String> types;
    private MinimalHotelData.Viewport viewport;

    public List<AddressComponent> getAddressComponents() {
        return addressComponents;
    }

    public void setAddressComponents(List<AddressComponent> addressComponents) {
        this.addressComponents = addressComponents;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public MinimalHotelData.Location getLocation() {
        return location;
    }

    public void setLocation(MinimalHotelData.Location location) {
        this.location = location;
    }

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public List<String> getTypes() {
        return types;
    }

    public void setTypes(List<String> types) {
        this.types = types;
    }

    public MinimalHotelData.Viewport getViewport() {
        return viewport;
    }

    public void setViewport(MinimalHotelData.Viewport viewport) {
        this.viewport = viewport;
    }
    public static class AddressComponent {
        private String languageCode;
        private String longText;
        private String shortText;
        private List<String> types;

        public String getLanguageCode() {
            return languageCode;
        }

        public void setLanguageCode(String languageCode) {
            this.languageCode = languageCode;
        }

        public String getLongText() {
            return longText;
        }

        public void setLongText(String longText) {
            this.longText = longText;
        }

        public String getShortText() {
            return shortText;
        }

        public void setShortText(String shortText) {
            this.shortText = shortText;
        }

        public List<String> getTypes() {
            return types;
        }

        public void setTypes(List<String> types) {
            this.types = types;
        }
    }
}




