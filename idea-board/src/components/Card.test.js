import React from 'react';
import { mount } from 'enzyme';
import uuid from 'uuid';
import Card from './Card';

const setStateSpy = jest.spyOn(Card.prototype, 'setState');

afterEach(() => {    
    jest.clearAllMocks();
});

describe('Card component', () => {

    let component;

    const handleUpdateCardFunc = jest.fn();
    const handleDeleteCardFunc = jest.fn();

    const cardInfo = {
        cardTitle: '',
        cardDesc: 'card description, card description, card description, card description',
        cardId: uuid.v4()
    };

    const oneHundredFortyChars = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting.d';

    const smallMockElementEvent = {
        preventDefault() {},
        target: { value: 'add some wording' }
      };
    
    const mockedChangedElements = [
        {
            elementType: 'input', 
            propName: 'cardTitle'
        },
        {
            elementType: 'textarea',
            propName: 'cardDesc'
        }
    ];

    beforeEach(() => {
        component = mount(
            <Card cardInfo={cardInfo} handleUpdateCard={handleUpdateCardFunc} handleDeleteCard={handleDeleteCardFunc}/>
        );
    });

    it('should focus in on the title field if new card', () => {

        const { titleInput } = component.instance();
        jest.spyOn(titleInput, "focus");
        component.instance().componentDidMount();
        expect(titleInput.focus).toHaveBeenCalledTimes(1);
    });

    it('should not allow more than 140 chars in the desc area', () => {

        component.find('textarea').simulate('change',  {
            preventDefault() {},
            target: { value: oneHundredFortyChars }
          });

        expect(component.instance().state.cardDesc).toHaveLength(140);
        
        component.find('textarea').simulate('change',  {
            preventDefault() {},
            target: { value: oneHundredFortyChars + 'more' }
          });

        component.update();

        expect(component.instance().state.cardDesc).toHaveLength(140);
        
    });

    it('should not focus in on the title field if existing card has title', () => {

        const mountedWithTitle = mount(
            <Card cardInfo={{
                ...cardInfo,
                cardTitle: 'an actual title'
            }} handleUpdateCard={handleUpdateCardFunc} handleDeleteCard={handleDeleteCardFunc}/>
        );

        const { titleInput } = mountedWithTitle.instance();
        jest.spyOn(titleInput, "focus");
        mountedWithTitle.instance().componentDidMount();
        expect(titleInput.focus).toHaveBeenCalledTimes(0);
    });

    mockedChangedElements.forEach(element => {
        it(`should reflect the ${element.propName} change in local state`, () => {
            
            component.find(element.elementType).simulate('change', smallMockElementEvent);
            expect(setStateSpy).toHaveBeenCalledWith({[element.propName] : smallMockElementEvent.target.value})
        })
    });

    it('should call a function passed in from an HOC when updating the card with new data', () => {

        const fakeTime = 1487076708000;
        Date.now = jest.fn(() => fakeTime);
        const newTitle = 'update the HOC';
        component.find('input').simulate('change', { target: { value: newTitle }});
        component.find('input').simulate('blur');
        expect(handleUpdateCardFunc).toHaveBeenCalledWith({
            ...cardInfo,
            cardTitle: newTitle,
            timeStamp: fakeTime
        });
    });

    it('should call a function passed in from an HOC when deleting the card with the cardId', () => {

        component.find('button').simulate('click');
        expect(handleDeleteCardFunc).toHaveBeenCalledWith(cardInfo.cardId);
    });

    it('should safely setState for cardTitle and cardDesc if props are updated', () => {

        const testNextProps = {cardInfo: {cardTitle: '', cardDesc: ''}};
        component.instance().componentWillReceiveProps(testNextProps);
        expect(setStateSpy).toHaveBeenCalledWith(testNextProps.cardInfo);
    })

});