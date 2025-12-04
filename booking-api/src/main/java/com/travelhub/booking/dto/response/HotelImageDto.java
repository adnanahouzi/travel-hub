package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Hotel image information")
public class HotelImageDto {

    @Schema(description = "Image URL")
    private String url;

    @Schema(description = "Image caption")
    private String caption;

    @Schema(description = "Is default image")
    private Boolean defaultImage;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Boolean getDefaultImage() {
        return defaultImage;
    }

    public void setDefaultImage(Boolean defaultImage) {
        this.defaultImage = defaultImage;
    }
}

