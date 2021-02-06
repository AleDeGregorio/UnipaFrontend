import React, { Component } from "react";
import ListItemPrenotazioni from "./ListItemPrenotazioni";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../shared/theme";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Redirect } from 'react-router-dom';

const ListWrapper = styled.div`
  width: ${props => props.theme.maxWidth};
  max-width: 90%;
  display: block;
  margin: auto;
  padding: 70px 0 20px;
  position: relative;
  z-index: 10;
  @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
    padding: 90px 0 50px;
  }
`;
const ListTitle = styled.h2`
  font-weight: normal;
  font-size: 22px;
  margin-bottom: 5px;
  @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
    font-size: 28px;
    margin-bottom: 10px;
  }
`;
const ListBreadcrumb = styled.div`
  font-weight: 300;
  font-size: 14px;
  margin-bottom: 5px;
  color: ${props => props.theme.mediumGray};
  @media (min-width: ${props => props.theme.mediumDeviceWidth}) {
    margin-bottom: 20px;
  }
`;
const ListDragItem = styled.div`
  outline: none;
  position: relative;
  z-index: ${props => 99999 - props.order};
  margin-bottom:40px;
`;

class ListAccettare extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listTitle: "Ecco le prenotazioni da accettare",
      listBreadcrumb: "Proprietà / Info clienti",
      items: [],
      apiResponse_accettazione: [],
      email_prop: localStorage.getItem('email'),
      error: false,
      errorMessage: '',
      empty: false
    };
  }

  componentDidMount() {
    const data = {
        ref_proprietario: this.state.email_prop
    };

    fetch('http://localhost:9000/getPrenotazioniAccettazione/prenotazioniAccettazione', {
      method: "POST",
      headers: {
          'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((result) => result.text())
    .then((result) => {

      var res;

      try {

        this.setState({ apiResponse_accettazione: JSON.parse(result) });
        res = JSON.parse(result);

      } catch(error) {

        this.setState({ apiResponse_accettazione: result });
        res = result;
      }

      if(res.length < 1 || (res.code && res.code === 404)) {
        this.setState({ empty: true, errorMessage: res.message });
      }

      else if(this.state.apiResponse_accettazione.status && this.state.apiResponse_accettazione.status === 'error') {
        this.setState({ error: true });
        this.setState({ errorMessage: this.state.apiResponse_accettazione.message });
      }

      else {
        for(var i = 0; i < res.length; i++) {
          this.setState({
            items: [...this.state.items, {
              id: i,
              hasActions: true,
              image: res[i].img,
              nome: res[i].nome_proprieta,
              stanza: res[i].id_stanza ? res[i].id_stanza : '',
              textValue: res[i].ref_proprieta,
              id_prenotazione: res[i].id_prenotazione,
              ref_cliente: res[i].ref_cliente,
              num_soggiornanti : res[i].num_soggiornanti,
              costo:res[i].costo,
              data_partenza:res[i].data_partenza,
              data_ritorno:res[i].data_ritorno              
            }]
          });
        }
      }
    });
  }
       
  reorderItems = (startIndex, endIndex) => {
    const items = Array.from(this.state.items);
    const [removed] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, removed);
    this.setState({ items });
  };

  onDragEnd = result => {
    const { source, destination } = result;
    if (!destination) return;
    this.reorderItems(source.index, destination.index);
  };

  refreshItemsList = id => {
    this.setState(prevState => {
      return {
        items: prevState.items.filter(item => item.id !== id)
      };
    });
  };

  render() {
  if(this.state.error) {
      return <Redirect
          to={{
              pathname: "/ErrorPage",
              state: { 
                  error: true,
                  errorMessage: this.state.errorMessage 
              }
          }}
      />
  }
  else if(this.state.empty) {
    const { listTitle, listBreadcrumb } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <ListWrapper>
          <ListTitle>{listTitle}</ListTitle>
          <ListBreadcrumb>{listBreadcrumb}</ListBreadcrumb>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppabe-list">
              {(provided) => (
                <div ref={provided.innerRef}>
                  <p style={{color: "white"}}>Attualmente non è presente nessuna prenotazione da accettare</p>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ListWrapper>
      </ThemeProvider>
    );
  }
  else {
    const { listTitle, listBreadcrumb, items } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <ListWrapper>
          <ListTitle>{listTitle}</ListTitle>
          <ListBreadcrumb>{listBreadcrumb}</ListBreadcrumb>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppabe-list">
              {(provided) => (
                <div ref={provided.innerRef}>
                  {items.map((number, key) => (
                    <Draggable
                      draggableId={`draggable-${number.id}`}
                    
                    >
                      {(provided, snapshot) => (
                        <ListDragItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          order={key}
                        >
                          <ListItemPrenotazioni                          
                           dati_casa = {this.state.apiResponse_accettazione[key] ? this.state.apiResponse_accettazione[key] : ''}
                            number={number}
                            dragging={snapshot.isDragging}
                            onDeleteItem={this.refreshItemsList}
                          />
                        </ListDragItem>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ListWrapper>
      </ThemeProvider>
    );
  }
  }
}

export default ListAccettare;
