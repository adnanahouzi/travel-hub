package com.travelhub.connectors.nuitee.dto.common;

import java.util.List;

public class Occupancy {
    private int adults;
    private List<Integer> children;

    public int getAdults() {
        return adults;
    }

    public void setAdults(int adults) {
        this.adults = adults;
    }

    public List<Integer> getChildren() {
        return children;
    }

    public void setChildren(List<Integer> children) {
        this.children = children;
    }
}
