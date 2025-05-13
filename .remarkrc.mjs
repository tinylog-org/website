import remarkCustomHeaderId from 'remark-custom-header-id'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdx from 'remark-mdx'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'

export default {
    plugins: [
        // Plugins
        remarkFrontmatter,
        remarkMdx,
        remarkCustomHeaderId,

        // Presets
        remarkPresetLintConsistent,
        remarkPresetLintRecommended,
    ],
}
