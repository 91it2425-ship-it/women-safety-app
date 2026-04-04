package com.womensafety;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Looper;
import android.util.Log;

import androidx.core.content.ContextCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;

/**
 * LocationManager wraps FusedLocationProviderClient for real-time GPS.
 */
public class LocationManager {

    private static final String TAG = "LocationManager";
    private static final long UPDATE_INTERVAL_MS = 5000L;
    private static final long FASTEST_INTERVAL_MS = 2000L;

    public interface LocationListener {
        void onLocationUpdated(double latitude, double longitude);
        void onLocationUnavailable();
    }

    private final Context context;
    private final FusedLocationProviderClient fusedClient;
    private LocationCallback locationCallback;
    private Location lastKnownLocation;
    private final LocationListener listener;

    public LocationManager(Context context, LocationListener listener) {
        this.context = context;
        this.listener = listener;
        this.fusedClient = LocationServices.getFusedLocationProviderClient(context);
    }

    public boolean hasPermission() {
        return ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION)
                == PackageManager.PERMISSION_GRANTED;
    }

    public void startUpdates() {
        if (!hasPermission()) {
            listener.onLocationUnavailable();
            return;
        }

        LocationRequest request = new LocationRequest.Builder(UPDATE_INTERVAL_MS)
                .setMinUpdateIntervalMillis(FASTEST_INTERVAL_MS)
                .setPriority(Priority.PRIORITY_HIGH_ACCURACY)
                .build();

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult result) {
                Location loc = result.getLastLocation();
                if (loc != null) {
                    lastKnownLocation = loc;
                    Log.d(TAG, "Location update: " + loc.getLatitude() + ", " + loc.getLongitude());
                    listener.onLocationUpdated(loc.getLatitude(), loc.getLongitude());
                }
            }
        };

        try {
            fusedClient.requestLocationUpdates(request, locationCallback, Looper.getMainLooper());
        } catch (SecurityException e) {
            Log.e(TAG, "Location permission denied", e);
            listener.onLocationUnavailable();
        }

        // Also get last known immediately
        try {
            fusedClient.getLastLocation().addOnSuccessListener(loc -> {
                if (loc != null) {
                    lastKnownLocation = loc;
                    listener.onLocationUpdated(loc.getLatitude(), loc.getLongitude());
                } else {
                    listener.onLocationUnavailable();
                }
            });
        } catch (SecurityException e) {
            Log.e(TAG, "getLastLocation failed", e);
        }
    }

    public void stopUpdates() {
        if (locationCallback != null) {
            fusedClient.removeLocationUpdates(locationCallback);
            locationCallback = null;
        }
    }

    public Location getLastKnownLocation() {
        return lastKnownLocation;
    }

    public double getLatitude() {
        return lastKnownLocation != null ? lastKnownLocation.getLatitude() : 0.0;
    }

    public double getLongitude() {
        return lastKnownLocation != null ? lastKnownLocation.getLongitude() : 0.0;
    }

    public boolean isLocationAvailable() {
        return lastKnownLocation != null;
    }
}
