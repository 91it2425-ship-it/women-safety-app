package com.womensafety.models;

public class Alert {
    private String id;
    private String userId;
    private double latitude;
    private double longitude;
    private String trigger;
    private String timestamp;
    private String status;
    private String emergencyContacts;

    public Alert() {}

    public Alert(double latitude, double longitude, String trigger) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.trigger = trigger;
        this.userId = "demo-user";
        this.emergencyContacts = "+1234567890";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getTrigger() { return trigger; }
    public void setTrigger(String trigger) { this.trigger = trigger; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEmergencyContacts() { return emergencyContacts; }
    public void setEmergencyContacts(String emergencyContacts) {
        this.emergencyContacts = emergencyContacts;
    }
}
