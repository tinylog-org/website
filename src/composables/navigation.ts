import { getDefaultVersion } from './version.ts'
import type { Frontmatter } from '../types/frontmatter'
import type { NavigationEntry } from '../types/navigation'
import type { MDXInstance } from 'astro'

export type FlatEntry = {
    url: string
    title: string | undefined
    description: string | undefined
    parent: string | undefined
    index: number | undefined
}

export function isVisible(entry: NavigationEntry): boolean {
    return !!entry.title && entry.index !== undefined
}

export function isInPathname(url: URL, entry: NavigationEntry): boolean {
    if (entry.url === url.pathname) {
        return true
    }

    if (entry.url === '/news/' && url.pathname.match(/^\/\d+\/.+/)) {
        return true
    }

    for (let parent = entry.parent; parent !== null; parent = parent.parent) {
        if (parent.url === url.pathname) {
            return true
        }
    }

    for (const child of entry.children) {
        if (isInPathname(url, child)) {
            return true
        }
    }

    return false
}

export function loadSubNavigation(url: URL, entries = loadNavigation(url)): NavigationEntry[] | undefined {
    for (const entry of entries) {
        if (url.pathname === entry.url) {
            return entry.children
        }

        const result = loadSubNavigation(url, entry.children)
        if (result) {
            return result
        }
    }

    return undefined
}

export function loadSameChildLevelNavigation(url: URL, entries = loadNavigation(url)): NavigationEntry[] | undefined {
    for (const entry of entries) {
        if (url.pathname === entry.url) {
            const filteredEntries = entries.filter(entry => entry.index)
            return entry.parent && filteredEntries.length > 0 ? filteredEntries : undefined
        }

        const result = loadSameChildLevelNavigation(url, entry.children)
        if (result) return result
    }

    return undefined
}

export function loadNavigation(url: URL): NavigationEntry[] {
    const version = getDefaultVersion(url)
    const prefix = `/${version}/`

    const pageRecords = import.meta.glob<MDXInstance<Frontmatter>>(['/src/pages/**/*'], { eager: true })
    const flatEntries: FlatEntry[] = Object.values(pageRecords)
        .filter((page) => {
            const path = `${page.url}`
            return !path.match(/^\/v\d+\//) || path.startsWith(prefix)
        })
        .map(page => ({
            url: `${page.url}` || '/',
            title: page.frontmatter?.navigationTitle || page.frontmatter?.title,
            description: page.frontmatter?.description,
            parent: page.frontmatter?.navigationParent,
            index: page.frontmatter?.navigationIndex,
        }))

    const mappedEntries = new Map<string, NavigationEntry>()
    for (const entry of flatEntries) {
        mappedEntries.set(entry.url, {
            ...entry,
            parent: null,
            children: [],
        })
    }

    const rootEntries: NavigationEntry[] = []
    for (const flatEntry of flatEntries) {
        const navigationEntry = mappedEntries.get(flatEntry.url)
        if (!navigationEntry) continue

        if (flatEntry.parent) {
            const parent = `/${flatEntry.parent}/`.replace(/\/+/, '/')
            const parentEntry = mappedEntries.get(parent)
            if (parentEntry) {
                navigationEntry.parent = parentEntry
                parentEntry.children.push(navigationEntry)
                continue
            }
        }

        rootEntries.push(navigationEntry)
    }

    return sort(rootEntries)
}

function sort(entries: NavigationEntry[]): NavigationEntry[] {
    entries.sort((first, second) => {
        if (first.index !== undefined && second.index !== undefined) {
            return first.index - second.index
        } else if (first.index !== undefined) {
            return -1
        } else if (second.index !== undefined) {
            return +1
        } else {
            return 0
        }
    })

    entries.forEach(entry => sort(entry.children))

    return entries
}
