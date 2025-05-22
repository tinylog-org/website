export function init() {
    const pathBranch = document.location.pathname.match(/^\/v(\d+)\//)?.at(1)
    if (pathBranch) {
        sessionStorage.setItem('branch', pathBranch)
        return
    }

    const sessionBranch = sessionStorage.getItem('branch')
    if (!sessionBranch?.match(/^v(\d+)$/)) return

    const version = sessionBranch.replace(/^v(\d+)$/, '$1')

    document
        .querySelectorAll('.current-version')
        .forEach((element) => {
            if (element instanceof HTMLElement) {
                element.innerText = version
            }
        })

    document
        .querySelectorAll('.available-version')
        .forEach((element) => {
            if (element instanceof HTMLElement) {
                if (element.innerText?.trim() === `tinylog ${version}`) {
                    element.classList.add('active')
                } else {
                    element.classList.remove('active')
                }
            }
        })

    document
        .querySelectorAll('#main-navbar a')
        .forEach((element) => {
            const href = element.getAttribute('href')
            if (href) {
                element.setAttribute('href', href.replace(/^\/v\d+\//, `/${sessionBranch}/`))
            }
        })
}
