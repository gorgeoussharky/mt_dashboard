document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]')
    const toTopBtns = document.querySelectorAll('.top-btn')

    for (const link of links) {
        const linkEl = link as HTMLAnchorElement

        link.addEventListener('click', (error) => {
            if (linkEl.hash) {
                const target = document.querySelector(linkEl.hash) as HTMLElement | undefined

                if (target) {
                    error.preventDefault()
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior:'smooth',
                    })
                }
            }
        })
    }

    for (const button of toTopBtns) {
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior:'smooth',
            })
        })
    }
})
