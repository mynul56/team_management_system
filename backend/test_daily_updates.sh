#!/bin/bash

BASE_URL="http://localhost:3000"
# Login as Admin to get token (assuming setup from previous steps acts as admin or we use a known admin)
# actually, let's just register a new user and use that.

EMAIL="test_daily_$(date +%s)@example.com"
PASSWORD="password123"

echo "Registering user..."
REGISTER_RES=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$EMAIL"'",
    "password": "'"$PASSWORD"'",
    "name": "Daily Update Test",
    "position": "web_developer_frontend",
    "seniority": "junior"
  }')
USER_ID=$(echo $REGISTER_RES | awk -F'"userId":"' '{print $2}' | awk -F'"' '{print $1}')

echo "Logging in..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$EMAIL"'",
    "password": "'"$PASSWORD"'"
  }')
TOKEN=$(echo $LOGIN_RES | awk -F'"accessToken":"' '{print $2}' | awk -F'"' '{print $1}')

echo "Got Token: ${TOKEN:0:10}..."

# Create a project first (needed for daily update)
# Wait, only admin can create projects usually? Let's check permissions.
# If I can't create a project, I can't test daily update submission easily if projectId is validated.
# I'll try to fetch projects first.
echo "Fetching projects..."
PROJECTS_RES=$(curl -s -X GET "$BASE_URL/projects" -H "Authorization: Bearer $TOKEN")
echo "Projects: $PROJECTS_RES"

# Pick first project ID if any
PROJECT_ID=$(echo $PROJECTS_RES | awk -F'"_id":"' '{print $2}' | awk -F'"' '{print $1}')

if [ -z "$PROJECT_ID" ]; then
  echo "No projects found. Cannot test daily update without a project."
  # Try to create one if allowed (unlikely for normal user)
else
  echo "Using Project ID: $PROJECT_ID"
  
  echo "Submitting Daily Update..."
  SUBMIT_RES=$(curl -s -X POST "$BASE_URL/daily-updates?date=$(date +%Y-%m-%d)" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "projectId": "'"$PROJECT_ID"'",
      "completedToday": "Fixed login bug",
      "inProgress": "Daily updates",
      "blockers": "None"
    }')
  echo "Submit Response: $SUBMIT_RES"
fi
