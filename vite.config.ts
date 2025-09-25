import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/Saneh-Khao-Man-Kai-marketing.github.io/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'vaul@1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'react-hook-form@7.55.0': 'react-hook-form',
      'react-day-picker@8.10.1': 'react-day-picker',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'input-otp@1.2': 'input-otp',
      'embla-carousel-react@8.0.6': 'embla-carousel-react',
      'cmdk@1.1.1': 'cmdk',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      '@radix-ui/react-tooltip@1.1.2': '@radix-ui/react-tooltip',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tabs@1.1.1': '@radix-ui/react-tabs',
      '@radix-ui/react-switch@1.1.1': '@radix-ui/react-switch',
      '@radix-ui/react-slot@1.1.1': '@radix-ui/react-slot',
      '@radix-ui/react-slider@1.2.1': '@radix-ui/react-slider',
      '@radix-ui/react-separator@1.1.1': '@radix-ui/react-separator',
      '@radix-ui/react-scroll-area@1.2.0': '@radix-ui/react-scroll-area',
      '@radix-ui/react-radio-group@1.2.1': '@radix-ui/react-radio-group',
      '@radix-ui/react-progress@1.1.1': '@radix-ui/react-progress',
      '@radix-ui/react-popover@1.1.2': '@radix-ui/react-popover',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
    },
  },
})
