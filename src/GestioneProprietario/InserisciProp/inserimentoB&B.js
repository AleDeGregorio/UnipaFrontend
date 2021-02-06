/*CSS FATTO*/ 

import React from "react";
import {Button, Form, Col, Alert} from "react-bootstrap"
import {Link} from "react-router-dom"

import "./InserimentoProprietà.css";

import { Redirect } from 'react-router-dom';

class InserimentoBnB extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      nome_proprieta: '',
      indirizzo: '',
      localita: '',
      provincia: '',
      tipo_proprieta: 'bb',
      servizi: '',
      listaServiziBB: [],
      listaServizi: [],
      nuovoServizio: '',
      descrizione: '',
      ref_proprietario: localStorage.getItem('email'),
      check_in: '',
      check_out: '',
      apiResponse: [],
      error: false,
      errorMessage: '',
      success: false,
      empty: false
    };
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

        this.setState({ listaServizi: JSON.parse(result) });
      } catch(error) {

        this.setState({ listaServizi: result });
      }
    
        if(this.state.listaServizi.status && this.state.listaServizi.status === 'error') {
          this.setState({ error: true });
          this.setState({ errorMessage: this.state.listaServizi.message });
        }
      });

    this.setState({
      listaServiziBB: this.state.servizi.replace(/\s*,\s*/g, ",").split(',')
    })
  }

  setShowSucc = (e) => {
    this.setState({ success: e })
  }

  setShowErr = (e) => {
    this.setState({ error: e })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeServizi = (e) => {
    if(e.target.checked) {
      this.setState({
        listaServiziBB: [...new Set(this.state.listaServiziBB.concat(e.target.id).sort())]
      });
    }
    else {
      var filtraServizi = this.state.listaServiziBB.filter(servizio => servizio !== e.target.id);

      this.setState({
        listaServiziBB: filtraServizi
      });
    }
  }

  onSubmitInsert = (e) => {
    e.preventDefault();

    const data1 = {
      nome_proprieta: this.state.nome_proprieta,
      indirizzo: this.state.indirizzo,
      localita: this.state.localita,
      provincia: this.state.provincia,
      tipo_proprieta: 'bb',
      servizi: this.state.listaServiziBB,
      ref_proprietario: this.state.ref_proprietario,
      descrizione: this.state.descrizione
    }

    fetch('http://localhost:9000/insertProprieta/new', {
      method: "POST",
      headers:{
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data1)
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
        window.scrollTo(0, 0);
        this.setState({ error: true });
        this.setState({ errorMessage: this.state.apiResponse.message });
      }

      const data2 = {
        ref_proprieta_bb: this.state.apiResponse.insertId,
        check_in: this.state.check_in,
        check_out : this.state.check_out
      };

      fetch('http://localhost:9000/insertBB/new',{
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data2)
      })
      .then((result) => result.text())
      .then((result) => {

        var res2;

        try {

          this.setState({ apiResponse: result });

          res2 = JSON.parse(result);
        } catch(error) {

          this.setState({ apiResponse: result });

          res2 = result;
        }

        if(res2.length < 1 || (res2.code && res2.code === 404)) {
          this.setState({ empty: true, errorMessage: res2.message });
        }

        else if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
          window.scrollTo(0, 0);
          this.setState({ error: true });
          this.setState({ errorMessage: this.state.apiResponse.message });
        }
        else {
          localStorage.setObj('user_data', this.state.apiResponse);
          window.scrollTo(0, 0);
          this.setState({ success: true, error: false },()=>{
              window.setTimeout(()=>{
                this.setState({success:false})
              }, 3000)
          })
        }
      });
    });
  }

  aggiungiServizio = (e) => {
    if(this.state.nuovoServizio !== '') {

      const data = {
        servizio: this.state.nuovoServizio
      }

      fetch('http://localhost:9000/insertServizio/new', {
        method: "POST",
        headers:{
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
          window.scrollTo(0, 0);
        }

        else {
          
          window.location.reload();
        }
      });
    }
  }

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
    else if(this.state.empty) {
      return(
        <div className = "background">
        <div className = "containerNew">  
            <div className = "contentNew">
              <p>Si è verificato un errore: {this.state.errorMessage}</p>
            <Link to="/InserimentoProprietà">Torna indietro</Link>
        </div>
      </div>
      </div>
       );
    }
    else {
      return(
        <div className = "background">
          <>
            <Alert show={this.state.success} variant="success">
            <Alert.Heading style = {{fontWeight: 'bold'}}>Inserimento avvenuto con successo!</Alert.Heading>
            <p>
              Le informazioni del tuo nuovo B&B sono state correttamente caricate e memorizzate all'interno del sistema.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => this.setShowSucc(false)} variant="outline-success">
                <span style = {{fontWeight: 'bold'}}>Ok</span>
                </Button>
            </div>
            </Alert>
          </>
            <>
                <Alert show={this.state.error} variant="danger">
                <Alert.Heading style = {{fontWeight: 'bold'}}>Inserimento non avvenuto!</Alert.Heading>
                <p>
                  Si è verificato un errore nell'inserimento dei dati, riprovare.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => this.setShowErr(false)} variant="outline-success">
                    <span style = {{fontWeight: 'bold'}}>Ok</span>
                    </Button>
                </div>
                </Alert>
            </>
        <div className = "containerNew">  
            <div className = "contentNew">
                <form onSubmit = {this.onSubmitInsert}>
                <h2>Compila questo form per inserire il tuo B&B!</h2>
            
                <label htmlFor = "nome_proprieta">Nome</label>
                <input
                  type = "text"
                  id = "nome_proprieta"
                  name = "nome_proprieta"
                  placeholder = "Nome B&B"
                  onChange = {this.onChange}
                  className = "i"
                  required
                />
  
                <label htmlFor = "localita">Città</label>
                <input
                  type = "text"
                  id = "localita"
                  name = "localita"
                  placeholder = "Città B&B"
                  onChange = {this.onChange}
                  className = "i"
                  required
                />
  
                <label htmlFor = "indirizzo">Indirizzo</label>
                <input
                  type = "text"
                  id = "indirizzo"
                  name = "indirizzo"
                  placeholder= "Indirizzo B&B"
                  onChange = {this.onChange}
                  className = "i"
                  required
                />
             
                <label htmlFor = "provincia">Provincia</label>
                <input
                  type = "text"
                  id = "provincia"
                  name = "provincia"
                  placeholder = "Provincia B&B"
                  onChange = {this.onChange}
                  className = "i"
                  required
                />
  
                    <Form.Row>
                      <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Servizi</Form.Label>
                        {this.state.listaServizi.map(item => {
                            return(
                              <div>
                                <Form.Check
                                  type="checkbox"
                                  name={item.servizio}
                                  id={item.servizio}
                                  onChange={this.onChangeServizi}
                                  label = {item.servizio}
                                  defaultChecked = {this.state.listaServiziBB.includes(item.servizio) ? "true" : ""}
                                />
                              </div>
                            )
                          })}
                      </Form.Group>
                    </Form.Row>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Inserisci servizio aggiuntivo</Form.Label>
                     <Form.Control as="textarea" rows={1} id = 'nuovoServizio' name = 'nuovoServizio' onChange = {this.onChange} className="i" />
                     </Form.Group>
                    <button className="bottoniAggiungiServizio" onClick = {this.aggiungiServizio}>
                      Aggiungi servizio
                    </button>
                    <br/>
                    <br />
                  <label htmlFor = "descrizione">Descrizione</label>
                  <input
                  type = "text"
                  id = "descrizione"
                  name = "descrizione"
                  placeholder = "Descrizione B&B"
                  onChange = {this.onChange}
                  className = "i"
                  required
                />
  
            <label htmlFor="check_in">Check-in</label>
            <input
              type = "text"
              pattern = "^([0-9]|1[0-9]|2[0-3]).[0-5][0-9]$"
              title = "Inserire un orario corretto, usando un punto per separare i minuti"
              id = "check_in"
              name = "check_in"
              placeholder = "Orario check-in"
              className = "i"
              onChange = {this.onChange}
            />
  
            <label htmlFor="check_out">Check-out</label>
            <input
              type = "text"
              pattern = "^([0-9]|1[0-9]|2[0-3]).[0-5][0-9]$"
              title = "Inserire un orario corretto, usando un punto per separare i minuti"
              id = "check_out"
              name = "check_out"
              placeholder = "Orario check-out"
              className = "i"
              onChange = {this.onChange}
            />
            <button className="bottoniScelta1" type="submit">
              Carica
            </button>
            <Link to="/InserimentoProprietà">Torna indietro</Link>
          </form>
        </div>
      </div>
      </div>
       ); }
    }
};

export default InserimentoBnB;