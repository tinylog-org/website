export type SlugHeading = {
    slug: string
    text: string
    depth: number
}

export type NestedHeading = {
    link: string
    text: string
    children: NestedHeading[]
}
