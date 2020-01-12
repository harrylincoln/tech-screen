import {
    localStorageRetrieveCards,
    localStorageWriteCards
} from './localStorage-helper';

const mockCards = [{"some": "thing"}];

global.JSON.parse = jest.fn();

global.window.localStorage = {
    setItem: () => jest.fn(),
    getItem: () => jest.fn()
};

describe('localStorage helper', () => {

    afterEach(() => {
        jest.resetAllMocks()
    });

    it('should retrieve cards', () => {
        const spyOnGetItem = jest.spyOn(global.window.localStorage, 'getItem');
        localStorageRetrieveCards();
        expect(spyOnGetItem).toHaveBeenCalledWith("cards");
    });

    it('should set cards', () => {
        const spyOnSetItem = jest.spyOn(global.window.localStorage, 'setItem');
        localStorageWriteCards(mockCards);
        expect(spyOnSetItem).toHaveBeenCalledWith(
            "cards", JSON.stringify(mockCards)
        );
    })
});