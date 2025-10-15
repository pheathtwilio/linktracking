#!/bin/bash

# Usage: ./send_sms.sh +1234567890

PHONE_NUMBER="$1"

# Validate that a phone number was provided
if [ -z "$PHONE_NUMBER" ]; then
  echo "Error: No phone number provided."
  echo "Usage: $0 +1234567890"
  exit 1
fi

# Validate format: '+' followed by exactly 10 digits
if ! [[ "$PHONE_NUMBER" =~ ^\+[0-9]{11}$ ]]; then
  echo "Error: Invalid phone number format. Must be '+' followed by exactly 10 digits (e.g., +1234567890)."
  exit 1
fi

# Ensure Twilio credentials are set
if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ]; then
  echo "Error: TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set in environment."
  exit 1
fi

# Send the SMS via Twilio
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Messages.json" \
--data-urlencode "ShortenUrls=true" \
--data-urlencode "MessagingServiceSid=MG3e885279262d2b074f99c57cd894c314" \
--data-urlencode "To=$PHONE_NUMBER" \
--data-urlencode "Body=Check out this shortened url https://trackmefortracking.org/N6uAirXeREkpV2MW7kpV2MW7TAvh1zn4gEFMTAvh1zn4gEFMN6uAirXeRE" \
-u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN"
