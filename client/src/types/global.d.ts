// Global type definitions for AltafToolsHub

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId?: string | Date,
      config?: any
    ) => void;
    dataLayer: any[];
    trackToolUsage: (toolName: string, category: string, action?: string) => void;
    trackFileProcessing: (toolName: string, fileType: string, fileSize: number, processingTime: number) => void;
    trackEngagement: (eventName: string, parameters?: any) => void;
    trackPerformanceMetrics: () => void;
    trackErrors: () => void;
  }
}

export {};