import { Offcanvas } from 'bootstrap'

const tocLinks = document.querySelectorAll('.navbar-toc .toc-link')
const headings = document.querySelectorAll([1, 2, 3].map(i => `.page > h${i}`).join(', '))

let activeHeadingIndex = undefined

function findCurrentHeading(): number {
    for (let index = 1; index < headings.length; index++) {
        const heading = headings[index]
        if (heading.getBoundingClientRect().y >= window.innerHeight / 3) {
            return index - 1
        }
    }

    return headings.length - 1
}

function updateTocLink(currentHeading: Element, link: Element) {
    const href = link.getAttribute('href')
    if ((currentHeading.id && href === '#' + currentHeading.id) || link.textContent === currentHeading.textContent) {
        link.classList.add('active')
    } else {
        link.classList.remove('active')
    }
}

function updateTocLinks() {
    const headingIndex = findCurrentHeading()

    if (headingIndex !== activeHeadingIndex) {
        const heading = headings[headingIndex]
        tocLinks.forEach(link => updateTocLink(heading, link))
        activeHeadingIndex = headingIndex
    }
}

function closeOffcanvas() {
    /*
     * Disable smooth scrolling for two reasons:
     * 1) There is a known bug: https://github.com/twbs/bootstrap/issues/36681
     * 2) The animated slide-in of the offcanvas and the animated scrolling of the body to the anchor are too many
     *    visual effects at once (actually quite annoying to see everytime on mobile devices).
     */

    const offset = Offcanvas.getInstance('#toc-navbar')
    if (offset) {
        document.documentElement.classList.add('no-smooth-scrolling-lg')
        Offcanvas.getInstance('#toc-navbar').hide()
        setTimeout(() => document.documentElement.classList.remove('no-smooth-scrolling-lg'))
    }
}

function registerOffcanvasClosing() {
    tocLinks.forEach((link) => {
        const href = link.getAttribute('href')
        if (href && href.startsWith('#')) {
            link.addEventListener('click', closeOffcanvas)
        }
    })
}

export const init = () => {
    if (tocLinks.length > 0 && headings.length > 0) {
        window.addEventListener('scroll', updateTocLinks)
        updateTocLinks()
    }

    if (tocLinks.length > 0) {
        registerOffcanvasClosing()
    }
}
