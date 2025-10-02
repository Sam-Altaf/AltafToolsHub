#!/bin/bash

# Netlify Deployment Script for PDF Tools Hub

echo "🚀 Starting PDF Tools Hub deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build:client

echo "✅ Build completed successfully!"
echo "📁 Files ready in: dist/public"
echo "🌐 Deploy this folder to Netlify"