export const localStorageRetrieveCards = () => window.localStorage.getItem('cards') ? JSON.parse(window.localStorage.getItem('cards')) : [];

export const localStorageWriteCards = cardsData => window.localStorage.setItem('cards', JSON.stringify(cardsData));