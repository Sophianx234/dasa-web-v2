import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://dasaug.com'; // Make sure to replace this with your actual production domain later!

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'], // Prevent indexing of backend routes and build files
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Points Google directly to the sitemap we just generated
  };
}
