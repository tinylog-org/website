import type { NestedHeading, SlugHeading } from '../types/headings.ts'

const MAX_DEPTH: number = 3

export function nestHeadings(headings: SlugHeading[]): NestedHeading[] {
    const parents: NestedHeading[] = []
    const roots: NestedHeading[] = []

    for (const heading of headings) {
        if (heading.depth > MAX_DEPTH) continue

        const [parent, index] = findParent(heading, parents)
        const newHeading = createNestedHeading(heading)

        if (parent) {
            parents.length = index + 1
            parent.children.push(newHeading)
        } else {
            parents.length = 0
            roots.push(newHeading)
        }

        parents[heading.depth] = newHeading
    }

    return roots
}

function findParent(heading: SlugHeading, parents: NestedHeading[]): [ undefined, -1 ] | [ NestedHeading, number ] {
    for (let index = heading.depth - 1; index >= 0; index = index - 1) {
        const parent = parents[index]
        if (parent) return [parent, index]
    }

    return [undefined, -1]
}

function createNestedHeading(heading: SlugHeading) {
    return {
        link: `#${heading.slug}`,
        text: heading.text,
        children: [],
    }
}
