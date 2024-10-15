import { animate } from 'motion'

const getHiddenTabHeight = (tab: HTMLElement) => {
    const basePosition = getComputedStyle(tab).position

    tab.style.opacity = '0'
    tab.style.position = 'absolute'
    tab.style.display = 'block'

    const height = tab.clientHeight

    tab.style.display = 'none'
    tab.style.position = basePosition
    tab.style.opacity = '0'

    return height
}

const animateTabChange = async (
    wrap: HTMLElement,
    tabContent: HTMLDivElement,
    list?: HTMLElement,
    duration?: number,
) => {
    const allTabContents = wrap.querySelectorAll('[data-tab-content]')

    const listHeight = list?.clientHeight ?? 0

    const height = getHiddenTabHeight(tabContent)

    if (duration !== 0) {
        wrap.style.height = `${height + listHeight + 20}px`
    }

    await animate(
        allTabContents,
        { opacity: 0, y: 20, display: 'none' },
        { duration: duration ?? 0.5 },
    ).finished

    await animate(
        tabContent,
        { opacity: 1, y: 0, display: 'block' },
        { duration: duration ?? 0.5 },
    ).finished

    const event = new CustomEvent('tabChange')

    tabContent.dispatchEvent(event)
}

const setTabsHeight = () => {
    const tabs = document.querySelectorAll(
        '[data-tabs]',
    ) as unknown as NodeListOf<HTMLDivElement>

    for (const singleTab of tabs) {
        const list = singleTab.querySelector('[data-tabs-list]') as
            | HTMLElement
            | undefined

        const tabContents = singleTab.querySelectorAll(
            '[data-tab-content]',
        ) as unknown as NodeListOf<HTMLElement>

        const listHeight = list?.clientHeight ?? 0

        const activeTab = [...tabContents].find(
            tab => getComputedStyle(tab).display !== 'none',
        )

        if (activeTab) {
            singleTab.style.height = `${activeTab.clientHeight + listHeight}px`
        }
    }
}

window.addEventListener('resize', setTabsHeight)

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll(
        '[data-tabs]',
    ) as unknown as NodeListOf<HTMLDivElement>

    for (const singleTab of tabs) {
        const btns = singleTab.querySelectorAll(
            '[data-tab]',
        ) as unknown as NodeListOf<HTMLButtonElement>

        const list = singleTab.querySelector('[data-tabs-list]') as
            | HTMLElement
            | undefined

        const selectInput = singleTab.querySelector('.select__input') as
            | HTMLInputElement
            | undefined

        // Select first active tab (if exists) => fade required tab
        const init = () => {
            const activeButton = [...btns].find(el =>
                el.classList.contains('active'),
            )

            if (!activeButton) return

            const { tab } = activeButton.dataset

            const tabContent = singleTab.querySelector(
                `[data-tab-content="${tab}"]`,
            ) as HTMLDivElement | undefined

            if (!tabContent) return

            if (selectInput && tab) {
                selectInput.value = tab
                selectInput.dispatchEvent(new Event('tabChange'))
            }

            void animateTabChange(singleTab, tabContent, list, 0)
        }

        init()

        selectInput?.addEventListener('change', () => {
            const tab = selectInput.value

            if (!tab) return

            const tabContent = singleTab.querySelector(
                `[data-tab-content="${tab}"]`,
            ) as HTMLDivElement | undefined

            if (!tabContent) return

            for (const active of btns) {
                active.classList.remove('active')
            }

            singleTab
                .querySelector(`[data-tab="${tab}"]`)
                ?.classList.add('active')

            void animateTabChange(singleTab, tabContent, list)
        })

        for (const button of btns) {
            button.addEventListener('click', () => {
                const { tab } = button.dataset

                if (!tab) return

                for (const active of btns) {
                    active.classList.remove('active')
                }

                button.classList.add('active')

                const tabContent = singleTab.querySelector(
                    `[data-tab-content="${tab}"]`,
                ) as HTMLDivElement | undefined

                if (!tabContent) return

                if (selectInput) {
                    selectInput.value = tab
                    selectInput.dispatchEvent(new Event('tabChange'))
                }

                void animateTabChange(singleTab, tabContent, list)
            })
        }
    }
})
