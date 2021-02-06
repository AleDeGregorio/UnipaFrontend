/*CSS FATTO*/

import React from "react";
//import camera from "../assets/camera.svg";   
import { Form } from "react-bootstrap"

import "./InserimentoProprietà.css";

import { Redirect } from 'react-router-dom'


class InserimentoProprietà extends React.Component {
  
 render(){
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
  return (
    <div className="background">
    <div className="containerNewSelezione">  
      <div className="contentNewScelta">
        <form >
          <h2>Seleziona il tipo di struttura che stai inserendo</h2>
          <Form.Group>
            <Form.Row className="justify-content-center">
            <a className="bottoniScelta" href="/InserimentoCasaVacanza">
              Casa Vacanza
            </a>
            <a  className="bottoniScelta" href="/InserimentoBnB">
              B&B
            </a>
            <a className="bottoniScelta" href="/ElencoBnB2">
              Stanza B&B
            </a>
            </Form.Row>
          </Form.Group>
        </form>
      </div>
    </div>
    </div>
  );}
}

export default InserimentoProprietà;
