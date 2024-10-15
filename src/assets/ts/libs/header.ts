import { animate } from 'motion'

let isTransitioning = false
let previousY = 0

const headerSlide = async (type: 'in' | 'out') => {
    const header = document.querySelector('.header') as HTMLElement | undefined
    const topbar = document.querySelector('.header__topbar') as
        | HTMLElement
        | undefined

    if (!header || !topbar) return

    isTransitioning = true

    switch (type) {
        case 'out':
            await animate(
                header,
                { y: -topbar.offsetHeight },
                { duration: 0.5 },
            ).finished
            break
        case 'in':
            await animate(header, { y: 0 }, { duration: 0.5 }).finished
            break
        default:
            break
    }

    isTransitioning = false
}

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header') as HTMLElement | undefined

    // Check if header is white on page load
    const isHeaderWhite = header?.classList.contains('header--white')

    header?.addEventListener('mouseenter', () => {
        if (!window.matchMedia('(hover: hover)').matches) return
        header.classList.add('header--white')
    })

    header?.addEventListener('mouseleave', () => {
        if (isHeaderWhite) return
        header.classList.remove('header--white')
    })

    document.addEventListener('scroll', () => {
        if (window.scrollY < 50) {
            header?.classList.remove('header--active')

            if (!isTransitioning) {
                void headerSlide('in')
            }
        } else {
            header?.classList.add('header--active')
        }

        if (isTransitioning) return

        if (window.scrollY < previousY) {
            void headerSlide('in')
        } else if (window.scrollY > previousY) {
            void headerSlide('out')
        }

        previousY = window.scrollY
    })
})
