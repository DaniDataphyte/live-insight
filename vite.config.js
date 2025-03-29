import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/site.css',
                'resources/js/site.js',
                // 'resources/js/toc.js',  // Add TOC as separate entry
                
                // Control Panel assets.
                // https://statamic.dev/extending/control-panel#adding-css-and-js-assets
                // 'resources/css/cp.css',
                // 'resources/js/cp.js',
            ],
            refresh: true,
        }),
        vue(),
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
            '@': '/resources/js',
            '~': '/resources',
            Services: '/resources/js/services',
        },
    },
build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
        output: {
            manualChunks(id) {
                if (id.includes('node_modules')) {
                    return 'vendor';
                }
            }
        }
    }
},
optimizeDeps: {
    include: ['firebase/auth']
},
server: {
    hmr: true,
    watch: {
        usePolling: true
    }
}
}); 