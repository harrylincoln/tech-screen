import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import uuid from "uuid";

import {
    localStorageRetrieveCards,
    localStorageWriteCards
  } from './utils/localStorage-helper';

import Card from './components/Card';

export const sortByTitle = arr => arr.sort((a, b) => a.cardTitle.localeCompare(b.cardTitle));
export const sortByTime = arr => arr.sort((a, b) => a.timeStamp - b.timeStamp);

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
          cards: null,
          activeCardId: null
        };

        this.addCard = this.addCard.bind(this);
        this.handleUpdateCard = this.handleUpdateCard.bind(this);
        this.handleDeleteCard = this.handleDeleteCard.bind(this);
        this.sortCardsByTime = this.sortCardsByTime.bind(this);
        this.sortCardsByTitle = this.sortCardsByTitle.bind(this);
    }

    initialiseGetStoredCards() {
        this.setState({
          cards: localStorageRetrieveCards()
        });
    }

    componentWillMount() {
      this.initialiseGetStoredCards()
    }

    handleUpdateCard(updatedCardData) {
      this.setState({cards: this.state.cards.map(card => (card.cardId === updatedCardData.cardId ? {...updatedCardData} : card))},
      () => localStorageWriteCards(this.state.cards))
    }

    handleDeleteCard(cardIdToDelete) {
      this.setState({cards: this.state.cards.filter(card => {
        return card.cardId !== cardIdToDelete
      })}, () => localStorageWriteCards(this.state.cards));
    }

    addCard() {
      const activeCardId = uuid.v4();
      this.setState(prevState => ({
          cards: [...prevState.cards, {cardId: activeCardId, cardDesc: '', cardTitle: ''}],
          activeCardId
      }), () => localStorageWriteCards(this.state.cards));
    }

    sortCardsByTime() {
      const { cards } = this.state;
      const cardsSortedByTime = sortByTime(cards);
      this.setState({cards: cardsSortedByTime});
    }

    sortCardsByTitle() {
      const { cards } = this.state;
      const cardsSortedByTitle = sortByTitle(cards);
      this.setState({cards: cardsSortedByTitle});
    }

    render() {
      const { cards } = this.state;
        return (
            <div className="container">
              <main>
                <div className="row pt-3 mb-4">
                  {cards.map(cardInfo => (
                      <Card 
                      key={cardInfo.cardId} 
                      handleUpdateCard={this.handleUpdateCard} 
                      cardInfo={cardInfo} 
                      handleDeleteCard={this.handleDeleteCard} />
                  ))}
                </div>
                <footer className="footer fixed-bottom bg-light p-3 mt-4">
                  <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="btn-group" role="group" aria-label="First group">
                      <button id="add-card-btn" type="button" className="btn btn-outline-primary" onClick={this.addCard}>Add card</button>
                    </div>
                    <div className="btn-group">
                      <button id="sort-time-btn" type="button" className="btn btn-outline-secondary" onClick={this.sortCardsByTime}>Sort by time</button>
                      <button id="sort-title-btn" type="button" className="btn btn-outline-secondary" onClick={this.sortCardsByTitle}>Sort by title</button>
                    </div>
                  </div>
                </footer>
              </main>
            </div>
        );
    }
}
