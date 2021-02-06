import React, { Component } from "react";
import ListItemBeB from "./ListItemB&B";
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
`;

class ListBeB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listTitle: "ELENCO B&B",
      listBreadcrumb: "Nome / Chek-in/Check-out",
      items: [],
      apiResponse: [],
      error: false,
      errorMessage: '',
      empty: false
    };
  }

  componentDidMount() {
    const data = {
      ref_proprietario: localStorage.getItem('email'),
      tipo_proprieta: 'bb'
    }

    fetch('http://localhost:9000/searchProprietaBBProprietario/proprietaBBProprietario', {
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
        this.setState({ apiResponse: JSON.parse(result) });
        
        res = JSON.parse(result);
      } catch (error) {
        this.setState({ apiResponse: result });
        
        res = result;

        this.setState({ empty: true });
      }
        

        if(res.length < 1 || (res.code && res.code === 404)) {
          this.setState({ empty: true, errorMessage: res.message });
        }

        else if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
          this.setState({ error: true });
          this.setState({ errorMessage: this.state.apiResponse.message });
        }

        else {
          for(var i = 0; i < res.length; i++) {
            this.setState({
              items: [...this.state.items, {
                id: i,
                hasActions: true,
                textValue: res[i].nome_proprieta,
                checkin: res[i].check_in + '0/',
                checkout: res[i].check_out + '0',
                image: res[i].imgBB_path1
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
    if(!localStorage.getItem('logged') || !localStorage.getItem('proprietario')) {
      return <Redirect
          to={{
              pathname: "/ErrorPage",
              state: { 
                error: true,
                errorMessage: "Utente non autorizzato" 
              }
          }}
      />
    }
    else if(this.state.error) {
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
            <p>Si è verificato un errore: nessun B&B</p>
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
              {(provided, snapshot) => (
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
                          <ListItemBeB
                            dati_bb = {this.state.apiResponse[key] ? this.state.apiResponse[key] : ''}
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

export default ListBeB;
