package com.travelhub.connectors.nuitee.dto.response;

public class HotelImage {
    private String url;
    private String urlHd;
    private String caption;
    private Integer order;
    private Boolean defaultImage;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUrlHd() {
        return urlHd;
    }

    public void setUrlHd(String urlHd) {
        this.urlHd = urlHd;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public Integer getOrder() {
        return order;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public Boolean getDefaultImage() {
        return defaultImage;
    }

    public void setDefaultImage(Boolean defaultImage) {
        this.defaultImage = defaultImage;
    }
}

