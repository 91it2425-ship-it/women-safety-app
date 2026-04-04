package com.womensafety.dto;

import com.womensafety.model.Alert;
import jakarta.validation.constraints.NotNull;

public class AlertRequest {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @NotNull(message = "Trigger type is required")
    private Alert.TriggerType trigger;

    private String userId;
    private String emergencyContacts;

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Alert.TriggerType getTrigger() { return trigger; }
    public void setTrigger(Alert.TriggerType trigger) { this.trigger = trigger; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getEmergencyContacts() { return emergencyContacts; }
    public void setEmergencyContacts(String emergencyContacts) {
        this.emergencyContacts = emergencyContacts;
    }
}
