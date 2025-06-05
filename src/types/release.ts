export type ReleaseJson = {
    assets: ReleaseAsset[]
}

export type ReleaseAsset = {
    name: string
    browser_download_url: string
    size: number
}
