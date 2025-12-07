package com.travelhub.connectors.nuitee.dto.response;

import java.util.HashMap;
import java.util.Map;

public class AccessibilityAttributes {
    // Dynamic map to hold any accessibility attributes
    private Map<String, Object> attributes = new HashMap<>();

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }
}
