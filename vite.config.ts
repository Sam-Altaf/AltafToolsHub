import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react({
      // Optimize React with SWC for faster builds
      jsxRuntime: 'automatic',
    }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Advanced optimization for 100% PageSpeed
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2,
      },
      mangle: true,
    },
    rollupOptions: {
      output: {
        // Simplified chunk splitting to avoid PDF library issues
        manualChunks: (id) => {
          // Keep PDF libraries together to avoid import issues
          if (id.includes('pdfjs-dist') || id.includes('pdf-lib') || id.includes('pako')) {
            return 'pdf-libs';
          }
          // React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('wouter')) {
            return 'vendor-react';
          }
          // UI framework
          if (id.includes('@radix-ui')) {
            return 'vendor-ui';
          }
          // Utilities
          if (id.includes('qrcode') || id.includes('framer-motion') || id.includes('date-fns')) {
            return 'vendor-utils';
          }
          // Analytics
          if (id.includes('@tanstack/react-query')) {
            return 'vendor-analytics';
          }
          // Icons and styling
          if (id.includes('lucide-react') || id.includes('react-icons') || id.includes('clsx')) {
            return 'vendor-styling';
          }
        },
        // Optimize chunk names for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/media/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|ico|webp|avif)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/img/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        },
      },
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 1000,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    hmr: {
      overlay: false  // Disable HMR overlay for cleaner development
    },
  },
  // Optimize dependencies - fix PDF library issues
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wouter',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react',
    ],
    exclude: [
      'pdfjs-dist',
      'pdf-lib',
      'pdf-lib-with-encrypt', 
      '@pdf-lib/standard-fonts',
      'tesseract.js',
      'canvas',
    ],
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true
      }
    }
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ]
    }
  },
});
