import { fetchFile } from './io'
import { resolveFullVersion } from './version'
import type { Type, Version } from '../types/version'

export function resolveGitHubUrl(path: string, version: Version, type: Type) {
    const tag = resolveFullVersion(version, type)
    return `https://github.com/tinylog-org/tinylog/tree/${tag}/${path}`
}

export async function fetchGitHubFile(path: string, version: Version, type: Type) {
    const tag = resolveFullVersion(version, type)
    const url = `https://raw.githubusercontent.com/tinylog-org/tinylog/${tag}/${path}`
    return fetchFile(url)
}
