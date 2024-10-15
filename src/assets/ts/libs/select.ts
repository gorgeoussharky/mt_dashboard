declare global {
    interface Window {
        initSelects?: () => void
    }
}

export const selectOption = (
    select: HTMLElement,
    targetButton: HTMLElement,
    hiddenInput?: HTMLInputElement,
) => {
    const control = select.querySelector('.select__control') as
        | HTMLButtonElement
        | HTMLInputElement
        | undefined

    const btns = select.querySelectorAll(
        '.select__btn',
    ) as unknown as NodeListOf<HTMLElement>

    const { value, label } = targetButton.dataset

    if (!control || !label || !value) return

    for (const el of btns) {
        el.classList.remove('select__btn--active')
    }
    targetButton.classList.add('select__btn--active')

    if (hiddenInput) {
        hiddenInput.value = value
        hiddenInput?.dispatchEvent(new Event('change', { bubbles: true }))
    }

    if (control?.tagName && control.tagName === 'INPUT') {
        control.value = label
    } else {
        control.innerHTML = label
    }

    select?.classList.remove('select--active')
    control?.classList.remove('select__control--placeholder')
}

const initSelect = (
    isPreselect: boolean,
    btns: NodeListOf<HTMLElement>,
    toggler: HTMLButtonElement | HTMLInputElement | undefined,
    hiddenInput: HTMLInputElement | undefined,
) => {
    if (!isPreselect) return

    const activeButton = [...btns].find(
        el => el.dataset.label?.trim() === toggler?.textContent?.trim(),
    )

    if (!activeButton) return
    for (const el of btns) {
        el.classList.remove('select__btn--active')
    }
    activeButton.classList.add('select__btn--active')

    if (!hiddenInput) return
    hiddenInput.value = activeButton.dataset.value ?? ''
}

const initSelects = () => {
    const selects = document.querySelectorAll(
        '.select',
    ) as unknown as NodeListOf<HTMLElement>

    for (const select of selects) {
        const control = select.querySelector('.select__control') as
            | HTMLButtonElement
            | HTMLInputElement
            | undefined
        const dropdown = select.querySelector('.select__dropdown') as
            | HTMLDivElement
            | undefined
        const hiddenInput = select.querySelector('.select__input') as
            | HTMLInputElement
            | undefined
        const btns = dropdown?.querySelectorAll(
            '.select__btn',
        ) as unknown as NodeListOf<HTMLElement>

        if (control?.classList.contains('initialized')) continue

        const isPreselect = !select.classList.contains('select--placeholder')

        // If select is preselected = add active class to dropdpdown menu item => set input value
        initSelect(isPreselect, btns, control, hiddenInput)

        // eslint-disable-next-line unicorn/consistent-function-scoping
        const handleTabChange = () => {
            if (!hiddenInput) return

            for (const el of btns) {
                el.classList.remove('select__btn--active')
            }

            const targetButton = dropdown?.querySelector(
                `.select__btn[data-value="${hiddenInput.value}"]`,
            ) as HTMLElement | undefined

            if (!targetButton || !control) return

            const { label } = targetButton.dataset
            targetButton?.classList.add('select__btn--active')

            control.innerHTML = label ?? ''
        }

        const handleTogglerClick = () => {
            select?.classList.toggle('select--active')
        }

        const handleDocumentClick = (event: MouseEvent) => {
            if (select?.contains(event.target as HTMLElement)) return

            select?.classList.remove('select--active')
        }

        // eslint-disable-next-line unicorn/consistent-function-scoping
        const handleInput = (event: Event) => {
            const { value } = event.target as HTMLInputElement

            for (const el of btns) {
                if (value.length === 0) {
                    el.style.display = 'block'
                    continue
                }

                const { label } = el.dataset

                if (!label) continue

                el.style.display =
                    label.trim().toLowerCase().slice(0, value.length) ===
                    value.trim().toLowerCase()
                        ? 'block'
                        : 'none'
            }
        }

        if (control?.tagName && control.tagName === 'INPUT') {
            control.addEventListener('input', handleInput)
        }

        for (const el of btns) {
            const handleOptionClick = () => {
                selectOption(select, el, hiddenInput)
            }

            el.addEventListener('click', handleOptionClick)
        }

        hiddenInput?.addEventListener('tabChange', handleTabChange)

        control?.addEventListener('click', handleTogglerClick)

        document.addEventListener('click', handleDocumentClick)

        control?.classList.add('initialized')
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSelects()
})

window.initSelects = initSelects
