package com.womensafety.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {

    @Value("${twilio.account.sid:ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX}")
    private String accountSid;

    @Value("${twilio.auth.token:your_auth_token_placeholder}")
    private String authToken;

    @Value("${twilio.phone.from:+15005550006}")
    private String fromNumber;

    public String getAccountSid() { return accountSid; }
    public String getAuthToken() { return authToken; }
    public String getFromNumber() { return fromNumber; }

    public boolean isConfigured() {
        return accountSid != null
                && !accountSid.equals("ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
                && accountSid.startsWith("AC")
                && accountSid.length() == 34;
    }
}
