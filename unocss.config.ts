import type { PresetMiniTheme } from 'unocss'
import { defineConfig, presetTypography, presetWind3 } from 'unocss'

export default defineConfig<PresetMiniTheme>({
  presets: [presetWind3({ dark: 'media' }), presetTypography()],
  // Keep initial integration low-risk: avoid injecting global preflight styles.
  // You can enable preflight later if/when you migrate more styles to UnoCSS.
  preflights: [
    {
      getCSS: () => `
        html {

        }
        a { 
          color: inherit; 
          text-decoration: inherit;
        }
        a[aria-current='page'] {
          font-weight: 600;
          text-decoration: underline;
        }
      `,
    },
  ],
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      content: '72ch',
    },
    lineHeight: {
      standard: '1.6',
    },
  },
  shortcuts: {
    // 替代 a[aria-current='page']
    'nav-link-active': 'font-600 underline',
    'site-header': 'sticky top-0 z-50 w-full border-b border-current bg-[Canvas]',
    'site-header-inner':
      'mx-auto w-full box-border px-4 py-4 flex items-center justify-between gap-4 max-w-[var(--site-container-wide)] [will-change:max-width] [animation:site-header-shrink_1s_linear_both] [animation-timeline:scroll()] [animation-range:0_var(--site-header-shrink-range)]',
  },
})
