import { getCollection } from 'astro:content';

const staticRoutes = [
	'',
	'about/',
	'mission/',
	'open-science/',
	'research/',
	'podcast/',
	'podcast/about/',
	'podcast/guest-guide/',
	'podcast/professional-guide/',
	'for-patients/',
	'for-clinicians/',
	'for-professionals/',
	'glossary/',
	'follow/',
	'join/',
	'contact/',
	'disclaimers/',
	'privacy/',
	'terms/',
	'blog/',
];

export async function GET(context) {
	const siteUrl = context.site ? context.site.href.replace(/\/$/, '') : 'https://www.decodingtheburn.com';
	const publishedPosts = await getCollection('blog', ({ data }) => !data.draft);

	const staticUrls = staticRoutes.map((route) => `  <url>
    <loc>${siteUrl}/${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : route.startsWith('blog/') || route.startsWith('podcast/') ? '0.8' : '0.7'}</priority>
  </url>`).join('\n');

	const postUrls = publishedPosts.map((post) => `  <url>
    <loc>${siteUrl}/blog/${post.id}/</loc>
    <lastmod>${post.data.pubDate ? new Date(post.data.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>`;

	return new Response(xml.trim(), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'X-Robots-Tag': 'noindex', // Sitemap itself shouldn't be indexed as an HTML page
		},
	});
}
