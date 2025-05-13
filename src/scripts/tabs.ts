function loadSettings(): Record<string, string> {
    const value = localStorage.getItem('tabs')
    if (value) {
        return JSON.parse(value)
    } else {
        return {}
    }
}

function updateSettings(key: string, value: string) {
    const settings = loadSettings()
    settings[key] = value
    localStorage.setItem('tabs', JSON.stringify(settings))
}

function findTabsElement(element: HTMLElement) {
    if (element.dataset.tabGroup) return element
    if (element.parentElement) return findTabsElement(element.parentElement)

    return null
}

function getActiveTitle(activeGroup: string, activeItem: string) {
    return document
        .querySelector('[data-tab-group="' + activeGroup + '"] [data-tab-item="' + activeItem + '"]')
        ?.textContent
}

function updateTab(element: Element, activeItem: string) {
    if (!(element instanceof HTMLElement)) return

    if (element.dataset.tabItem === activeItem) {
        element.classList.add('active')
        if (element.ariaSelected) {
            element.ariaSelected = 'true'
        }
    } else {
        element.classList.remove('active')
        if (element.ariaSelected) {
            element.ariaSelected = 'false'
        }
    }
}

function activateTab(group: string, item: string) {
    const title = getActiveTitle(group, item)

    if (title) {
        document
            .querySelectorAll('[data-tab-group="' + group + '"] > thead [data-tab-item]')
            .forEach(element => updateTab(element, item))

        document
            .querySelectorAll('[data-tab-group="' + group + '"] > tbody > tr > td[data-tab-item]')
            .forEach(element => updateTab(element, item))

        document
            .querySelectorAll('[data-tab-group="' + group + '"] > thead .dropdown-toggle')
            .forEach(element => element.textContent = title)

        updateSettings(group, item)
    }
}

function preventScrolling(element: HTMLElement, action: () => void) {
    const top = element.getBoundingClientRect().top

    action()

    document.documentElement.classList.add('no-smooth-scrolling')
    document.documentElement.scrollTop = element.offsetTop - top
    document.documentElement.classList.remove('no-smooth-scrolling')
}

function handleTabEvent(event: UIEvent) {
    event.preventDefault()

    const tab = event.target as HTMLElement
    if (!tab) return

    const parent = tab.parentElement
    if (!parent) return

    const tabs = findTabsElement(parent)
    if (!tabs) return

    const group = tabs.dataset.tabGroup
    if (!group) return

    const item = tab.dataset.tabItem
    if (!item) return

    preventScrolling(tabs, () => activateTab(group, item))
}

function onClick(event: UIEvent) {
    handleTabEvent(event)
}

function onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
        handleTabEvent(event)
    }
}

function registerTabs() {
    document
        .querySelectorAll('[data-tab-group] [data-tab-item]')
        .forEach((tab) => {
            if (tab instanceof HTMLElement) {
                tab.addEventListener('click', onClick)
                tab.addEventListener('keypress', onKeyPress)
            }
        })
}

function initializeTabs() {
    const settings = loadSettings()
    for (const [group, item] of Object.entries(settings)) {
        activateTab(group, item)
    }
}

export function init() {
    registerTabs()
    initializeTabs()
}
