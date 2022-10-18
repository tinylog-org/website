interface Settings {
    [key: string]: string
}

function loadSettings(): Settings {
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

function findTabsElement(element: HTMLElement): HTMLElement {
    if (element.dataset.tabGroup) {
        return element
    } else {
        return findTabsElement(element.parentElement)
    }
}

function getActiveTitle(activeGroup: string, activeItem: string): string {
    return document
        .querySelector('[data-tab-group="' + activeGroup + '"] [data-tab-item="' + activeItem + '"]')
        ?.textContent
}

function updateTab(element: HTMLElement, activeItem: string) {
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
            .querySelectorAll('[data-tab-group="' + group + '"] [data-tab-item]')
            .forEach((element: HTMLElement) => updateTab(element, item))

        document
            .querySelectorAll('[data-tab-group="' + group + '"] .dropdown-toggle')
            .forEach((element: HTMLElement) => element.textContent = title)

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
    const item = tab.dataset.tabItem

    const tabs = findTabsElement(tab.parentElement)
    const group = tabs.dataset.tabGroup

    preventScrolling(tabs, () => activateTab(group, item))
}

function onClick(event: PointerEvent) {
    handleTabEvent(event)
}

function onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ')  {
        handleTabEvent(event)
    }
}

function registerTabs() {
    document
        .querySelectorAll('[data-tab-group] [data-tab-item]')
        .forEach(tab => {
            tab.addEventListener('click', onClick)
            tab.addEventListener('keypress', onKeyPress)
        })
}

function initializeTabs() {
    const settings = loadSettings()
    for (const [group, item] of Object.entries(settings)) {
        activateTab(group, item)
    }
}

registerTabs()
initializeTabs()
