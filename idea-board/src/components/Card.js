
import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const getTimeNow = () => Date.now();

export default class Card extends Component {
    constructor(props) {
      super(props);
      this.state = {
        cardTitle: this.props.cardInfo.cardTitle,
        cardDesc: this.props.cardInfo.cardDesc,
        timeStamp: this.props.cardInfo.timeStamp || getTimeNow()
      };
      this.maxDescLength = 140;
      this.updateCard = this.updateCard.bind(this);
      this.deleteCard = this.deleteCard.bind(this);
      this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    }
  
    componentWillReceiveProps(nextProps) {
      this.setState({ cardTitle: nextProps.cardInfo.cardTitle, cardDesc: nextProps.cardInfo.cardDesc});  
    }
  
    componentDidMount() {
      const { cardTitle } = this.state;
      if(cardTitle === '') {
        this.titleInput.focus();
      }
    }
  
    updateCard() {
      const { cardTitle, cardDesc } = this.state;
      const { cardId } = this.props.cardInfo;
  
      const updatedTimeStamp = getTimeNow()
  
      this.setState({timeStamp: updatedTimeStamp});
  
      this.props.handleUpdateCard({cardTitle, cardDesc, cardId, timeStamp: updatedTimeStamp})
    }
  
    deleteCard() {
      const { cardId } = this.props.cardInfo;
      this.props.handleDeleteCard(cardId);
    }

    handleTextAreaChange(e) {
      if(e.target.value.length <= this.maxDescLength) {
        this.setState({cardDesc: e.target.value});
      }
    }
  
    render() {
      const { cardId } = this.props.cardInfo;
      const { cardTitle, timeStamp, cardDesc   } = this.state;
      return (
        <div className="col-md-3">
            <div className="card mb-3">
                <div className="card-body">
                    <div className="form-group">
                        <label className="sr-only" htmlFor={`input-${cardId}`}>Card title</label>
                        <input
                          id={`input-${cardId}`}
                          ref={(input) => { this.titleInput = input; }} 
                          onBlur={this.updateCard}
                          className="form-control" 
                          value={cardTitle} 
                          onChange={e => this.setState({cardTitle: e.target.value})} 
                          placeholder="title"
                        />
                    </div>
                    <div className="form-group">
                        <label className="sr-only" htmlFor={`textArea-${cardId}`}>Card description</label>
                        <textarea
                          onBlur={this.updateCard}
                          onChange={this.handleTextAreaChange}
                          className="form-control" id={`textArea-${cardId}`} rows="3" 
                          value={cardDesc}
                          placeholder="description"
                          maxLength={this.maxDescLength}
                        ></textarea>
                        </div>
                    <button type="button" className="btn btn-link delete-btn pl-0" onClick={this.deleteCard}>Delete card</button>
                    <div className="row h6">
                    <div className="col text-sm-left">Updated: </div>
                    <div className="col text-sm-right font-italic">{moment(timeStamp).format('HH:mm:ss')}</div>
                </div>
                </div>
            </div>
        </div>
      )
    }
  };

  Card.propTypes = {
    cardInfo: PropTypes.shape({
        cardTitle: PropTypes.string.isRequired,
        cardDesc: PropTypes.string.isRequired,
        cardId: PropTypes.string.isRequired,
        timeStamp: PropTypes.number
    }).isRequired,
    handleUpdateCard: PropTypes.func.isRequired,
    handleDeleteCard: PropTypes.func.isRequired,
  }