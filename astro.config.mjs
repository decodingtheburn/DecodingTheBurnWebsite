import fs from 'node:fs';
import path from 'node:path';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

function getDraftSlugs() {
	const blogDir = path.resolve('src/content/blog');
	if (!fs.existsSync(blogDir)) return [];
	const files = fs.readdirSync(blogDir);
	const draftSlugs = [];
	for (const file of files) {
		const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
		if (/^draft:\s*true/m.test(content)) {
			const slug = file.replace(/\.(md|mdx)$/, '');
			draftSlugs.push(slug);
		}
	}
	return draftSlugs;
}

const draftSlugs = getDraftSlugs();

// https://astro.build/config
export default defineConfig({
	site: 'https://www.decodingtheburn.com',
	devToolbar: {
		enabled: false,
	},
	redirects: {
		'/1': '/blog/1-my-bms-18-months-carnivore-experiment',
		'/blog/my-burning-mouth-triggers': '/blog/1-my-bms-18-months-carnivore-experiment',
		'/blog/my-burning-mouth-syndrome-triggers-bms-acid-sugar': '/blog/1-my-bms-18-months-carnivore-experiment',
		'/blog/1-my-burning-mouth-syndrome-triggers-bms-acid-sugar': '/blog/1-my-bms-18-months-carnivore-experiment',
		'/viewer/my-burning-mouth-triggers/private': '/viewer/1-my-bms-18-months-carnivore-experiment/private',
		'/viewer/my-burning-mouth-triggers/public': '/viewer/1-my-bms-18-months-carnivore-experiment/public',
		'/viewer/my-burning-mouth-syndrome-triggers-bms-acid-sugar/private': '/viewer/1-my-bms-18-months-carnivore-experiment/private',
		'/viewer/my-burning-mouth-syndrome-triggers-bms-acid-sugar/public': '/viewer/1-my-bms-18-months-carnivore-experiment/public',
		'/viewer/1-my-burning-mouth-syndrome-triggers-bms-acid-sugar/private': '/viewer/1-my-bms-18-months-carnivore-experiment/private',
		'/viewer/1-my-burning-mouth-syndrome-triggers-bms-acid-sugar/public': '/viewer/1-my-bms-18-months-carnivore-experiment/public',
	},
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => {
				const url = new URL(page);
				const pathname = url.pathname;
				if (
					pathname.startsWith('/viewer') ||
					pathname.startsWith('/drafts') ||
					pathname.startsWith('/presentation') ||
					pathname.startsWith('/thumbnails-preview') ||
					pathname.startsWith('/backgrounds')
				) {
					return false;
				}
				if (draftSlugs.some((slug) => pathname.includes(`/blog/${slug}`))) {
					return false;
				}
				return true;
			},
		}),
	],
});
