package com.womensafety.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.womensafety.config.TwilioConfig;
import com.womensafety.model.Alert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class TwilioService {

    private static final Logger logger = LoggerFactory.getLogger(TwilioService.class);
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final TwilioConfig twilioConfig;

    public TwilioService(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
    }

    public void sendSosAlert(Alert alert) {
        String mapsLink = String.format(
                "https://maps.google.com/?q=%s,%s",
                alert.getLatitude(), alert.getLongitude()
        );
        String message = String.format(
                "🚨 SOS Alert! Women's Safety App. Location: %s. Time: %s. Trigger: %s",
                mapsLink,
                alert.getTimestamp().format(FORMATTER),
                alert.getTrigger().name()
        );

        if (!twilioConfig.isConfigured()) {
            logger.info("📱 [TEST MODE] SMS would be sent to: {} | Message: {}",
                    alert.getEmergencyContacts(), message);
            return;
        }

        try {
            Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
            String[] contacts = alert.getEmergencyContacts().split(",");
            for (String contact : contacts) {
                String phoneNumber = contact.trim();
                if (!phoneNumber.isEmpty()) {
                    Message.creator(
                            new PhoneNumber(phoneNumber),
                            new PhoneNumber(twilioConfig.getFromNumber()),
                            message
                    ).create();
                    logger.info("✅ SMS sent to: {}", phoneNumber);
                }
            }
        } catch (Exception e) {
            logger.error("❌ Failed to send SMS via Twilio: {}", e.getMessage());
        }
    }


}
