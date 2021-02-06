import React from "react";
import AlloggiFilter from './AlloggiFiltro';
import AlloggiList from "./AlloggiLista";

import './AlloggioLista.css'

import moment from "moment";

import { Redirect } from "react-router-dom";

class AlloggiContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      case: this.props.case ? this.props.case : [],
      posti: this.props.posti ? this.props.posti : 1,
      checkIn: this.props.checkIn ? this.props.checkIn : '',
      checkOut: this.props.checkOut ? this.props.checkOut : '',
      localita: this.props.localita ? this.props.localita : '',
      tipo: this.props.tipo ? this.props.tipo : '',
      searchServizi: [],
      datiRicerca: '',
      apiResponse: [],
      error: false,
      errorMessage: ''
    }
  }

  componentDidMount() {

    fetch('http://localhost:9000/servizi/all', {
      method: "GET",
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((result) => result.text())
    .then((result) => {

      try {
        this.setState({ apiResponse: JSON.parse(result) });
  
      } catch (error) {
        this.setState({ apiResponse: result });
        
        this.setState({ empty: true });
      }
    
      if(this.state.apiResponse.status === 'error') {
        this.setState({ error: true });
        this.setState({ errorMessage: this.state.apiResponse_strutture.message });
      }
    });
  }

  onChange = (e) => {

    this.setState({ 
      posti: e.posti ? e.posti : this.state.posti, 
      datiRicerca: e,
      tipo: e.tipo ? e.tipo : this.state.tipo,
      checkIn: e.checkIn,
      checkOut: e.checkOut
    }, () => {
      var inizio = this.state.datiRicerca.endDate ? new Date(this.state.datiRicerca.startDate.format()) : new Date(moment().format());
      var fine = this.state.datiRicerca.endDate ? new Date(this.state.datiRicerca.endDate.format()) : new Date(moment().add(1, 'days').format());
      
      const offsetInizio = inizio.getTimezoneOffset();
      inizio = new Date(inizio.getTime() - (offsetInizio*60*1000));
      inizio = inizio.toISOString().slice(0,10);

      const offsetFine = fine.getTimezoneOffset();
      fine = new Date(fine.getTime() - (offsetFine*60*1000));
      fine = fine.toISOString().slice(0,10);

      const data = {
        tipo: this.state.datiRicerca.tipo ? this.state.datiRicerca.tipo : '',
        localita: this.state.datiRicerca.localita ? this.state.datiRicerca.localita : '',
        provincia: '',
        servizi: '',
        posti: this.state.datiRicerca.posti ? this.state.datiRicerca.posti : '%%',
        costo: this.state.datiRicerca.costo ? this.state.datiRicerca.costo : '',
        checkIn: inizio,
        checkOut: fine
      };
  
      fetch('http://localhost:9000/ricercaAlloggio/risultati', {
          method: "POST",
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then((result) => result.text())
      .then((result) => {
        try {

          this.setState({ case: JSON.parse(result) });
        } catch(error) {

          this.setState({ case: result })
        }
  
          if(this.state.case.status && this.state.case.status === 'error') {
            this.setState({ error: true });
            this.setState({ errorMessage: this.state.case.message });
          }
          else {
            this.setState({ loading: false });
          }
        }
      );
    });
  }

  onChangeServizi = (e) => {

    this.setState({ posti: e.posti ? e.posti : this.state.posti, datiRicerca: e }, () => {
      var inizio = this.state.datiRicerca.endDate ? new Date(this.state.datiRicerca.startDate.format()) : new Date(moment().format());
      var fine = this.state.datiRicerca.endDate ? new Date(this.state.datiRicerca.endDate.format()) : new Date(moment().add(1, 'days').format());
      
      const offsetInizio = inizio.getTimezoneOffset();
      inizio = new Date(inizio.getTime() - (offsetInizio*60*1000));
      inizio = inizio.toISOString().slice(0,10);

      const offsetFine = fine.getTimezoneOffset();
      fine = new Date(fine.getTime() - (offsetFine*60*1000));
      fine = fine.toISOString().slice(0,10);

      const data = {
        tipo: this.state.datiRicerca.tipo ? this.state.datiRicerca.tipo : '',
        localita: this.state.datiRicerca.localita ? this.state.datiRicerca.localita : '',
        provincia: '',
        servizi: e.searchServizi,
        posti: this.state.datiRicerca.posti ? this.state.datiRicerca.posti : '%%',
        costo: this.state.datiRicerca.costo ? this.state.datiRicerca.costo : '',
        checkIn: inizio,
        checkOut: fine
      };
  
      fetch('http://localhost:9000/ricercaAlloggio/risultati', {
          method: "POST",
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then((result) => result.text())
      .then((result) => {
        try{

          this.setState({ case: JSON.parse(result) });
        } catch(error) {

          this.setState({ case: result });
        }
  
          if(this.state.case.status && this.state.case.status === 'error') {
            this.setState({ error: true });
            this.setState({ errorMessage: this.state.case.message });
          }
          else {
            this.setState({ loading: false });
          }
        }
      );
    });
  }

  render() {
    if (this.state.error) {
      return <Redirect 
        to = {{
          pathname: "/ErrorPage",
          state: {
            error: true,
            errorMessage: this.state.errorMessage
          }
        }}
      />
    }
    else {
      return (
        <>
          <AlloggiFilter 
            servizi={this.state.apiResponse} 
            posti = {this.props.posti} 
            checkIn = {this.state.checkIn}
            checkOut = {this.state.checkOut}
            onChange = {this.onChange} 
            onChangeServizi = {this.onChangeServizi}
            case = {this.state.case}
            localita = {this.state.localita}
            tipo = {this.state.tipo}
          />
          <div className="ListaProp">
            <AlloggiList 
              case={this.state.case} 
              servizi = {this.state.datiRicerca.searchServizi} 
              checkIn = {this.state.checkIn} 
              checkOut = {this.state.checkOut}
              tipo = {this.state.tipo}
              />
          </div>
        </>
      );
    }
  }
}

export default AlloggiContainer;