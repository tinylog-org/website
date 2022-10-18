import {Popover, Tooltip} from 'bootstrap'

document
    .querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(element => new Popover(element))

document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach(element => new Tooltip(element))
