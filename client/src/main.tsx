import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Initialize performance monitoring
import { initWebVitals } from "./utils/performance";
initWebVitals();

// Mark app initialization
if (typeof window !== 'undefined' && window.performance) {
  window.performance.mark('app-init');
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Mark app render complete
if (typeof window !== 'undefined' && window.performance) {
  requestAnimationFrame(() => {
    window.performance.mark('app-render-complete');
    window.performance.measure('app-initialization', 'app-init', 'app-render-complete');
  });
}

// Run performance verification in development (delayed and conditional)
if (!window.location.hostname.includes('replit') && process.env.NODE_ENV === 'development') {
  setTimeout(async () => {
    const { verifyPerformanceFeatures } = await import('./utils/performance-test');
    console.log('🚀 Performance Features Verification:');
    verifyPerformanceFeatures();
  }, 5000);
}
