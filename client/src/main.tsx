import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initWebVitals } from "./utils/performance";

// Initialize performance monitoring
initWebVitals();

// Run performance verification in development
if (process.env.NODE_ENV === 'development') {
  import('./utils/performance-test').then(({ verifyPerformanceFeatures }) => {
    setTimeout(() => {
      console.log('🚀 Performance Features Verification:');
      verifyPerformanceFeatures();
    }, 3000);
  });
}

// Mark app initialization
if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
  window.performance.mark('app-init');
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Mark app render complete
if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
  requestAnimationFrame(() => {
    window.performance.mark('app-render-complete');
    window.performance.measure('app-initialization', 'app-init', 'app-render-complete');
  });
}
