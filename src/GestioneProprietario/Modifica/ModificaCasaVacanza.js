/*CSS FATTO*/

import React from "react";
//import camera from "../assets/camera.svg";   
import {Form, Button, Accordion, Card, Col} from "react-bootstrap"
import '../InserisciProp/InserimentoProprietà.css'
import {AiOutlineEdit} from 'react-icons/ai'
import Alert from 'react-bootstrap/Alert'

import { Redirect } from 'react-router-dom';

class ModificaCasaVacanza extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dati_casa: this.props.history.location.state ? this.props.history.location.state.dati_casa : '',
      ref_proprietario: localStorage.getItem('email'),
      id_proprieta: this.props.history.location.state ? this.props.history.location.state.dati_casa.id_proprieta : '',
      nome_proprieta: this.props.history.location.state ? this.props.history.location.state.dati_casa.nome_proprieta : '',
      indirizzo: this.props.history.location.state ? this.props.history.location.state.dati_casa.indirizzo : '',
      localita: this.props.history.location.state ? this.props.history.location.state.dati_casa.localita : '',
      provincia: this.props.history.location.state ? this.props.history.location.state.dati_casa.provincia : '',
      tipo_proprieta: this.props.history.location.state ? this.props.history.location.state.dati_casa.tipo_proprieta : '',
      servizi: this.props.history.location.state ? this.props.history.location.state.dati_casa.servizi : '',
      listaServiziCasa: [],
      listaServizi: [],
      nuovoServizio: '',
      descrizione: this.props.history.location.state ? this.props.history.location.state.dati_casa.descrizione : '',
      ref_proprieta_cv: this.props.history.location.state ? this.props.history.location.state.dati_casa.ref_proprieta_cv : '',
      posti_letto: this.props.history.location.state ? this.props.history.location.state.dati_casa.posti_letto : '',
      tariffa_casa: this.props.history.location.state ? this.props.history.location.state.dati_casa.tariffa_casa : '',
      imgCV_path1SRC: this.props.history.location.state ? this.props.history.location.state.dati_casa.imgCV_path1 : '',
      imgCV_path2SRC: this.props.history.location.state ? this.props.history.location.state.dati_casa.imgCV_path2 : '',
      imgCV_path3SRC: this.props.history.location.state ? this.props.history.location.state.dati_casa.imgCV_path3 : '',
      imgCV_path4SRC: this.props.history.location.state ? this.props.history.location.state.dati_casa.imgCV_path4 : '',
      imgCV_path1: null,
      filename1: '',
      imgCV_path2: null,
      filename2: '',
      imgCV_path3: null,
      filename3: '',
      imgCV_path4: null,
      filename4: '',
      apiResponse: [],
      error: false,
      errorMessage: '',
      success: false,
      empty: false,
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
      listaServiziCasa: this.state.servizi.replace(/\s*,\s*/g, ",").split(',')
    })
  }

  setShow = (e) => {
    this.setState({ success: e })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onChangeImg = (e) => {
    this.setState({ [e.target.name]: URL.createObjectURL(e.target.files[0]) });
    this.setState({ [e.target.id]: e.target.files[0] });
  }

  onChangeServizi = (e) => {
    if(e.target.checked) {
      this.setState({
        listaServiziCasa: [...new Set(this.state.listaServiziCasa.concat(e.target.id).sort())]
      });
    }
    else {
      var filtraServizi = this.state.listaServiziCasa.filter(servizio => servizio !== e.target.id);

      this.setState({
        listaServiziCasa: filtraServizi
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
      ref_proprietario: this.state.ref_proprietario,
      descrizione: this.state.descrizione,
      id_proprieta: this.state.id_proprieta,
      servizi: this.state.listaServiziCasa
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
          posti_letto: this.state.posti_letto,
          tariffa_casa: this.state.tariffa_casa,
          ref_proprieta_cv: this.state.ref_proprieta_cv,
        };

        this.setState({
          fileName1: data2.ref_proprieta_cv + "_1.jpg",
          fileName2: data2.ref_proprieta_cv + "_2.jpg",
          fileName3: data2.ref_proprieta_cv + "_3.jpg",
          fileName4: data2.ref_proprieta_cv + "_4.jpg",
        });
    
        fetch('http://localhost:9000/updateCasa/fields',{
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
            var form = new FormData();
            if(this.state.imgCV_path1) {
              form.append("foto1", this.state.imgCV_path1, this.state.fileName1);
            }
            if(this.state.imgCV_path2) {
              form.append("foto2", this.state.imgCV_path2, this.state.fileName2);
            }
            if(this.state.imgCV_path3) {
              form.append("foto3", this.state.imgCV_path3, this.state.fileName3);
            }
            if(this.state.imgCV_path4) {
              form.append("foto4", this.state.imgCV_path4, this.state.fileName4);
            }

            fetch('http://localhost:9000/uploadFotoCV/upload', {
              method: "POST",
              body: form
            })
            .then((result) => result.text())
            .then((result) => {
              this.setState({ apiResponse: result });

            var res3 = result;

            if((res && res3.length < 1) || (res && res3.code && res3.code === 404)) {
              this.setState({ empty: true, errorMessage: res3.message });
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
    var casa = this.state.dati_casa;
    
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
          <h2>Modifica la tua casa vacanza con le informazioni che preferisci!</h2>
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
          <h2>Modifica la tua casa vacanza con le informazioni che preferisci!</h2>
          <Accordion>
              <Card id="newStyle" border="light">
                <div className="head-update">
                  <p>Nome: {casa.nome_proprieta}</p>
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
                   placeholder = {casa.nome_proprieta}
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
                <p>Località: {casa.localita} ({casa.provincia}), {casa.indirizzo}</p>
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
                  </form >
                </ Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card id="newStyle" border="light">
                <div className="head-update">
                <p>Servizi offerti: {casa.servizi}</p>
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
                                  defaultChecked = {this.state.listaServiziCasa.includes(item.servizio) ? "true" : ""}
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
                <p> Descrizione: </p>
                <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="4" />
                </div>
                <Accordion.Collapse eventKey="4">
                  <Card.Body>
                    <form className="centered">
                    <label htmlFor = "descrizione">Descrizione attuale: {casa.descrizione}</label>
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
              <Card id="newStyle" border="light">
                <div className="head-update">
                  <p>Posti letto: {casa.posti_letto}</p>
                  <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="5" />

                </div>
                <Accordion.Collapse eventKey="5">
                  <Card.Body>
                  <Form.Group className="centered" id = 'posti_letto' name = 'posti_letto' >
    <Form.Label>Posti Letto</Form.Label>
    <Form.Control 
      id = 'posti_letto'
      name = 'posti_letto'
      defaultValue = {casa.posti_letto}
      as = "select"   
      onChange = {this.onChange}  
    >
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
      <option>6</option>
      <option>7</option>
      <option>8</option>
      </Form.Control>
      <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                Modifica posti letto
              </button>
  </Form.Group>  
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card id="newStyle" border="light">
                <div className="head-update">
                <p>Tariffa attuale: €{casa.tariffa_casa}/giorno</p>
                <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="6" />
                </div>
                <Accordion.Collapse eventKey="6">
                  <Card.Body>
                    <form className="centered">
                    <label htmlFor = "tariffa_casa">Tariffa</label>
  <input
    type = "text"
    pattern = "^\d+(.\d{1,2})?$"
    title = "Inserire un valore numerico usando un punto per i valori decimali"
    id = "tariffa_casa"
    name = 'tariffa_casa'
    placeholder="Inserisci tariffa casa usando un punto per i valori decimali"
    onChange = {this.onChange}
    className = "icasa"
  />
              <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                Cambia tariffa
              </button>
                    </form>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card id="newStyle" border="light">
                <div className="head-update">
                <p>Modifica foto</p>
                <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="7" />
                </div>
                <Accordion.Collapse eventKey="7">
                  <Card.Body>
                  <Form.Group className="centered">
    <label>Modifica le foto della tua struttura</label>
    <Form.Row className = "centered">
    <input
      id = "imgCV_path1"
      name = "imgCV_path1SRC"
      onChange = {this.onChangeImg}
      type = "file"
      className = "inputImg"
      accept = "image/*"
    />
    <img src = {this.state.imgCV_path1SRC} alt = {"Foto 1 " + this.state.nome_proprieta} ></img>
    <input
      id = "imgCV_path2"
      name = "imgCV_path2SRC"
      onChange = {this.onChangeImg}
      type = "file"
      className = "inputImg"
      accept = "image/*"
    />
    <img src = {this.state.imgCV_path2SRC} alt = {"Foto 2 " + this.state.nome_proprieta}></img>
  <input
      id = "imgCV_path3"
      name = "imgCV_path3SRC"
      onChange = {this.onChangeImg}
      type = "file"
      className = "inputImg"
      accept = "image/*"
    />
    <img src = {this.state.imgCV_path3SRC} alt = {"Foto 3 " + this.state.nome_proprieta}></img>
    <input
      id = "imgCV_path4"
      name = "imgCV_path4SRC"
      onChange = {this.onChangeImg}
      type = "file"
      className = "inputImg"
      accept = "image/*"
    />
    <img src = {this.state.imgCV_path4SRC} alt = {"Foto 4 " + this.state.nome_proprieta}></img>
    </Form.Row>
    <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                Carica foto
              </button>
  </Form.Group>

  
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

export default ModificaCasaVacanza;
