package com.travelhub.connectors.nuitee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RoomPhoto {
    private String url;
    private String imageDescription;
    private String imageClass1;
    private String imageClass2;
    private String failoverPhoto;
    private Boolean mainPhoto;
    private Integer score;
    private Integer classId;
    private Integer classOrder;
    
    @JsonProperty("hd_url")
    private String hdUrl;

    // Getters and Setters

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getImageDescription() { return imageDescription; }
    public void setImageDescription(String imageDescription) { this.imageDescription = imageDescription; }

    public String getImageClass1() { return imageClass1; }
    public void setImageClass1(String imageClass1) { this.imageClass1 = imageClass1; }

    public String getImageClass2() { return imageClass2; }
    public void setImageClass2(String imageClass2) { this.imageClass2 = imageClass2; }

    public String getFailoverPhoto() { return failoverPhoto; }
    public void setFailoverPhoto(String failoverPhoto) { this.failoverPhoto = failoverPhoto; }

    public Boolean getMainPhoto() { return mainPhoto; }
    public void setMainPhoto(Boolean mainPhoto) { this.mainPhoto = mainPhoto; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getClassId() { return classId; }
    public void setClassId(Integer classId) { this.classId = classId; }

    public Integer getClassOrder() { return classOrder; }
    public void setClassOrder(Integer classOrder) { this.classOrder = classOrder; }

    public String getHdUrl() { return hdUrl; }
    public void setHdUrl(String hdUrl) { this.hdUrl = hdUrl; }
}

