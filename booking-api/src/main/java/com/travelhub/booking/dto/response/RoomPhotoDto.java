package com.travelhub.booking.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Room photo information")
public class RoomPhotoDto {
    
    @Schema(description = "Photo URL")
    private String url;
    
    @Schema(description = "HD Photo URL")
    private String hdUrl;
    
    @Schema(description = "Photo description")
    private String imageDescription;
    
    @Schema(description = "Whether this is the main photo")
    private Boolean mainPhoto;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getHdUrl() {
        return hdUrl;
    }

    public void setHdUrl(String hdUrl) {
        this.hdUrl = hdUrl;
    }

    public String getImageDescription() {
        return imageDescription;
    }

    public void setImageDescription(String imageDescription) {
        this.imageDescription = imageDescription;
    }

    public Boolean getMainPhoto() {
        return mainPhoto;
    }

    public void setMainPhoto(Boolean mainPhoto) {
        this.mainPhoto = mainPhoto;
    }
}

