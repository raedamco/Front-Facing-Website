#!/bin/bash

# Raedam Website Deployment Script
echo "🚀 Deploying Raedam website to Firebase Hosting..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run:"
    echo "firebase login"
    exit 1
fi

# Deploy to Firebase Hosting
echo "📤 Uploading files to Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Website URL: https://theory-parking.web.app"
    echo "📊 Firebase Console: https://console.firebase.google.com/project/theory-parking/overview"
else
    echo "❌ Deployment failed!"
    exit 1
fi
