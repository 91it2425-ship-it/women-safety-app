package com.womensafety.controller;

import com.womensafety.dto.AlertRequest;
import com.womensafety.model.Alert;
import com.womensafety.service.AlertService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    /**
     * POST /api/alerts — create a new SOS alert
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createAlert(
            @Valid @RequestBody AlertRequest request) {

        Alert saved = alertService.createAlert(request);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("status", saved.getStatus().name());
        response.put("message", "Alert sent + GPS attached");
        response.put("timestamp", saved.getTimestamp().toString());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/alerts — paginated list (latest first)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllAlerts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Alert> alertPage = alertService.getAllAlerts(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("alerts", alertPage.getContent());
        response.put("totalElements", alertPage.getTotalElements());
        response.put("totalPages", alertPage.getTotalPages());
        response.put("currentPage", alertPage.getNumber());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/alerts/recent — last 10 alerts for mobile dashboard
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Alert>> getRecentAlerts() {
        return ResponseEntity.ok(alertService.getRecentAlerts());
    }

    /**
     * DELETE /api/alerts/{id} — clear a specific alert
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAlert(@PathVariable String id) {
        alertService.deleteAlert(id);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Alert deleted");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/alerts — clear all alerts (demo reset)
     */
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteAllAlerts() {
        alertService.deleteAllAlerts();
        Map<String, Object> response = new HashMap<>();
        response.put("message", "All alerts cleared");
        return ResponseEntity.ok(response);
    }
}
