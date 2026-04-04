package com.womensafety;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.womensafety.models.Alert;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * AlertService handles all API communication with the Spring Boot backend.
 */
public class AlertService {

    private static final String TAG = "AlertService";

    // Change this to your backend URL (use your local IP on emulator e.g. 10.0.2.2)
    public static final String BASE_URL = "http://10.0.2.2:8080";

    private final ExecutorService executor = Executors.newCachedThreadPool();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    public interface AlertCallback {
        void onSuccess(String alertId, String message);
        void onFailure(String error);
    }

    public interface RecentAlertsCallback {
        void onSuccess(List<Alert> alerts);
        void onFailure(String error);
    }

    /**
     * POST /api/alerts — send an SOS alert
     */
    public void sendAlert(Alert alert, AlertCallback callback) {
        executor.execute(() -> {
            try {
                JSONObject body = new JSONObject();
                body.put("latitude", alert.getLatitude());
                body.put("longitude", alert.getLongitude());
                body.put("trigger", alert.getTrigger());
                body.put("userId", alert.getUserId() != null ? alert.getUserId() : "demo-user");
                body.put("emergencyContacts",
                        alert.getEmergencyContacts() != null
                                ? alert.getEmergencyContacts()
                                : "+1234567890");

                String responseBody = post(BASE_URL + "/api/alerts", body.toString());

                JSONObject response = new JSONObject(responseBody);
                String id = response.optString("id", "unknown");
                String message = response.optString("message", "Alert sent");

                mainHandler.post(() -> callback.onSuccess(id, message));

            } catch (Exception e) {
                Log.e(TAG, "sendAlert failed: " + e.getMessage(), e);
                mainHandler.post(() -> callback.onFailure(e.getMessage()));
            }
        });
    }

    /**
     * GET /api/alerts/recent — fetch last 10 alerts
     */
    public void getRecentAlerts(RecentAlertsCallback callback) {
        executor.execute(() -> {
            try {
                String responseBody = get(BASE_URL + "/api/alerts/recent");
                JSONArray arr = new JSONArray(responseBody);
                List<Alert> alerts = new ArrayList<>();

                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    Alert a = new Alert();
                    a.setId(obj.optString("id"));
                    a.setLatitude(obj.optDouble("latitude", 0));
                    a.setLongitude(obj.optDouble("longitude", 0));
                    a.setTrigger(obj.optString("trigger"));
                    a.setTimestamp(obj.optString("timestamp"));
                    a.setStatus(obj.optString("status"));
                    a.setUserId(obj.optString("userId"));
                    alerts.add(a);
                }

                mainHandler.post(() -> callback.onSuccess(alerts));

            } catch (Exception e) {
                Log.e(TAG, "getRecentAlerts failed: " + e.getMessage(), e);
                mainHandler.post(() -> callback.onFailure(e.getMessage()));
            }
        });
    }

    private String post(String urlString, String jsonBody) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonBody.getBytes(StandardCharsets.UTF_8);
            os.write(input, 0, input.length);
        }

        int code = conn.getResponseCode();
        if (code < 200 || code >= 300) {
            throw new IOException("HTTP error " + code);
        }

        return new String(conn.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    private String get(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept", "application/json");
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);

        int code = conn.getResponseCode();
        if (code < 200 || code >= 300) {
            throw new IOException("HTTP error " + code);
        }

        return new String(conn.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }
}
