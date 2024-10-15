export const closeAllAccordions = () => {
    const accordions = document.querySelectorAll('[data-accordion]') as unknown as NodeListOf<HTMLElement>

    for (const accordion of accordions) {
        accordion.classList.remove('active')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('[data-accordion]') as unknown as NodeListOf<HTMLElement>

    for (const accordion of accordions) {
        const toggle = accordion.querySelector('[data-accordion-toggle]') as HTMLButtonElement | undefined
        const content = accordion.querySelector('[data-accordion-content') as HTMLDivElement | undefined

        const isProductAccordion = accordion.parentElement?.classList.contains('single-product__accordion')

        if (!toggle || !content) return



        toggle.addEventListener('click', () => {
            const isActive = accordion.classList.contains('active')

            if (!isProductAccordion) {
                closeAllAccordions()
            }

            if (isActive) {
                accordion.classList.remove('active')
                return
            }

            accordion.classList.add('active')
        })
    }
})