import config from '../../tinylog.json'

export type CurrentType = 'current'

export type PreviewType = 'preview'

export type Type = CurrentType | PreviewType

export type Version = keyof typeof config.versions

export type CurrentPage = {
    url: string
    version: string
    type: CurrentType
}

export type PreviewPage = {
    url: string
    version: string
    type: PreviewType
}

export type VersionedPagePair = [CurrentPage, PreviewPage]
