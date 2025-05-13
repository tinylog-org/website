export function resolveJavadocUrl(className: string) {
    const path = className.replace(/\./g, '/')

    if (className.startsWith('org.tinylog.')) {
        return `https://tinylog.org/javadoc/${path}.html`
    } else {
        const module = getJavaModule(className)
        return `https://docs.oracle.com/en/java/javase/17/docs/api/${module}/${path}.html`
    }
}

function getJavaModule(className: string) {
    if (className.match(/^java\.(lang|text|time|util)/)) {
        return 'java.base'
    } else if (className.startsWith('java.sql.')) {
        return 'java.sql'
    } else {
        throw new Error(`Unknown Java module for class: ${className}`)
    }
}
