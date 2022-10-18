import {Tooltip} from 'bootstrap'

function showSuccess(button: HTMLElement) {
    button.classList.remove('failed')
    button.classList.add('success')
    Tooltip.getInstance(button).setContent({'.tooltip-inner': 'Copied successfully'})
}

function showError(button: HTMLElement, reason: Error|string) {
    button.classList.remove('success')
    button.classList.add('failed')

    const message = (reason as Error).message || reason
    Tooltip.getInstance(button).setContent({'.tooltip-inner': 'Copying failed: ' + message})
}

function copyCode(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement
    const code = button.parentElement.querySelector('code')

    let text = code.textContent
    if (code.dataset['lang'] === 'properties') {
        text = text.replace(/\s+#\s.*$/gm, '')
    }

    navigator.clipboard
        .writeText(text)
        .then(() => showSuccess(button), reason => showError(button, reason))
}

function resetButton(event: FocusEvent) {
    const button = event.target as HTMLElement
    button.classList.remove('success', 'failed')

    const tooltip = Tooltip.getInstance(button)
    tooltip.setContent({'.tooltip-inner': button.ariaLabel})
}

function registerCopyButtons() {
    document
        .querySelectorAll('.copy-button')
        .forEach(button => {
            button.addEventListener('click', copyCode)
            button.addEventListener('blur', resetButton)
        })
}

registerCopyButtons()
