package com.travelhub.connectors.nuitee.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Policy {
    @JsonProperty("policy_type")
    private String policyType;
    private String name;
    private String description;
    
    @JsonProperty("child_allowed")
    private String childAllowed;
    
    @JsonProperty("pets_allowed")
    private String petsAllowed;
    
    private String parking;

    // Getters and Setters

    public String getPolicyType() { return policyType; }
    public void setPolicyType(String policyType) { this.policyType = policyType; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getChildAllowed() { return childAllowed; }
    public void setChildAllowed(String childAllowed) { this.childAllowed = childAllowed; }

    public String getPetsAllowed() { return petsAllowed; }
    public void setPetsAllowed(String petsAllowed) { this.petsAllowed = petsAllowed; }

    public String getParking() { return parking; }
    public void setParking(String parking) { this.parking = parking; }
}

