package com.womensafety.service;

import com.womensafety.dto.AlertRequest;
import com.womensafety.model.Alert;
import com.womensafety.repository.AlertRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AlertService {

    private static final Logger logger = LoggerFactory.getLogger(AlertService.class);

    private final AlertRepository alertRepository;
    private final TwilioService twilioService;

    public AlertService(AlertRepository alertRepository, TwilioService twilioService) {
        this.alertRepository = alertRepository;
        this.twilioService = twilioService;
    }

    public Alert createAlert(AlertRequest request) {
        Alert alert = new Alert();
        alert.setLatitude(request.getLatitude());
        alert.setLongitude(request.getLongitude());
        alert.setTrigger(request.getTrigger());
        alert.setTimestamp(LocalDateTime.now());
        alert.setStatus(Alert.AlertStatus.SENT);
        alert.setUserId(request.getUserId() != null ? request.getUserId() : "demo-user");
        alert.setEmergencyContacts(
                request.getEmergencyContacts() != null
                        ? request.getEmergencyContacts()
                        : "+1234567890"
        );

        Alert saved = alertRepository.save(alert);

        logger.info("🚨 Alert saved: id={}, trigger={}, location=({}, {})",
                saved.getId(), saved.getTrigger(), saved.getLatitude(), saved.getLongitude());

        twilioService.sendSosAlert(saved);

        return saved;
    }

    public Page<Alert> getAllAlerts(Pageable pageable) {
        return alertRepository.findAllByOrderByTimestampDesc(pageable);
    }

    public List<Alert> getRecentAlerts() {
        return alertRepository.findTop10ByOrderByTimestampDesc();
    }

    public Optional<Alert> getAlertById(String id) {
        return alertRepository.findById(id);
    }

    public void deleteAlert(String id) {
        alertRepository.deleteById(id);
        logger.info("🗑️  Alert deleted: id={}", id);
    }

    public void deleteAllAlerts() {
        alertRepository.deleteAll();
        logger.info("🗑️  All alerts cleared");
    }
}
