import { getDefaultVersion, resolveVersion } from './version.ts'
import type { CurrentPage, PreviewPage, VersionedPagePair } from '../types/version.ts'
import type { Page } from 'astro'

export function isPreview(url: URL) {
    return !!url.pathname.match(/-preview\/$/)
}

export function findVersionedPagePair(url: URL): [undefined, undefined] | VersionedPagePair {
    const currentPathname = `${url.pathname}`.replace(/-preview\/$/, '/')
    const previewPathname = currentPathname.replace(/\/$/, '-preview/')

    const pages = import.meta.glob<Page>(['/src/pages/**/*'], { eager: true })
    const urls = Object.values(pages).map(page => `${page.url}`)
    const currentUrl = urls.find(url => url === currentPathname)
    const previewUrl = urls.find(url => url === previewPathname)

    if (!currentUrl || !previewUrl) return [undefined, undefined]

    const version = getDefaultVersion(url)

    const currentPage: CurrentPage = {
        url: currentUrl,
        version: resolveVersion(version, 'current'),
        type: 'current',
    }

    const previewPage: PreviewPage = {
        url: previewUrl,
        version: resolveVersion(version, 'preview'),
        type: 'preview',
    }

    return [currentPage, previewPage]
}
