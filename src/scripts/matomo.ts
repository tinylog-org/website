declare global {
    interface Window {
        _paq: Array<[string] | [string, string]>
    }
}

const parameters = window._paq = window._paq || []
parameters.push(['setRequestMethod', 'GET'])
parameters.push(['setTrackerUrl', `/count-php`])
parameters.push(['setSiteId', '2'])
parameters.push(['trackPageView'])
parameters.push(['enableLinkTracking'])

export function init() {
    const firstScriptElement = document.getElementsByTagName('script')[0]
    if (!firstScriptElement?.parentNode) return

    const newScriptElement = document.createElement('script')
    newScriptElement.async = true
    newScriptElement.src = `/count-js`
    firstScriptElement.parentNode.insertBefore(newScriptElement, firstScriptElement)
}
