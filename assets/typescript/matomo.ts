declare global {
    interface Window {
        _paq: Array<[string] | [string, string]>
    }
}

const regexResult = /^\/v(\d+)\//.exec(window.location.pathname)
const version = regexResult[1]
const parameters = window._paq = window._paq || []
parameters.push(['setRequestMethod', 'GET'])
parameters.push(['setTrackerUrl', `//tinylog.org/v${version}/count-php`])
parameters.push(['setSiteId', version])
parameters.push(['trackPageView'])
parameters.push(['enableLinkTracking'])

export function init() {
    const firstScriptElement = document.getElementsByTagName('script')[0]
    const newScriptElement = document.createElement('script')
    newScriptElement.async = true
    newScriptElement.src = `//tinylog.org/v${version}/count-js`
    firstScriptElement.parentNode.insertBefore(newScriptElement, firstScriptElement)
}
