import React from "react";
import Alloggio from "./Alloggio";
import { Button, Alert } from 'react-bootstrap'

import './AlloggiLista';

class AlloggiList extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

      incomplete: false
    }
  }

  incomplete = (e) => {

    if(e === true) {

      window.scrollTo(0, 0);
      this.setState({ incomplete: true },()=>{
          window.scrollTo(0, 0);
          window.setTimeout(()=>{
            this.setState({ incomplete: false })
          }, 3000)
      })
    }

    this.setState({ incomplete: e })
  }

  render() {
    var datiCase = this.props.case ? this.props.case : [];
    var servizi = this.props.servizi ? this.props.servizi : [];
    var checkIn = this.props.checkIn ? this.props.checkIn : '';
    var checkOut = this.props.checkOut ? this.props.checkOut : '';
    var tipo = this.props.tipo ? this.props.tipo : '';

    if (datiCase.length === 0) {
      return (
        <div className="empty-search">
          <h3>Nessun alloggio trovato...</h3>
        </div>
      );
    }

    return (
      <section className="caseVacanzalist">
        <>
          <Alert show={this.state.incomplete} variant="danger">
          <Alert.Heading style = {{fontWeight: 'bold'}}>Si è verificato un errore!</Alert.Heading>
          <p>
            Devi specificare una data di check-out prima di continuare 
          </p>
          <hr />
          <div className="d-flex justify-content-end">
              <Button onClick={() => this.incomplete(false)} variant="outline-success">
              <span style = {{fontWeight: 'bold'}}>Ok</span>
              </Button>
          </div>
          </Alert>
      </>
        <div className="caseVacanzalistDiv">
          {datiCase.map(item => {
            return <Alloggio 
              key={item.id} 
              casaVacanza={item} 
              datiRicerca = {datiCase} 
              servizi = {servizi} 
              checkIn = {checkIn} 
              checkOut = {checkOut}
              tipo = {tipo}
              incomplete = {this.incomplete}
            />;
          })}
        </div>
      </section>
    );
  }
};

export default AlloggiList;
