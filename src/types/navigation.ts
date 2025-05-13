export type NavigationEntry = {
    url: string
    title: string | undefined
    description: string | undefined
    index: number | undefined
    parent: NavigationEntry | null
    children: NavigationEntry[]
}
