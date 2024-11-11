import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LottoGen Pro',
    short_name: 'LottoGen',
    description: 'Professional Lottery Number Generator',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#0066CC',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}