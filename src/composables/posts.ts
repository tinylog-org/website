import type { Frontmatter } from '../types/frontmatter'
import type { MDXInstance } from 'astro'

export type Post = MDXInstance<Frontmatter> & {
    year: string
    month: string
    day: string
    name: string
}

export function loadPosts(): Post[] {
    const posts = import.meta.glob<MDXInstance<Frontmatter>>(['/src/posts/**/*'], { eager: true })
    return Object.values(posts).reverse().map((post) => {
        const groups = post.file.match(/\/(?<year>\d+)-(?<month>\d+)-(?<day>\d+)-(?<name>[^/]+)\.\w+$/)?.groups
        if (!groups?.year || !groups?.month || !groups?.day || !groups?.name) throw new Error(`Invalid post filename: ${post.file}`)

        return {
            ...post,
            year: groups.year,
            month: groups.month,
            day: groups.day,
            name: groups.name,
            file: post.file.replace(/.*\/(src\/.*)/, '$1'),
        }
    })
}
