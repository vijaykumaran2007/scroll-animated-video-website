import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vijay Adithiya Portfolio',
    short_name: 'Vijay',
    description: 'Portfolio of Vijay Adithiya, Software Developer and ML Engineer.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1F12',
    theme_color: '#0B1F12',
    icons: [
      {
        src: '/icon.jpg',
        sizes: '1024x1024',
        type: 'image/jpeg',
      },
    ],
  };
}
