package com.travelhub.booking.dto.common;

public class SortCriteriaDto {
    private String field;
    private String direction;

    public SortCriteriaDto() {
    }

    public SortCriteriaDto(String field, String direction) {
        this.field = field;
        this.direction = direction;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}
