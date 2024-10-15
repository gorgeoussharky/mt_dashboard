import { animate, inView } from 'motion'

document.addEventListener('DOMContentLoaded', () => {
    const fadesLeft = document.querySelectorAll('[data-fade-left]') as unknown as NodeListOf<HTMLElement>
    const fadesRight = document.querySelectorAll('[data-fade-right]') as unknown as NodeListOf<HTMLElement>
    const fadesUp = document.querySelectorAll('[data-fade-up]') as unknown as NodeListOf<HTMLElement>
    const fadesDown = document.querySelectorAll('[data-fade-down]') as unknown as NodeListOf<HTMLElement>
    const duration = 0.5
    const offset = '0px 0px -50px 0px'

    for (const el of fadesLeft) {
        const delay = el.dataset.delay ? Number.parseInt(el.dataset.delay, 10) / 1000 : 0

        animate(el, { opacity: 0, x: 30 }, { duration: 0 })
        inView(el, () => {
            void animate(el, { opacity: 1, x: 0 }, { duration, delay }, )

            return () => animate(el, { opacity: 0, x: 30 }, { duration, delay })
        }, {
            margin: offset,
        })
    }

    for (const el of fadesRight) {
        const delay = el.dataset.delay ? Number.parseInt(el.dataset.delay, 10) / 1000 : 0

        animate(el, { opacity: 0, x: -30 }, { duration: 0 })
        inView(el, () => {
            void animate(el, { opacity: 1, x: 0 }, { duration, delay }, )

            return () => animate(el, { opacity: 0, x: -30 }, { duration, delay })
        }, {
            margin: offset,
        })
    }

    for (const el of fadesUp) {
        const delay = el.dataset.delay ? Number.parseInt(el.dataset.delay, 10) / 1000 : 0

        animate(el, { opacity: 0, y: 30 }, { duration: 0 })
        inView(el, () => {
            void animate(el, { opacity: 1, y: 0 }, { duration, delay }, )

            return () => animate(el, { opacity: 0, y: 30 }, { duration, delay })
        }, {
            margin: offset,
        })
    }

    for (const el of fadesDown) {
        const delay = el.dataset.delay ? Number.parseInt(el.dataset.delay, 10) / 1000 : 0

        animate(el, { opacity: 0, y: -30 }, { duration: 0 })
        inView(el, () => {
            void animate(el, { opacity: 1, y: 0 }, { duration, delay }, )

            return () => animate(el, { opacity: 0, y: -30 }, { duration, delay })
        }, {
            margin: offset,
        })
    }
})
