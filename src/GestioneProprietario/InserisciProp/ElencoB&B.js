import React, { Component } from 'react'

import ListBeB from './ListB&B'
import { createGlobalStyle } from 'styled-components'
//import styled from 'styled-components'

import { Redirect } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Montserrat";
    src: url('https://fonts.googleapis.com/css?family=Montserrat:400,700');
  }
  * {
    margin: 0;
	  padding: 0;
    font-family: "Montserrat", sans-serif;
    box-sizing: border-box;
  }
  body {
    background-color: #f5f5f5;
  }
`


class  ElencoBnB2 extends Component {
    
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
    else {
        return (
            <>
              <GlobalStyle />
             
              <ListBeB />
             
            </>
        );
    }
  }
}

export default ElencoBnB2;





























