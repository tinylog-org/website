import config from '../../tinylog.json'
import type { MappedVersion, Type, Version } from '../types/version'

export function getDefaultVersion(url: URL): Version {
    const versions = Object.keys(config.versions) as Version[]
    const pathVersion = versions.find(version => url.pathname.startsWith(`/${version}/`))
    return pathVersion || config.defaultVersion as Version
}

export function getAllMajorVersions(): string[] {
    return Object.keys(config.versions).map(version => version.replace('v', ''))
}

export function getAllFullVersions(): MappedVersion[] {
    return Object.entries(config.versions)
        .flatMap(([key, { current, preview }]) => ([
            { version: current, branch: key as Version, type: 'current' as Type },
            ...current === preview ? [] : [{ version: preview, branch: key as Version, type: 'preview' as Type }],
        ]))
}

export function resolveFullVersion(version: Version, type: Type): string {
    return config.versions[version][type]
}
