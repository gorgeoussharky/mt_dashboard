import type { LngLat, YMap } from '@yandex/ymaps3-types'
import { lenis } from './smooth-scroll'
/* import sprite from '@/assets/img/sprite.svg' */

interface MapMarker {
    coord: LngLat
}

declare global {
    interface Window {
        mapLocations?: MapMarker[]
        mapCenter?: LngLat
        mapZoom?: number
        ymaps3: unknown
        mapInstances: YMap[]
    }
}

window.mapInstances = []

async function initMaps() {
    const containers = document.querySelectorAll('[data-map]')

    if (!containers || !window.ymaps3) return

    await ymaps3.ready

    const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapMarker,
        YMapDefaultFeaturesLayer,
    } = ymaps3

    for (const container of containers) {
        // Иницилиазируем карту
        const map = new YMap(container as HTMLElement, {
            location: {
                center: window.mapCenter ?? [37.617_698, 55.755_864],
                zoom: window.mapZoom ?? 10,
            },
        })

        map.addChild(new YMapDefaultSchemeLayer({ theme: 'light' }))
        map.addChild(new YMapDefaultFeaturesLayer({ zIndex: 1800 }))

        const { mapLocations } = window

        let iconSvg = `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="36" cy="36" r="36" fill="black"/>
            <path d="M46.0764 36.5367C44.363 36.5745 42.6517 36.3952 40.9833 36.0032C39.8847 36.2723 38.8554 36.7708 37.963 37.4658C37.7761 37.6129 37.6073 37.7817 37.4601 37.9687C36.295 39.4619 35.4732 41.4949 35.4609 46.0759V55.6366H36.5311C36.5311 55.6366 38.2942 45.2633 38.8185 43.4757C39.1535 42.3795 39.7526 41.3824 40.5631 40.5719C41.3737 39.7613 42.3708 39.1623 43.467 38.8272C45.2546 38.2998 55.6309 36.5398 55.6309 36.5398H46.0764V36.5367Z" fill="url(#paint0_linear_12735_48454)"/>
            <path d="M55.6412 35.4667C55.6412 35.4667 45.268 33.7066 43.4803 33.1792C42.3835 32.8454 41.3857 32.2467 40.575 31.436C39.7644 30.6254 39.1657 29.6276 38.8319 28.5308C38.3045 26.7431 36.5444 16.3638 36.5444 16.3638V25.9275C36.5828 27.6411 36.4025 29.3526 36.0078 31.0206C36.2776 32.118 36.776 33.1462 37.4704 34.0378C37.6184 34.224 37.7871 34.3927 37.9733 34.5407C39.4666 35.7028 41.4995 36.5245 46.0805 36.5368H55.6412V35.4667Z" fill="url(#paint1_linear_12735_48454)"/>
            <path d="M35.4723 16.3638C35.4723 16.3638 33.7123 26.7401 33.188 28.5277C32.8518 29.6253 32.2508 30.6233 31.4381 31.4339C30.6253 32.2446 29.6257 32.8429 28.5272 33.1762C26.7396 33.7005 16.3633 35.4606 16.3633 35.4606H25.927C27.6392 35.4203 29.3495 35.5975 31.017 35.988C32.1178 35.7218 33.1501 35.2266 34.0465 34.5345C34.2335 34.3874 34.4023 34.2186 34.5494 34.0317C35.7146 32.5384 36.5363 30.5054 36.5486 25.9275V16.3638H35.4723Z" fill="url(#paint2_linear_12735_48454)"/>
            <path d="M35.4657 46.076C35.4276 44.3582 35.6089 42.6425 36.0053 40.9706C35.7335 39.8792 35.2363 38.8566 34.5458 37.9687C34.3988 37.7827 34.2311 37.614 34.046 37.4659C32.5527 36.3007 30.5197 35.482 25.9418 35.4697H16.375V36.5399C16.375 36.5399 26.7513 38.2999 28.5389 38.8273C29.6351 39.1623 30.6323 39.7614 31.4428 40.5719C32.2533 41.3825 32.8524 42.3796 33.1874 43.4758C33.6933 45.196 35.3338 54.8885 35.4657 55.5968V46.076Z" fill="url(#paint3_linear_12735_48454)"/>
            <defs>
            <linearGradient id="paint0_linear_12735_48454" x1="54.1438" y1="45.8214" x2="39.7568" y2="45.8214" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" stop-opacity="0"/>
            <stop offset="1" stop-color="white"/>
            </linearGradient>
            <linearGradient id="paint1_linear_12735_48454" x1="45.826" y1="17.4707" x2="45.826" y2="31.7504" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" stop-opacity="0"/>
            <stop offset="1" stop-color="white"/>
            </linearGradient>
            <linearGradient id="paint2_linear_12735_48454" x1="16.3755" y1="26.182" x2="36.5455" y2="26.182" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" stop-opacity="0"/>
            <stop offset="1" stop-color="white"/>
            </linearGradient>
            <linearGradient id="paint3_linear_12735_48454" x1="26.1902" y1="51.8467" x2="26.1902" y2="38.8917" gradientUnits="userSpaceOnUse">
            <stop stop-color="white"/>
            <stop offset="1" stop-color="white"/>
            </linearGradient>
            </defs>
            </svg>`

        if (container.classList.contains('modal__map-wrap')) {
            iconSvg = `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="34" fill="white" stroke="black" stroke-width="4"/>
                <path d="M44.211 36.4369C42.8151 36.4677 41.4209 36.3216 40.0616 36.0022C39.1666 36.2215 38.328 36.6276 37.601 37.194C37.4487 37.3138 37.3111 37.4514 37.1913 37.6037C36.242 38.8204 35.5725 40.4769 35.5625 44.2096V51.9997H36.4343C36.4343 51.9997 37.8708 43.5475 38.298 42.0909C38.5709 41.1977 39.059 40.3852 39.7193 39.7248C40.3797 39.0644 41.192 38.5763 42.0851 38.3033C43.5415 37.8735 51.9952 36.4394 51.9952 36.4394H44.211V36.4369Z" fill="url(#paint0_linear_12735_47500)"/>
                <path d="M51.9995 35.5653C51.9995 35.5653 43.5483 34.1312 42.0919 33.7014C41.1983 33.4294 40.3854 32.9416 39.7249 32.2811C39.0644 31.6205 38.5767 30.8075 38.3047 29.9138C37.875 28.4572 36.4411 20 36.4411 20V27.7926C36.4724 29.1889 36.3255 30.5834 36.0039 31.9425C36.2237 32.8368 36.6298 33.6745 37.1955 34.401C37.316 34.5527 37.4535 34.6902 37.6052 34.8107C38.8218 35.7577 40.4781 36.4272 44.2103 36.4372H51.9995V35.5653Z" fill="url(#paint1_linear_12735_47500)"/>
                <path d="M35.5684 20C35.5684 20 34.1345 28.4547 33.7073 29.9113C33.4334 30.8056 32.9438 31.6188 32.2816 32.2793C31.6194 32.9398 30.805 33.4274 29.9101 33.6989C28.4537 34.1262 20 35.5603 20 35.5603H27.7917C29.1866 35.5275 30.58 35.6718 31.9386 35.99C32.8354 35.7732 33.6764 35.3696 34.4067 34.8057C34.5591 34.6859 34.6966 34.5483 34.8164 34.396C35.7657 33.1793 36.4352 31.5228 36.4452 27.7926V20H35.5684Z" fill="url(#paint2_linear_12735_47500)"/>
                <path d="M35.5612 44.2097C35.5302 42.81 35.6779 41.4121 36.0009 40.0498C35.7794 39.1605 35.3743 38.3273 34.8118 37.6039C34.692 37.4522 34.5554 37.3148 34.4046 37.1941C33.188 36.2447 31.5317 35.5776 27.802 35.5676H20.0078V36.4396C20.0078 36.4396 28.4615 37.8737 29.9179 38.3034C30.811 38.5764 31.6234 39.0646 32.2837 39.725C32.944 40.3854 33.4321 41.1979 33.7051 42.091C34.1173 43.4927 35.4538 51.3902 35.5612 51.9674V44.2097Z" fill="url(#paint3_linear_12735_47500)"/>
                <defs>
                <linearGradient id="paint0_linear_12735_47500" x1="50.7836" y1="44.0022" x2="39.0624" y2="44.0022" gradientUnits="userSpaceOnUse">
                <stop stop-color="#222222" stop-opacity="0"/>
                <stop offset="1" stop-color="#222222"/>
                </linearGradient>
                <linearGradient id="paint1_linear_12735_47500" x1="44.0029" y1="20.9019" x2="44.0029" y2="32.5372" gradientUnits="userSpaceOnUse">
                <stop stop-color="#222222" stop-opacity="0"/>
                <stop offset="1" stop-color="#222222"/>
                </linearGradient>
                <linearGradient id="paint2_linear_12735_47500" x1="20.01" y1="28" x2="36.4427" y2="28" gradientUnits="userSpaceOnUse">
                <stop stop-color="#222222" stop-opacity="0"/>
                <stop offset="1" stop-color="#222222"/>
                </linearGradient>
                <linearGradient id="paint3_linear_12735_47500" x1="28.0043" y1="48.9118" x2="28.0043" y2="38.3559" gradientUnits="userSpaceOnUse">
                <stop stop-color="#222222"/>
                <stop offset="1" stop-color="#222222"/>
                </linearGradient>
                </defs>
                </svg>
                `
        }

        if (mapLocations) {
            for (const location of mapLocations) {
                const icon = document.createElement('div')
                icon.innerHTML = iconSvg
                icon.classList.add('map__marker')

                const marker = new YMapMarker(
                    {
                        coordinates: location.coord,
                    },
                    icon,
                )

                map.addChild(marker)
            }
        }

        window.mapInstances.push(map)
    }


}

document.addEventListener('DOMContentLoaded', () => {
    void initMaps()

    const geoBtns = document.querySelectorAll('[data-geo]') as unknown as NodeListOf<HTMLButtonElement>

    for (const geoButton of geoBtns) {
        geoButton.addEventListener('click', () => {

            const mapContainer = document.querySelector('[data-map]') as HTMLElement | undefined
            const { geo } = geoButton.dataset

            if (!geo) return

            const [lat, lng] = JSON.parse(geo) as number[]

            if (mapContainer) {
                lenis.scrollTo(mapContainer, {
                    offset: -100,
                })
            }

            for (const map of window.mapInstances) {
                map.setLocation({ center: [lat, lng], duration: 0 });
            }
        })
    }
})
