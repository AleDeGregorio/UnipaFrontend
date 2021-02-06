/*CSS FATTO*/

import React from "react";
//import camera from "../assets/camera.svg";   
import {Form, Button, Card, Accordion, Alert} from "react-bootstrap"
import {AiOutlineEdit} from 'react-icons/ai'


import "../InserisciProp/InserimentoProprietà.css";

import { Redirect } from 'react-router-dom';

class ModificaStanza extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dati_stanza: this.props.history.location.state ? this.props.history.location.state.dati_stanza : '',
      id_stanza: this.props.history.location.state ? this.props.history.location.state.dati_stanza.id_stanza : '',
      ref_bb: this.props.history.location.state ? this.props.history.location.state.dati_stanza.ref_bb : '',
      tipologia: this.props.history.location.state ? this.props.history.location.state.dati_stanza.tipologia : '',
      tariffa_stanza: this.props.history.location.state ? this.props.history.location.state.dati_stanza.tariffa_stanza : '',
      imgST_path1SRC: this.props.history.location.state ? this.props.history.location.state.dati_stanza.imgST_path1 : '',
      imgST_path2SRC: this.props.history.location.state ? this.props.history.location.state.dati_stanza.imgST_path2 : '',
      imgST_path3SRC: this.props.history.location.state ? this.props.history.location.state.dati_stanza.imgST_path3 : '',
      imgST_path4SRC: this.props.history.location.state ? this.props.history.location.state.dati_stanza.imgST_path4 : '',
      imgST_path1: null,
      filename1: '',
      imgST_path2: null,
      filename2: '',
      imgST_path3: null,
      filename3: '',
      imgST_path4: null,
      filename4: '',
      apiResponse: [],
      error: false,
      errorMessage: '',
      success: false,
      empty: false
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  setShow = (e) => {
    this.setState({ success: e })
  }
  onChangeImg = (e) => {
    this.setState({ [e.target.name]: URL.createObjectURL(e.target.files[0]) });
    this.setState({ [e.target.id]: e.target.files[0] });
  }

  onSubmit = (e) => {
    const data1 = {
      id_stanza: this.state.id_stanza,
      tipologia: this.state.tipologia,
      tariffa_stanza: this.state.tariffa_stanza,
      ref_bb: this.state.ref_bb
    };

    this.setState({
      fileName1: data1.id_stanza + '_' + data1.ref_bb + "_1.jpg",
      fileName2: data1.id_stanza + '_' + data1.ref_bb + "_2.jpg",
      fileName3: data1.id_stanza + '_' + data1.ref_bb + "_3.jpg",
      fileName4: data1.id_stanza + '_' + data1.ref_bb + "_4.jpg",
    });

    fetch('http://localhost:9000/updateStanza/fields', {
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
        var form = new FormData();
        if(this.state.imgST_path1) {
          form.append("foto1", this.state.imgST_path1, this.state.fileName1);
        }
        if(this.state.imgST_path2) {
          form.append("foto2", this.state.imgST_path2, this.state.fileName2);
        }
        if(this.state.imgST_path3) {
          form.append("foto3", this.state.imgST_path3, this.state.fileName3);
        }
        if(this.state.imgST_path4) {
          form.append("foto4", this.state.imgST_path4, this.state.fileName4);
        }

        fetch('http://localhost:9000/uploadFotoST/upload', {
          method: "POST",
          body: form
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
          this.setState({ success: true},()=>{
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

  render() {
    var stanza = this.state.dati_stanza;

    var tipo_stanza = '';

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
        to = {{
          pathname: "/ErrorPage",
          state: {
            error: true,
            errorMessage: this.state.errorMessage
          }
        }}
      />
    }
    else if(this.state.empty) {

      return (
          <div className="background">
        <div className="containerNew">  
          <div className="contentNew">
          <h2>Modifica le informazioni della tua stanza come preferisci!</h2>
          <Accordion>
              <p>Si è verificato un errore: {this.state.errorMessage}</p>
            </Accordion>
           
          </div>
        </div>
        </div>
      );
    }
    else {

      switch(stanza.tipologia) {
        case 1:
          tipo_stanza = 'Singola';
          break;

        case 2:
          tipo_stanza = 'Doppia';
          break;

        case 3:
          tipo_stanza = 'Tripla';
          break;

        case 4:
          tipo_stanza = 'Quadrupla';
          break;

        default:
          tipo_stanza = stanza.tipologia + " persone";
          break;
      }

      return (
          <div className="background">
        <div className="containerNew"> 
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
          <div className="contentNew">
          <h2>Modifica le informazioni della tua stanza come preferisci!</h2>
          <Accordion>
              <Card id="newStyle"  border="light">
                <div className="head-update">
                  <p>Tipologia stanza attuale: {tipo_stanza}</p>
                <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="1" />
                </div>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                  <Form.Group className="centered" id = 'tipologia' name = 'tipologia' >
    <Form.Label>Tipologia stanza - Numero ospiti</Form.Label>
    <Form.Control 
      id = 'tipologia'
      name = 'tipologia'
      placeholder='1'
      as = "select"   
      onChange = {this.onChange}  
    >
      <option value="1">Singola</option>
      <option value="2">Doppia</option>
      <option value="3">Tripla</option>
      <option value="4">Quadrupla</option>
      </Form.Control>
      <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                Modifica tipologia
              </button>
  </Form.Group>  
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card id="newStyle"  border="light">
                <div className="head-update">
                <p>Tariffa attuale: €{stanza.tariffa_stanza}/giorno</p>
                <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="2" />
                </div>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
               <form className="centered">    
    <label htmlFor = "tariffa_stanza">Tariffa</label>
    <input
      type = "text"
      pattern = "^\d+(.\d{1,2})?$"
      title = "Inserire un valore numerico usando un punto per i valori decimali"
      id = "tariffa_stanza"
      name = "tariffa_stanza"
      placeholder="Inserire tariffa"
      onChange = {this.onChange}
      className = "i"
    />
    <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                Modifica tariffa
              </button>
    </form> 
                  </Card.Body>
                </Accordion.Collapse>
              </Card>             
              <Card id="newStyle"  border="light">
                <div className="head-update">
                  <p>Foto: </p>
                <Accordion.Toggle as={AiOutlineEdit} className="margin-right" variant="link" eventKey="4" />
                </div>
                <Accordion.Collapse eventKey="4">
                  <Card.Body>
                    <p>Foto attuali: </p>        
                  <Form.Group className="centered">
    <label>Modifica le foto della tua stanza</label>
    <Form.Row className = "centered">
    <input
      id = "imgST_path1"
      name = "imgST_path1SRC"
      onChange = {this.onChangeImg}
      type = "file"
      className = "inputImg"
      accept = "image/*"
    />
    <img src = {this.state.imgST_path1SRC} alt = {"Foto 1 stanza " + this.state.id_stanza} ></img>
    <input
      id = "imgST_path2"
      name = "imgST_path2SRC"
      onChange = {this.onChangeImg}
      type = "file"
      className = "inputImg"
      accept = "image/*"
    />
    <img src = {this.state.imgST_path2SRC} alt = {"Foto 2 stanza " + this.state.id_stanza}></img>
  <input
      id = "imgST_path3"
      name = "imgST_path3SRC"
      onChange = {this.onChangeImg}
      type = "file"
      className = "inputImg"
      accept = "image/*"
    />
    <img src = {this.state.imgST_path3SRC} alt = {"Foto 3 stanza " + this.state.id_stanza}></img>
    <input
      id = "imgST_path4"
      name = "imgST_path4SRC"
      onChange = {this.onChangeImg}
      type = "file"
      className = "inputImg"
      accept = "image/*"
    />
    <img src = {this.state.imgST_path4SRC} alt = {"Foto 4 stanza " + this.state.id_stanza}></img>
    </Form.Row>
    <button type = 'button' className="bottoniSceltaModifica" onClick = {this.onSubmit}>
                carica foto
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

export default ModificaStanza;
