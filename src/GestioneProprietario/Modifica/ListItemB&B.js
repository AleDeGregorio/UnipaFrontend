import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { theme } from '../shared/theme'
import {Link} from 'react-router-dom'
import './ListItem.css'
import { Modal, Button} from 'react-bootstrap'
const ListItemWrapper = styled.div`

  padding: 10px 0;
  max-height: 200px;
  transition: 0.4s;
  &.list-item-wrapper--hide {
    padding: 0;
    max-height: 0px;
  }
  @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
    padding: 13px 0;
  }
`
const ListItemContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  text-align: center;
  color: #8855ff;
  background: #fff;
  border: 1px solid ${props => props.theme.borderGray};
  border-radius: 3px;
  padding: 10px;
  transition: all 0.2s ease-in-out;
  flex-wrap: wrap;
  &:active {
    background: ${props => props.theme.lightGray};
    transform: scale(0.98);
  }
  &.list-item-content--deleted {
    transform: scale(0);
    transform-origin: center 70%;
  }
  @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
    padding: 20px;
  }
`
const ListItemImageWrapper = styled.div`
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 100%;
  margin-right: 10px;
  flex: 0 0 auto;
  img {
    width: 100%;
    height: auto;
  }
  @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
    width: 80px;
    height: 80px;
    margin-right: 20px;
  }
`
const ListItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  flex: 2 0 auto;
  min-width: calc(100% - 100px);
  @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
    min-width: auto;
  }
`
const ListItemText = styled.form`
  margin-bottom: 4px;
  cursor: default;
  font-size: 14px;
  span {
    font-size: inherit;
    color: ${props => props.theme.black};
  }
  input {
    font-size: inherit;
    color: ${props => props.theme.black};
    border: none;
    background-color: transparent;
    outline: none;
    padding: 0;
    margin: 0;
    &::-moz-selection {
      background: #63a0fb;
      color: #fff;
    }
    &::selection {
      background: #63a0fb;
      color: #fff;
    }
  }
  @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
    font-size: 20px;
    margin-bottom: 10px;
    input {
      min-width: 320px;
    }
  }
`
const ListItemTextSecond = styled.div`
  font-size: 20px;
  color: ${props => props.theme.mediumGray};
`
const ListItemSelect = styled.div`
  width: 90px;
  background-color: #fff;
  font-size: 13px;
  position: relative;
  cursor: pointer;
  align-self: flex-end;
  @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
    align-self: auto;
  }
  .listitem__select__text {
    width: 100%;
    padding: 7px 20px 7px 0;
    color: ${props =>
      props.showSelect ? props.theme.mediumGray : props.theme.black};
    border-bottom: 1px solid ${props => props.theme.borderGray};
    font-size: inherit;
    border: 1px solid ${props => props.theme.borderGray};
    border-radius: 2px;
    background-color: #fff;
    transition: background-color 0.2s ease-out;
    position: relative;
    z-index: 2;
    & > div {
      opacity: ${props => (props.showSelect ? `0.3` : `1`)};
    }
    @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
      padding: 10px 20px 10px 0;
      &:hover {
        background-color: ${props => props.theme.lightGray};
      }
    }
  }
  .listitem__select__list {
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    max-height: 0;
    position: absolute;
    left: 0;
    top: 36px;
    z-index: 1;
    width: 100%;
    background-color: #fff;
    animation: slide 0.5s ease-in-out reverse;
    &--show {
      max-height: 500px;
      animation: slide 0.5s ease-in-out;
    }
  }
  @keyframes slide {
    0% {
      max-height: 0px;
    }
    100% {
      max-height: 500px;
    }
  }
  .listitem__select__list__item {
    width: 100%;
    padding: 10px 0;
    color: ${props => props.theme.black};
    font-size: inherit;
    border: 1px solid ${props => props.theme.borderGray};
    border-top: none;
    &:hover {
      background-color: ${props => props.theme.lightGray};
    }
  }
`
const SelectArrowDown = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 0;
  top: 0;
  margin: auto;
  right: 2.5px;
  svg {
    width: 100%;
  }
`

class ListItemCase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSelect: false,
      editName: false,
      hasActions: true,
      textValue: '',
      isDeleted: false,
      isAlive: true,
      show: false,
      success: false
    }
  }

  handleClose = () => {
    this.setState({
      show: false
    });
  }

  handleShow = () => {
    this.setState({
      show: true
    });
  }
  
  componentDidMount() {
    this.setState({ textValue: this.props.number.textValue })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.dragging !== this.props.dragging) {
      this.setState({ showSelect: false })
    }
  }

  toggleSelect = () => {
    this.setState(prevState => {
      return {
        showSelect: !prevState.showSelect
      }
    })
  }

  toggleEditName = event => {
    event.preventDefault()
    this.setState(prevState => {
      return {
        editName: !prevState.editName
      }
    })
  }

  selectInput = event => {
    event.target.focus()
    event.target.select()
  }

  handleChange = event => {
    this.setState({ textValue: event.target.value })
  }

  elimina = (e) => {

    const data = {
      ref_proprieta_bb: e
    }

    fetch('http://localhost:9000/deleteBB/deleted', {
      method: "POST",
      headers: {
          'Content-type' : 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((result) => result.text())
    .then((result)=>{
      
      var res;

      try {

        this.setState({ apiResponse:JSON.parse(result) });
        res = JSON.parse(result);
      } catch(error) {

        this.setState({ apiResponse:result });
        res = result;
      }

      if(res.length < 1 || (res.code && res.code === 404)) {
        this.setState({ empty: true, errorMessage: res.message });
      }

      else if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
        this.setState({ error: true });
        this.setState({ errorMessage: this.state.apiResponse.message });
      }
      else {
        this.setState({ success: true })
        this.setState({ isDeleted: true })
        this.toggleSelect()
        setTimeout(() => {
          this.setState({ isAlive: false })
        }, 150)
      }
    });
  }
 
  render() {
    //const { dragging } = this.props
    const {
      showSelect,
      editName,
      textSecond,
      textValue,
      isDeleted,
      isAlive
    } = this.state
    const {
      checkin, checkout,
      hasActions,
      image,
     
    } = this.props.number
    let listItemContentClass = ``
    var dati_bb = this.props.dati_bb;
    if (isDeleted) listItemContentClass += ` list-item-content--deleted`
    return (
      <ThemeProvider theme={theme}>
        <ListItemWrapper className={isAlive ? `` : `list-item-wrapper--hide`}>
          <ListItemContent className={listItemContentClass}>
            <ListItemImageWrapper>
              <img src={image} alt={textValue} />
            </ListItemImageWrapper>
            <ListItemInfo>
              <ListItemText onSubmit={this.toggleEditName}>
                {editName ? (
                  <input
                    type="text"
                    value={textValue}
                    onChange={this.handleChange}
                    onClick={this.selectInput}
                  />)
              
                 : (
                  <span onClick={this.toggleEditName}>{textValue}</span>
                )}
              </ListItemText>
              <ListItemTextSecond>
              {textSecond}
                {checkin}
                {checkout}
              </ListItemTextSecond>
            </ListItemInfo>
        
            {hasActions && (
              <ListItemSelect showSelect={showSelect}>
                <div
                  className="listitem__select__text"
                  onClick={this.toggleSelect}
                >
                  Azioni
                  <SelectArrowDown>
                    <svg
                      x="0px"
                      y="0px"
                      viewBox="0 0 100 125"
                      style={{ enableBackground: 'new 0 0 100 100' }}
                    >
                      <g>
                        <polygon points="64.4,40.4 51.1,54 37.6,40.7 34.8,43.6 51.2,59.7 67.3,43.2  " />
                      </g>
                    </svg>
                  </SelectArrowDown>
                </div>
                {showSelect && (
                  <div
                    className={`listitem__select__list ${
                      showSelect ? 'listitem__select__list--show' : ''
                    }`}
                  >
                    <div
                      className="listitem__select__list__item" 
                    >
                      <Link className="LinkList" to = {{
                        pathname: "/ModificaB&B",
                        state: { 
                          dati_bb: this.props.dati_bb
                        }
                      }}
                      >
                      Modifica B&B
                      </Link>
                    </div>
                    <div
                      className="listitem__select__list__item"
                      
                   
                    >
                      <Link className="LinkList" to = {{
                        pathname: "/ElencoListaStanze",
                        state: { 
                          dati_bb: this.props.dati_bb
                        }
                      }}
                      >
                      Modifica Stanza B&B
                      </Link>
                    </div>
                    <div className="listitem__select__list__item">
                      <span onClick = {this.handleShow}>Elimina</span>
                      <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Sei sicuro di volere eliminare la struttura?</Modal.Title>
                                </Modal.Header>
                                    <Modal.Body>
                                      Non sarà possibile recuperare i dati
                                    </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick = {e => this.elimina({dati_bb}.ref_proprieta_bb)}>Elimina</Button>
                            <Button variant="secondary" onClick={this.handleClose}>Annulla</Button>                   
                        </Modal.Footer>
                    </Modal>
                    </div>
                  </div>
                )}
              </ListItemSelect>
            )}
          </ListItemContent>
        </ListItemWrapper>
      </ThemeProvider>
    )
  }
}

export default ListItemCase
