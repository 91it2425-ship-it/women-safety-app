package com.womensafety;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.womensafety.models.Alert;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity
        implements LocationManager.LocationListener {

    private static final int LOCATION_PERMISSION_REQUEST = 1001;
    private static final SimpleDateFormat TIME_FORMAT =
            new SimpleDateFormat("HH:mm:ss dd/MM/yyyy", Locale.getDefault());

    // UI elements
    private Button btnSos;
    private Button btnVoice;
    private Button btnAi;
    private TextView tvGpsStatus;
    private TextView tvLocation;
    private TextView tvLastAlert;
    private Switch switchTestMode;

    // Services
    private LocationManager locationManager;
    private AlertService alertService;

    private boolean testMode = false;
    private double currentLat = 0.0;
    private double currentLon = 0.0;
    private boolean gpsLocked = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        initServices();
        requestLocationPermission();
        setupClickListeners();
    }

    private void initViews() {
        btnSos      = findViewById(R.id.btnSos);
        btnVoice    = findViewById(R.id.btnVoice);
        btnAi       = findViewById(R.id.btnAi);
        tvGpsStatus = findViewById(R.id.tvGpsStatus);
        tvLocation  = findViewById(R.id.tvLocation);
        tvLastAlert = findViewById(R.id.tvLastAlert);
        switchTestMode = findViewById(R.id.switchTestMode);

        tvGpsStatus.setText(getString(R.string.gps_acquiring));
    }

    private void initServices() {
        locationManager = new LocationManager(this, this);
        alertService = new AlertService();
    }

    private void setupClickListeners() {
        btnSos.setOnClickListener(v -> sendAlert("BUTTON"));

        btnVoice.setOnClickListener(v -> sendAlert("VOICE_DETECTED"));

        btnAi.setOnClickListener(v -> sendAlert("AI_SCREAM_DETECTED"));

        switchTestMode.setOnCheckedChangeListener(
                (CompoundButton b, boolean checked) -> {
                    testMode = checked;
                    Toast.makeText(this,
                            checked ? "Test Mode: ON (using mock location)" : "Test Mode: OFF",
                            Toast.LENGTH_SHORT).show();
                    if (checked) {
                        currentLat = 37.7749;
                        currentLon = -122.4194;
                        updateLocationDisplay();
                    }
                });
    }

    private void sendAlert(String triggerType) {
        double lat = testMode ? 37.7749 : currentLat;
        double lon = testMode ? -122.4194 : currentLon;

        if (!testMode && !gpsLocked) {
            Toast.makeText(this, "⚠️ GPS not locked yet. Enable Test Mode or wait for GPS.",
                    Toast.LENGTH_LONG).show();
            return;
        }

        vibrate();

        Alert alert = new Alert(lat, lon, triggerType);

        btnSos.setEnabled(false);
        btnVoice.setEnabled(false);
        btnAi.setEnabled(false);

        alertService.sendAlert(alert, new AlertService.AlertCallback() {
            @Override
            public void onSuccess(String alertId, String message) {
                String timestamp = TIME_FORMAT.format(new Date());
                tvLastAlert.setText("Last alert: " + timestamp + " (" + triggerType + ")");
                Toast.makeText(MainActivity.this,
                        "✅ " + message, Toast.LENGTH_LONG).show();
                enableButtons();
                loadRecentAlerts();
            }

            @Override
            public void onFailure(String error) {
                Toast.makeText(MainActivity.this,
                        "❌ Alert failed: " + error, Toast.LENGTH_LONG).show();
                enableButtons();
            }
        });
    }

    private void loadRecentAlerts() {
        alertService.getRecentAlerts(new AlertService.RecentAlertsCallback() {
            @Override
            public void onSuccess(List<Alert> alerts) {
                // Alerts loaded - in a real app you'd show them in a RecyclerView
            }

            @Override
            public void onFailure(String error) {
                // Ignore silent failure for recent alerts
            }
        });
    }

    private void enableButtons() {
        btnSos.setEnabled(true);
        btnVoice.setEnabled(true);
        btnAi.setEnabled(true);
    }

    private void vibrate() {
        Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        if (vibrator != null && vibrator.hasVibrator()) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createWaveform(
                        new long[]{0, 200, 100, 200}, -1));
            } else {
                vibrator.vibrate(new long[]{0, 200, 100, 200}, -1);
            }
        }
    }

    // ─── LocationListener ───────────────────────────────────────────────────

    @Override
    public void onLocationUpdated(double latitude, double longitude) {
        currentLat = latitude;
        currentLon = longitude;
        gpsLocked = true;
        updateLocationDisplay();
    }

    @Override
    public void onLocationUnavailable() {
        gpsLocked = false;
        tvGpsStatus.setText(getString(R.string.gps_acquiring));
        tvLocation.setText(getString(R.string.location_unavailable));
    }

    private void updateLocationDisplay() {
        tvGpsStatus.setText(getString(R.string.gps_locked));
        tvLocation.setText(String.format(Locale.US, "%.6f, %.6f", currentLat, currentLon));
    }

    // ─── Permissions ────────────────────────────────────────────────────────

    private void requestLocationPermission() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                    },
                    LOCATION_PERMISSION_REQUEST);
        } else {
            locationManager.startUpdates();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST) {
            if (grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                locationManager.startUpdates();
            } else {
                Toast.makeText(this,
                        "Location permission required for real GPS. Enabling test mode.",
                        Toast.LENGTH_LONG).show();
                switchTestMode.setChecked(true);
            }
        }
    }

    // ─── Lifecycle ──────────────────────────────────────────────────────────

    @Override
    protected void onPause() {
        super.onPause();
        locationManager.stopUpdates();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (locationManager.hasPermission()) {
            locationManager.startUpdates();
        }
    }
}
