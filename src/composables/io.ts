import { create } from 'flat-cache'

const fetchCache = new Map<string, Promise<Response>>()
const fileCache = create({ cacheDir: './.cache', cacheId: 'file-cache', ttl: 5 * 60 * 1000 })
const jsonCache = create({ cacheDir: './.cache', cacheId: 'json-cache', ttl: 5 * 60 * 1000 })

export async function fetchFile(url: string) {
    const storedPromise = fetchCache.get(url)
    if (storedPromise) await storedPromise

    let content = fileCache.get(url)

    if (content === undefined) {
        const newPromise = fetch(url)
        fetchCache.set(url, newPromise)

        const response = await newPromise
        content = await response.text()

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
        }

        fileCache.set(url, content)
        fileCache.save()
    }

    return content as string
}

export async function fetchJson<T extends object>(url: string) {
    const storedPromise = fetchCache.get(url)
    if (storedPromise) await storedPromise

    let content = jsonCache.get(url)

    if (content === undefined) {
        const newPromise = fetch(url)
        fetchCache.set(url, newPromise)

        const response = await newPromise
        content = await response.json() as object

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
        }

        jsonCache.set(url, content)
        jsonCache.save()
    }

    return content as T
}

export function formatFileSize(bytes: number) {
    return bytes >= 1_000 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
        : `${(bytes / 1024).toFixed(0)} KB`
}
