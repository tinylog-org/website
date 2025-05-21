export function init() {
    const pathBranch = document.location.pathname.match(/^\/v(\d+)\//)?.at(1)
    if (pathBranch) {
        sessionStorage.setItem('branch', pathBranch)
        return
    }

    const sessionBranch = sessionStorage.getItem('branch')
    if (!sessionBranch) return

    const version = sessionBranch.replace(/^v(\d+)/, '$1')

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
}
