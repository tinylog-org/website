import Tooltip from 'bootstrap/js/dist/tooltip'

function showSuccess(button: HTMLElement) {
    button.classList.remove('failed')
    button.classList.add('success')
    Tooltip.getInstance(button)?.setContent({ '.tooltip-inner': 'Copied successfully' })
}

function showError(button: HTMLElement, reason: Error | string) {
    button.classList.remove('success')
    button.classList.add('failed')

    const message = (reason as Error).message || reason
    Tooltip.getInstance(button)?.setContent({ '.tooltip-inner': 'Copying failed: ' + message })
}

function copyCode(event: UIEvent) {
    const button = event.currentTarget as HTMLElement

    const code = button.parentElement?.querySelector('code')
    if (!code) return

    const pre = code.parentElement
    if (pre?.tagName?.toLowerCase() !== 'pre') return

    let text = code.textContent
    if (!text) return

    if (pre.dataset['language'] === 'properties') {
        text = text.replace(/\s+#\s.*$/gm, '')
    }

    navigator.clipboard
        .writeText(text)
        .then(() => showSuccess(button), reason => showError(button, reason))
}

function resetButton(event: UIEvent) {
    const button = event.target as HTMLElement
    button.classList.remove('success', 'failed')
    Tooltip.getInstance(button)?.setContent({ '.tooltip-inner': button.ariaLabel })
}

function registerCopyButtons() {
    document
        .querySelectorAll('.copy-button')
        .forEach((button) => {
            if (button instanceof HTMLElement) {
                button.addEventListener('click', copyCode)
                button.addEventListener('blur', resetButton)
            }
        })
}

export { registerCopyButtons as init }
