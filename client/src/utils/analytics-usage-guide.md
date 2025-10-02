# Analytics Tracking Usage Guide

## Overview
This guide shows how to use the enhanced analytics tracking in your tools.

## Available Tracking Functions

### 1. Tool Usage Tracking

```typescript
import { trackToolStart, trackToolComplete, trackToolError } from '@/utils/analytics-events';

// When user starts using a tool
trackToolStart('compress-pdf', fileSize);

// When tool completes successfully
trackToolComplete(
  'compress-pdf',
  processingTime, // in milliseconds
  inputFileSize,
  outputFileSize
);

// If an error occurs
trackToolError('compress-pdf', 'compression_failed', error.message);
```

### 2. File Download Tracking

```typescript
import { trackFileDownload } from '@/utils/analytics-events';

// When user downloads a processed file
trackFileDownload('compress-pdf', 'pdf', fileSize);
```

### 3. User Interaction Tracking

```typescript
import { trackButtonClick, trackFileUpload, trackSettingsChange } from '@/utils/analytics-events';

// Track button clicks
trackButtonClick('download-button', 'compress-pdf-page');

// Track file uploads
trackFileUpload('compress-pdf', 'application/pdf', fileSize);

// Track settings changes
trackSettingsChange('compression-level', 'high');
```

### 4. Error Tracking

```typescript
import { trackError } from '@/utils/analytics-events';

// Track errors (also done automatically by ErrorBoundary)
try {
  // risky code
} catch (error) {
  trackError('runtime', error.message, 'ComponentName', error.stack);
}
```

### 5. User Journey Tracking

```typescript
import { trackUserJourney } from '@/utils/analytics-events';

// Track multi-step workflows
trackUserJourney('upload-file', 'merge-pdf', 1, 3);
trackUserJourney('select-pages', 'merge-pdf', 2, 3);
trackUserJourney('download-result', 'merge-pdf', 3, 3);
```

## Automatic Tracking

The following are tracked automatically:
- **Page Views**: Tracked on every route change
- **Web Vitals**: LCP, FCP, CLS, TTFB, INP sent to GA
- **Scroll Depth**: 25%, 50%, 75%, 100% milestones
- **Session Duration**: Time spent on site
- **Errors**: React errors caught by ErrorBoundary

## Example Implementation

```typescript
import { useState } from 'react';
import { trackToolStart, trackToolComplete, trackFileDownload } from '@/utils/analytics-events';

function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  
  const handleCompress = async () => {
    if (!file) return;
    
    const startTime = Date.now();
    const inputSize = file.size;
    
    // Track tool start
    trackToolStart('compress-pdf', inputSize);
    
    try {
      // Do compression
      const compressed = await compressPDF(file);
      const processingTime = Date.now() - startTime;
      
      // Track completion
      trackToolComplete(
        'compress-pdf',
        processingTime,
        inputSize,
        compressed.size
      );
      
      // Track download when user downloads
      trackFileDownload('compress-pdf', 'pdf', compressed.size);
      
    } catch (error) {
      trackToolError('compress-pdf', 'compression_failed', error.message);
    }
  };
  
  return (
    // UI components
  );
}
```

## Data in Google Analytics

All tracked events appear in Google Analytics 4 under:
- **Events** > View all events
- **Conversions** > tool_complete, file_download
- **Engagement** > scroll_depth, session_duration, user_journey

## Best Practices

1. Always track tool start/complete for conversion funnels
2. Include file sizes for compression ratio analysis
3. Track errors to identify pain points
4. Use consistent naming: `tool-name` format (e.g., 'compress-pdf')
5. Respect user privacy - no PII in tracking
