import React from 'react';
import { mount } from 'enzyme';
import App, { sortByTitle, sortByTime } from './App';

import uuid from 'uuid/v4';
jest.mock('uuid/v4');

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };

global.localStorage = localStorageMock;

afterEach(() => {    
    jest.clearAllMocks();
});

describe('App', () => {

    let component;

    const cardsToSendToState = [
        {
          "cardTitle": "one",
          "cardDesc": "dfdfdf",
          "cardId": "26b97018-9054-41f7-88d5-64fa210ae702",
          "timeStamp": 1578785746923
        },
        {
          "cardTitle": "card three",
          "cardDesc": "",
          "cardId": "522c579c-3cb7-4108-94bd-accb10197396",
          "timeStamp": 1578785741833
        },
        {
          "cardTitle": "two",
          "cardDesc": "",
          "cardId": "9d4bdbff-97d1-41af-bde5-94f412345cb5",
          "timeStamp": 1578785739720
        }
      ];

    describe('dry start', () => {

        beforeEach(() => component = mount(<App />));

        it('should try and grab cards that are saved to localStorage on load', () => {
            expect(localStorageMock.getItem).toHaveBeenCalledWith('cards');
        });

        it('should set an empty array if no cards are found in localStorage', () => {
            expect(component.instance().state.cards).toEqual([]);
        });


        it('should be able to add a card', () => {
            const testUUID = 'testUUID';

            uuid.mockImplementation(() => testUUID);
            component.find('#add-card-btn').simulate('click');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('cards', JSON.stringify([{
                cardId: testUUID,
                cardDesc: '',
                cardTitle: ''
            }]));
        });
            
        describe('adding cards', () => {

            beforeEach(() => {
                uuid.mockImplementation(() => 'uuid-1');
                component.find('#add-card-btn').simulate('click');
                uuid.mockImplementation(() => 'uuid-2');
                component.find('#add-card-btn').simulate('click');
            });

            it('should have rendered two cards', () => {
                expect(component.find('.card-body')).toHaveLength(2);
            });

            it('should have two sets of cards with uuids to the state', () => {
                expect(component.instance().state.cards).toEqual([
                    {"cardDesc": "", "cardId": "uuid-1", "cardTitle": ""},
                    {"cardDesc": "", "cardId": "uuid-2", "cardTitle": ""}
                ]);
            });

            it('should be able to update first card title and add to state', () => {
                const fakeTime = 1487076708000;
                const updatedNewTitle = 'newTitle';
                Date.now = jest.fn(() => fakeTime);

                component.find('.card-body').first().find('input').simulate('change', { target: { value: updatedNewTitle }});
                component.find('.card-body').first().find('input').simulate('blur');

                expect(component.instance().state.cards).toEqual([
                    {"cardDesc": "", "cardId": "uuid-1", "cardTitle": updatedNewTitle, "timeStamp": fakeTime}, 
                    {"cardDesc": "", "cardId": "uuid-2", "cardTitle": ""}
                ]);
            });
        });

        describe('sorting cards', () => {
            it('should sort cards based on title', () => {
                component.setState({cards: cardsToSendToState});
                component.find('#sort-title-btn').simulate('click');
                expect(component.instance().state.cards).toEqual(sortByTitle(cardsToSendToState));
            });

            it('should sort cards based on time', () => {
                component.setState({cards: cardsToSendToState});
                component.find('#sort-time-btn').simulate('click');
                expect(component.instance().state.cards).toEqual(sortByTime(cardsToSendToState));
            });
        });

        describe('deleting cards', () => {
            it('should be able to delete a card in a set and the order be maintained', () => {
                component.setState({cards: cardsToSendToState});
                component.update();
                component.find('.card-body').first().find('.delete-btn').simulate('click');
                
                expect(component.instance().state.cards).toEqual([
                    {"cardDesc": "", "cardId": "522c579c-3cb7-4108-94bd-accb10197396", "cardTitle": "card three", "timeStamp": 1578785741833}, 
                    {"cardDesc": "dfdfdf", "cardId": "26b97018-9054-41f7-88d5-64fa210ae702", "cardTitle": "one", "timeStamp": 1578785746923}
                ])
            })
        });

    });

});
