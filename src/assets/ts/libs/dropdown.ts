import { computePosition, offset, flip, autoUpdate } from '@floating-ui/dom'

document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('[data-dropdown]')

    for (const dropdown of dropdowns) {
        const tooltip = dropdown.querySelector('[data-dropdown-tooltip]') as
            | HTMLDivElement
            | undefined

        if (!tooltip) continue

        autoUpdate(dropdown, tooltip, () => {
            void (async () => {
                const { x, y } = await computePosition(dropdown, tooltip, {
                    placement: 'bottom-start',
                    middleware: [offset(10), flip()],
                })

                Object.assign(tooltip.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                })
            })
        })
    }
})
