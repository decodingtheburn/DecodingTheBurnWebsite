import type { CollectionEntry } from 'astro:content';

/**
 * Standard utility to retrieve a deterministic entry number for any blog post.
 * If entryNumber is explicitly set in frontmatter, that is used.
 * Otherwise, falls back to chronological sequence.
 */
export function getPostEntryNumber(
	post: CollectionEntry<'blog'>,
	allPostsAscending?: CollectionEntry<'blog'>[]
): number {
	if (typeof post.data.entryNumber === 'number') {
		return post.data.entryNumber;
	}
	if (allPostsAscending) {
		const idx = allPostsAscending.findIndex(p => p.id === post.id);
		if (idx !== -1) return idx + 1;
	}
	return 1;
}

/**
 * Sorts blog posts by entryNumber descending (newest entries first),
 * falling back to pubDate descending.
 */
export function sortPostsDescending(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
	return [...posts].sort((a, b) => {
		const numA = typeof a.data.entryNumber === 'number' ? a.data.entryNumber : null;
		const numB = typeof b.data.entryNumber === 'number' ? b.data.entryNumber : null;

		if (numA !== null && numB !== null) {
			return numB - numA; // Higher entry number first (e.g. #12, #11, #10...)
		}
		if (numA !== null) return -1;
		if (numB !== null) return 1;

		return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
	});
}

/**
 * Sorts blog posts by entryNumber ascending (oldest entries first: #1, #2...).
 */
export function sortPostsAscending(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
	return [...posts].sort((a, b) => {
		const numA = typeof a.data.entryNumber === 'number' ? a.data.entryNumber : null;
		const numB = typeof b.data.entryNumber === 'number' ? b.data.entryNumber : null;

		if (numA !== null && numB !== null) {
			return numA - numB; // Lower entry number first (e.g. #1, #2...)
		}
		if (numA !== null) return -1;
		if (numB !== null) return 1;

		return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
	});
}
