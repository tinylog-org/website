export type TabItem = {
    identifier: string
    title: string
    language?: string
    content: string
}

export type TabItems = [TabItem, ...TabItem[]]
