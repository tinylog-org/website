import cssNano from 'cssnano'
import inlineSvg from 'postcss-inline-svg'

export default {
    plugins: [
        inlineSvg,
        cssNano,
    ],
}
