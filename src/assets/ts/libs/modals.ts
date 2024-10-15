import { animate } from 'motion'

declare global {
    interface Window {
        toggleModal: (type: 'in' | 'out', id: string) => Promise<void>
        reinitModalTogglers: () => void
        reinitModalInteractions: () => void
    }
}

export const toggleModal = async (type: 'in' | 'out', id: string) => {
    const modal = document.querySelector(id) as HTMLDialogElement | undefined
    // const scrollbarWidth = window.innerWidth - document.body.clientWidth
    const otherModals = document.querySelectorAll(
        `.modal:not(${id})[open]`,
    ) as unknown as NodeListOf<HTMLDialogElement>

    if (!modal) return

    switch (type) {
        case 'in':
            modal.showModal()

            for await (const otherModal of otherModals) {
                await toggleModal('out', `#${otherModal.id}`)
            }

            document.documentElement.classList.add('locked')

            modal.style.display = 'flex'
            animate(modal, { opacity: 1 }, { duration: 0.5 })
            break
        case 'out':
            await animate(
                modal,
                { opacity: 0, display: 'none' },
                { duration: 0.5 },
            ).finished

            modal.close()

            document.documentElement.classList.remove('locked')
            break

        default:
    }
}

const clickHandler = (event: MouseEvent) => {
    const { modal } = (event.target as HTMLElement).dataset

    if (modal) {
        void toggleModal('in', `#${modal}`)
    }
}

const initModalTogglers = () => {
    const togglers = document.querySelectorAll(
        '[data-modal]',
    ) as unknown as NodeListOf<HTMLButtonElement>

    for (const toggler of togglers) {
        toggler.addEventListener('click', clickHandler)
    }
}

const initModalInteractions = () => {
    const modals = document.querySelectorAll(
        '.modal',
    ) as unknown as NodeListOf<HTMLDialogElement>

    for (const modal of modals) {
        

        const modalWrap = modal.querySelector('.modal__content')
        const closeBtns = modal.querySelectorAll('[data-modal-close]')

        modal.addEventListener('mousedown', event => {
            const targetEl = event.target as HTMLElement

            if (!modalWrap?.contains(targetEl))
                void toggleModal('out', `#${modal.id}`)
        })

        for (const closeButton of closeBtns) {
            if (closeButton.classList.contains('initialized')) continue

            closeButton.addEventListener('click', () => {
                void toggleModal('out', `#${modal.id}`)
            })
            
            closeButton.classList.add('initialized')
        }

    }
}

document.addEventListener('DOMContentLoaded', () => {
    initModalTogglers()
    initModalInteractions()
})

window.toggleModal = toggleModal
window.reinitModalTogglers = initModalTogglers
window.reinitModalInteractions = initModalInteractions
