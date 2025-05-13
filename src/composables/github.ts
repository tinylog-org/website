import { fetchFile } from './io.ts'
import { resolveVersion } from './version.ts'
import type { Type, Version } from '../types/version.ts'

export function resolveGitHubUrl(path: string, version: Version, type: Type) {
    const tag = resolveVersion(version, type)
    return `https://github.com/tinylog-org/tinylog/tree/${tag}/${path}`
}

export async function fetchGitHubFile(path: string, version: Version, type: Type) {
    const tag = resolveVersion(version, type)
    const url = `https://raw.githubusercontent.com/tinylog-org/tinylog/${tag}/${path}`
    return fetchFile(url)
}
