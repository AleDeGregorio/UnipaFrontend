/*CSS FATTO*/

import React from "react";   
import { Button, Accordion, Card, Form, Col, Alert } from "react-bootstrap"
import {AiOutlineEdit} from 'react-icons/ai'

import "../InserisciProp/InserimentoProprietà.css";

import { Redirect } from 'react-router-dom';

class ModificaBeB extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dati_bb: this.props.history.location.state ? this.props.history.location.state.dati_bb : '',
      ref_proprietario: localStorage.getItem('email'),
      id_proprieta: this.props.history.location.state ? this.props.history.location.state.dati_bb.id_proprieta : '',
      nome_proprieta: this.props.history.location.state ? this.props.history.location.state.dati_bb.nome_proprieta : '',
      indirizzo: this.props.history.location.state ? this.props.history.location.state.dati_bb.indirizzo : '',
      localita: this.props.history.location.state ? this.props.history.location.state.dati_bb.localita : '',
      provincia: this.props.history.location.state ? this.props.history.location.state.dati_bb.provincia : '',
      tipo_proprieta: this.props.history.location.state ? this.props.history.location.state.dati_bb.tipo_proprieta : '',
      servizi: this.props.history.location.state ? this.props.history.location.state.dati_bb.servizi : [],
      listaServiziBB: [],
      listaServizi: [],
      nuovoServizio: '',
      descrizione: this.props.history.location.state ? this.props.history.location.state.dati_bb.descrizione : '',
      ref_proprieta_bb: this.props.history.location.state ? this.props.history.location.state.dati_bb.ref_proprieta_bb : '',
      check_in: this.props.history.location.state ? this.props.history.location.state.dati_bb.check_in : '',
      check_out: this.props.history.location.state ? this.props.history.location.state.dati_bb.check_out : '',
      apiResponse: [],
      error: false,
      errorMessage: '',
      success: false,
      empty: false
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
        this.setState({ listaServizi: JSON.parse(result) });
    
        if(this.state.listaServizi.status === 'error') {
          this.setState({ error: true });
          this.setState({ errorMessage: this.state.listaServizi.message });
        }
      });

    this.setState({
      listaServiziBB: this.state.servizi.replace(/\s*,\s*/g, ",").split(',')
    })
  }
  setShow = (e) => {
    this.setState({ success: e })
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

  onSubmit = (e) => {
    const data1 = {
      nome_proprieta: this.state.nome_proprieta,
      indirizzo: this.state.indirizzo,
      localita: this.state.localita,
      provincia: this.state.provincia,
      tipo_proprieta: this.state.tipo_proprieta,
      servizi: this.state.listaServiziBB,
      ref_proprietario: this.state.ref_proprietario,
      descrizione: this.state.descrizione,
      id_proprieta: this.state.id_proprieta
    };

    fetch('http://localhost:9000/updateProprieta/fields', {
        method: 'POST',
        headers: {
          'Content-type':'application/json'
        },
        body: JSON.stringify(data1)
    })
    .then((result) => {result.text()})
    .then((result) => {
      this.setState({ apiResponse: result });

      var res = result;

      if((res && res.length < 1) || (res && res.code && res.code === 404)) {
        this.setState({ empty: true, errorMessage: res.message });
      }

      else if(this.state.apiResponse && this.state.apiResponse.status === 'error') {
        this.setState({ error: true });
        this.setState({ errorMessage: this.state.apiResponse.message });
      }

      else {
        const data2 = {
          check_in: this.state.check_in,
          check_out: this.state.check_out,
          ref_proprieta_bb: this.state.ref_proprieta_bb,
        };
    
        fetch('http://localhost:9000/updateBB/fields',{
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(data2)
        })
        .then((result) => result.text())
        .then((result) => {
          this.setState({ apiResponse: result });
    
          var res2 = result;

        if((res2 && res2.length < 1) || (res2 && res2.code && res2.code === 404)) {
          this.setState({ empty: true, errorMessage: res2.message });
        }

        else if(this.state.apiResponse && this.state.apiResponse.status === 'error') {
          this.setState({ error: true });
          this.setState({ errorMessage: this.state.apiResponse.message });
        }

        else {
          this.setState({success:true},()=>{
            window.scrollTo(0, 0);
            window.setTimeout(()=>{
              this.setState({success:false})
            }, 3000)
          });
        }
        });
      }
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
    var bb = this.state.dati_bb ? this.state.dati_bb : '';

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

      return (
          <div className="background">
        <div className="containerNew">  
          <div className="contentNew">
          <h2>Modifica il tuo B&B con le informazioni che preferisci!</h2>
            <p>Si è verificato un errore: {this.state.errorMessage}</p>
          </div>
        </div>
        </div>
      );
    }
    else {

      return (
          <div className="background">
            <>
              <Alert show={this.state.success} variant="success">
                <Alert.Heading style = {{fontWeight: 'bold'}}>Modifiche avvenute con successo!</Alert.Heading>
                <p>
                  Le modifiche della tua struttura sono state correttamente caricate e memorizzate all'interno del sistema.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={() => this.setShow(false)} variant="outline-success">
                    <span style = {{fontWeight: 'bold'}}>Ok</span>
                  </Button>
                </div>
              </Alert>
            </>
            <>
              <Alert show={this.state.error} variant="danger">
              <Alert.Heading style = {{fontWeight: 'bold'}}>Modifiche non salvate!</Alert.Heading>
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
        <div className="containerNew">  
          <div className="contentNew">
          <h2>Modifica il tuo B&B con le informazioni che preferisci!</h2>
            <Accordion>
              <Card id="newStyle" border="light">
                <div className="head-update">
                  <p>Nome struttura: {bb.nome_proprieta}</p>
                  <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="1" />
                </div>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    <form className="centered">
                  <label htmlFor = "nome_proprieta">Nome</label>
                <input
                  type = "text"
                  id = "nome_proprieta"
                  name = "nome_proprieta"
                  placeholder = "Inserisci nome proprietà"
                  onChange = {this.onChange}
                  className = "i"
                /> 
                <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                  Modifica nome
                </button>
              </form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card id="newStyle" border="light">
                <div className="head-update">
                <p>Località: {bb.localita} ({bb.provincia}), {bb.indirizzo}</p>
                <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="2" />
                </div>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
                  <form className="centered">
                  <label htmlFor = "localita">Città</label>
                <input
                  type = "text"
                  id = "localita"
                  name = "localita"
                  placeholder=" Inserisci città"
                  onChange = {this.onChange}
                  className = "i"
                />

                <label htmlFor = "indirizzo">Indirizzo</label>
                <input
                  type = "text"
                  id = "indirizzo"
                  name = "indirizzo"
                  placeholder=" Inserisci indirizzo"
                  onChange = {this.onChange}
                  className = "i"
                />
                
                <label htmlFor = "provincia">Provincia</label>
                <input
                  type = "text"
                  id = "provincia"
                  name = "provincia"
                  placeholder=" Inserisci Provincia (Due lettere)"
                  onChange = {this.onChange}
                  className = "i"
                />
                  <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                Modifica località
              </button>
                  </form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card id="newStyle" border="light">
                <div className="head-update">
                <p>Servizi offerti: {bb.servizi}</p>
                <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="3" />
                </div>
                <Accordion.Collapse eventKey="3">
                  <Card.Body>
                  <Form.Row>
                      <Form.Group className="centered" as={Col} controlId="formGridState">
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
                    <Form.Group className="centered" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Aggiungi servizio</Form.Label>
                     <Form.Control as="textarea" rows={1} id = 'nuovoServizio' name = 'nuovoServizio' onChange = {this.onChange} />
                     <button type = 'button' className="bottoniSceltaModifica" onClick = {this.aggiungiServizio}>
                      Aggiungi servizio
                    </button>
                    <br/>
                    <br />
                    <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                      Cambia servizi
                    </button>
                     </Form.Group>
                    
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card id="newStyle" border="light">
                <div className="head-update">
                <p>Descrizione: </p>
                <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="4" />
                </div>
                <Accordion.Collapse eventKey="4">
                  <Card.Body>
                    <form className="centered">
                    <label htmlFor = "descrizione">Descrizione attuale: {bb.descrizione}</label>
                <textarea 
                  id = 'descrizione'
                  name = 'descrizione'
                  placeholder='Inserisci descrizione'
                  onChange = {this.onChange}
                  className = 'iTA'
                >
                </textarea>
                <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                Modifica Descrizione
              </button>
                    </form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </div>
        </div>
      );
    }
  }
}

export default ModificaBeB;