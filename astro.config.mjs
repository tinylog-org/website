// @ts-check

import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'
import { h } from 'hastscript'
import { dirname, resolve } from 'path'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeClassNames from 'rehype-class-names'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import remarkCustomHeaderId from 'remark-custom-header-id'
import { visit } from 'unist-util-visit'
import { fileURLToPath } from 'url'

export default defineConfig({
    site: 'https://tinylog.org',
    trailingSlash: 'always',
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },
    integrations: [
        mdx(),
    ],
    markdown: {
        syntaxHighlight: 'prism',
        remarkPlugins: [
            useDefaultLayout,
            remarkCustomHeaderId,
        ],
        rehypePlugins: [
            applyCopyButtons,
            highlightPropertiesComments,
            removeForbiddenIsRawAttributes,
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'append', content: h('span.anchor-link') }],
            [rehypeClassNames, { table: 'table' }],
            [rehypeExternalLinks, { protocols: ['http', 'https', 'mailto'], target: '_blank', rel: ['noopener'] }],
        ],
    },
    build: {
        assets: 'assets',
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    // Should be removed when https://github.com/twbs/bootstrap/issues/40962 is fixed
                    quietDeps: true,
                    silenceDeprecations: ['import'],
                },
            },
        },
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/[hash:20].js',
                    assetFileNames: 'assets/[hash:20][extname]',
                },
            },
        },
    },
})

function useDefaultLayout() {
    /**
     * @param {unknown} _
     * @param {import('vfile').VFile} file
     */
    return function (_, file) {
        const rootDirectory = dirname(fileURLToPath(import.meta.url))
        const pagesDirectory = resolve(rootDirectory, 'src', 'pages')
        if (!resolve(file.path).startsWith(pagesDirectory)) return

        const frontMatter = file.data.astro?.frontmatter
        if (!frontMatter || frontMatter.layout) return

        frontMatter.layout = resolve('src/layouts/PageLayout.astro')
    }
}

function applyCopyButtons() {
    /**
     * @param {import('hast').Root} nodes
     */
    return (nodes) => {
        visit(nodes, 'element', (node) => {
            if (node.tagName === 'pre' && node.properties.dataLanguage) {
                node.children.push(h('button.copy-button', { type: 'button', title: 'Copy to clipboard', dataBsToggle: 'tooltip' }))
            }
        })
    }
}

function highlightPropertiesComments() {
    /**
     * @param {import('hast').Properties} properties
     * @param {string} className
     */
    function hasClassName(properties, className) {
        return Array.isArray(properties?.className) && properties.className.includes(className)
    }

    /**
     * @param {import('hast').Root} nodes
     */
    return (nodes) => {
        visit(nodes, 'element', (node) => {
            if (node.tagName === 'code' && hasClassName(node.properties, 'language-properties')) {
                for (const child of node.children || []) {
                    if (child.type === 'element' && hasClassName(child.properties, 'attr-value')) {
                        const grandchild = child.children?.at(-1)
                        if (grandchild?.type === 'text' && grandchild?.value) {
                            const groups = grandchild.value.match(/(?<text>.+\s+)(?<comment>#\s.*)/)?.groups
                            if (groups?.text && groups?.comment) {
                                child.children.pop()
                                child.children.push({ ...grandchild, value: groups.text })
                                child.children.push(h('span.comment', groups.comment))
                            }
                        }
                    }
                }
            }
        })
    }
}

function removeForbiddenIsRawAttributes() {
    /**
     * @param {import('hast').Root} nodes
     */
    return (nodes) => {
        visit(nodes, 'element', (node) => {
            if (node.tagName === 'code' && Object.prototype.hasOwnProperty.call(node.properties, 'is:raw')) {
                delete node.properties['is:raw']
            }
        })
    }
}
