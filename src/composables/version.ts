import config from '../../tinylog.json'
import type { Type, Version } from '../types/version.ts'

export function getDefaultVersion(url: URL) {
    const versions = Object.keys(config.versions) as Version[]
    const pathVersion = versions.find(version => url.pathname.startsWith(`/${version}/`))
    return pathVersion || config.defaultVersion as Version
}

export function getAllVersions() {
    return Object.keys(config.versions)
}

export function resolveVersion(version: Version, type: Type) {
    return config.versions[version][type]
}
