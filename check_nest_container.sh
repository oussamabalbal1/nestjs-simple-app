#!/bin/bash

# Define the URL to test
URL="http://localhost:3000/live"

# Expected response
EXPECTED_RESPONSE='{"message":"live"}'

# Send a GET request to the /live endpoint
RESPONSE=$(docker exec nest-app-test curl -s "$URL")


# Check if the response matches the expected output
if [ "$RESPONSE" = "$EXPECTED_RESPONSE" ]; then
    echo "✅ Success: The endpoint returned '$EXPECTED_RESPONSE'"
    exit 0  # Exit with success code
else
    echo "❌ Error: Unexpected response from '$URL'"
    echo "   Expected: '$EXPECTED_RESPONSE'"
    echo "   Received: '$RESPONSE'"
    exit 1  # Exit with error code
fi