#!/bin/bash

BASE_URL="http://localhost:3000"
EMAIL="testuser_$(date +%s)@example.com"
PASSWORD="password123"

echo "Registering user: $EMAIL"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$EMAIL"'",
    "password": "'"$PASSWORD"'",
    "name": "Test User",
    "position": "web_developer_frontend",
    "seniority": "junior"
  }'

echo -e "\n\nAttempting login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$EMAIL"'",
    "password": "'"$PASSWORD"'"
  }')

echo "$LOGIN_RESPONSE"

if [[ "$LOGIN_RESPONSE" == *"accessToken"* ]]; then
  echo -e "\n\nLogin SUCCESS"
else
  echo -e "\n\nLogin FAILED"
fi
