import 'bootstrap/js/dist/dropdown'
import Popover from 'bootstrap/js/dist/popover'
import Tooltip from 'bootstrap/js/dist/tooltip'

export function init() {
    document
        .querySelectorAll('[data-bs-toggle="popover"]')
        .forEach(element => new Popover(element))

    document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach(element => new Tooltip(element))
}
