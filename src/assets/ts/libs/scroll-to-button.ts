import { lenis } from "./smooth-scroll"

document.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('[data-scroll-to]') as unknown as NodeListOf<HTMLButtonElement>

    for (const button of btns) {
        button.addEventListener('click', () => {
            const id = button.dataset.scrollTo

            if (!id) return

            const el = document.querySelector(id) as HTMLElement | undefined

            if (!el) return

            lenis.scrollTo(el, {
                offset: -100
            })
        })
    }
})