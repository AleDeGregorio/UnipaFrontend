import React from 'react'
import { Button, Col, Form, Accordion, Card, Alert} from 'react-bootstrap'
import {AiOutlineEdit} from 'react-icons/ai'
import {RiAccountBoxLine} from 'react-icons/ri'
//import { Row } from 'react-bootstrap'
//import {Accordion, AccordionSummary, AccordionDetails} from '@material-ui/core'
//import {MdExpandMore} from 'react-icons/md'
//import {Container} from '@material-ui/core'
import './DatiPersonali.css'

import { Redirect } from "react-router-dom";

class DatiPersonali extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            nome: '',
            cognome: '',
            nascita: new Date().toLocaleDateString(),
            num_documentoTXT: '',
            num_documento: '',
            telefonoTXT: '',
            telefono: '',
            email: '',
            apiResponse: [],
            error: false,
            errorMessage: '',
            show: false, 
            empty: false,
            success: false
        }
    }

    componentDidMount() {
        if(localStorage.getItem('logged') && localStorage.getItem('cliente')) {
            this.setState({
                nome: localStorage.getObj('user_data')[0].nome_cl ? localStorage.getObj('user_data')[0].nome_cl : localStorage.getObj('user_data')[0].nome_prop,
                cognome: localStorage.getObj('user_data')[0].cognome_cl ? localStorage.getObj('user_data')[0].cognome_cl : localStorage.getObj('user_data')[0].cognome_prop,
                nascita: localStorage.getObj('user_data')[0].data_nascita_cl ? new Date(localStorage.getObj('user_data')[0].data_nascita_cl).toLocaleDateString() : new Date(localStorage.getObj('user_data')[0].data_nascita_prop).toLocaleDateString(),
                num_documentoTXT: localStorage.getObj('user_data')[1] ? localStorage.getObj('user_data')[1].num_documento : (localStorage.getObj('user_data')[0].num_documento ? localStorage.getObj('user_data')[0].num_documento : ''),
                telefonoTXT: localStorage.getObj('user_data')[1] ? localStorage.getObj('user_data')[1].telefono_prop : (localStorage.getObj('user_data')[0].telefono_cl ? localStorage.getObj('user_data')[0].telefono_cl : localStorage.getObj('user_data')[0].telefono_prop),
                email: localStorage.getItem('email')
            })
        }

        else if(localStorage.getItem('logged') && localStorage.getItem('proprietario')) {
            this.setState({
                nome: localStorage.getObj('user_data')[0].nome_prop,
                cognome: localStorage.getObj('user_data')[0].cognome_prop,
                nascita: new Date(localStorage.getObj('user_data')[0].data_nascita_prop).toLocaleDateString(),
                num_documentoTXT: localStorage.getObj('user_data')[0].num_documento,
                telefonoTXT: localStorage.getObj('user_data')[0].telefono_prop,
                email: localStorage.getItem('email')
            })
        }
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

    onSubmit = (e) => {
        e.preventDefault();

        if(localStorage.getItem('proprietario')) {

            const data = {
                email: this.state.email,
                nome: this.state.nome,
                cognome: this.state.cognome,
                nascita: this.state.nascita,
                telefono: this.state.telefono === '' ? this.state.telefonoTXT : this.state.telefono,
                num_documento: this.state.num_documento === '' ? this.state.num_documentoTXT : this.state.num_documento
            }

            fetch('http://localhost:9000/updateProprietario/fields', {
                method: "POST",
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((result) => result.text())
            .then((result)=>{

                var res;

                try {

                    this.setState({ apiResponse:JSON.parse(result) });
                    res = JSON.parse(result);
                } catch(error) {

                    this.setState({ apiResponse:result });
                    res = result;
                }

                if(res.length < 1 || (res.code && res.code === 404)) {
                this.setState({ empty: true, errorMessage: res.message });
                }
        
                else if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
                this.setState({ error: true });
                this.setState({ errorMessage: this.state.apiResponse.message });
                }
                else {
                    const data3 = {
                        email: this.state.email
                    }

                    fetch('http://localhost:9000/searchProprietarioEmail/proprietarioEmail', {
                        method: "POST",
                        headers: {
                            'Content-type' : 'application/json'
                        },
                        body: JSON.stringify(data3)
                    })
                    .then((result) => result.text())
                    .then((result)=>{

                        var res;

                        try {

                            this.setState({ apiResponse:JSON.parse(result) });
                            res = JSON.parse(result);
                        } catch(error) {

                            this.setState({ apiResponse:result });
                            res = result;
                        }

                        if(res.length < 1 || (res.code && res.code === 404)) {
                            this.setState({ empty: true, errorMessage: res.message });
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
                }
            });
        }

        else {
            const data = {
                email: this.state.email,
                nome: this.state.nome,
                cognome: this.state.cognome,
                nascita: this.state.nascita,
                telefono: this.state.telefono === '' ? this.state.telefonoTXT : this.state.telefono
            }

            fetch('http://localhost:9000/updateCliente/fields', {
                method: "POST",
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((result) => result.text())
            .then((result)=>{

                var res;

                try {

                    this.setState({ apiResponse:JSON.parse(result) });
                    res = JSON.parse(result);
                } catch(error) {

                    this.setState({ apiResponse:result });
                    res = result;
                }

                if(res.length < 1 || (res.code && res.code === 404)) {
                this.setState({ empty: true, errorMessage: res.message });
                }
        
                else if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
                this.setState({ error: true });
                this.setState({ errorMessage: this.state.apiResponse.message });
                }
                else {

                    const data6 = {
                        email: this.state.email
                    }

                    fetch('http://localhost:9000/searchCliente/results', {
                        method: "POST",
                        headers: {
                            'Content-type' : 'application/json'
                        },
                        body: JSON.stringify(data6)
                    })
                    .then((result) => result.text())
                    .then((result)=>{
                        var res;

                        try {

                            this.setState({ apiResponse:JSON.parse(result) });
                            res = JSON.parse(result);
                        } catch(error) {

                            this.setState({ apiResponse:result });
                            res = result;
                        }

                        if(res.length < 1 || (res.code && res.code === 404)) {
                            this.setState({ empty: true, errorMessage: res.message });
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
                                  this.setState({success: false})
                                }, 3000)
                            })
                        }
                    });
                }
            });
        }
    }

    onSubmitPassword = (e) => {
        e.preventDefault();

        if(this.state.oldPassword === '' || this.state.newPassword === '' || this.state.confirmPassword === '' || 
            this.state.newPassword !== this.state.confirmPassword) {
                window.scrollTo(0, 0);
                this.setState({ error: true });
                return;
        }

        if(localStorage.getItem('proprietario')) {

            const data1 = {
                email: this.state.email,
                password: this.state.oldPassword,
            }

            fetch('http://localhost:9000/loginProprietario/proprietarioLogged', {
                method: "POST",
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(data1)
            })
            .then((result) => result.text())
            .then((result)=>{
                var res;

                try {

                    this.setState({ apiResponse:JSON.parse(result) });
                    res = JSON.parse(result);
                } catch(error) {

                    this.setState({ apiResponse:result });
                    res = result;
                }

                if(res.length < 1 || (res.code && res.code === 404)) {
                this.setState({ empty: true, errorMessage: res.message });
                }

                else if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
                    window.scrollTo(0, 0);
                    this.setState({ error: true });
                    this.setState({ errorMessage: this.state.apiResponse.message });
                }
                else {

                    const data2 = {
                        email: this.state.email,
                        password: this.state.newPassword,
                    }

                    fetch('http://localhost:9000/updateProprietarioPassword/updPass', {
                        method: "POST",
                        headers: {
                            'Content-type' : 'application/json'
                        },
                        body: JSON.stringify(data2)
                    })
                    .then((result) => result.text())
                    .then((result)=>{
                        var res;

                        try {
        
                            this.setState({ apiResponse:JSON.parse(result) });
                            res = JSON.parse(result);
                        } catch(error) {
        
                            this.setState({ apiResponse:result });
                            res = result;
                        }

                        if(res.length < 1 || (res.code && res.code === 404)) {
                            this.setState({ empty: true, errorMessage: res.message });
                        }

                        else if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
                            window.scrollTo(0, 0);
                            this.setState({ error: true });
                            this.setState({ errorMessage: this.state.apiResponse.message });
                        }
                        else {
                            const data3 = {
                                email: this.state.email
                            }
        
                            fetch('http://localhost:9000/searchProprietarioEmail/proprietarioEmail', {
                                method: "POST",
                                headers: {
                                    'Content-type' : 'application/json'
                                },
                                body: JSON.stringify(data3)
                            })
                            .then((result) => result.text())
                            .then((result)=>{
                                var res;

                                try {
                
                                    this.setState({ apiResponse:JSON.parse(result) });
                                    res = JSON.parse(result);
                                } catch(error) {
                
                                    this.setState({ apiResponse:result });
                                    res = result;
                                }
        
                                if(res.length < 1 || (res.code && res.code === 404)) {
                                    this.setState({ empty: true, errorMessage: res.message });
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
                        }
                    });
                }
            });
        }

        else {

            const data4 = {
                email: this.state.email,
                password: this.state.oldPassword,
            }

            fetch('http://localhost:9000/loginCliente/clienteLogged', {
                method: "POST",
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(data4)
            })
            .then((result) => result.text())
            .then((result)=>{
                var res;

                try {

                    this.setState({ apiResponse:JSON.parse(result) });
                    res = JSON.parse(result);
                } catch(error) {

                    this.setState({ apiResponse:result });
                    res = result;
                }

                if(res.length < 1 || (res.code && res.code === 404)) {
                    this.setState({ empty: true, errorMessage: res.message });
                }

                else if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
                    window.scrollTo(0, 0);
                    this.setState({ error: true });
                    this.setState({ errorMessage: this.state.apiResponse.message });
                }
                else {
                    
                    const data5 = {
                        email: this.state.email,
                        password: this.state.newPassword,
                    }

                    fetch('http://localhost:9000/updateClientePassword/updPassword', {
                        method: "POST",
                        headers: {
                            'Content-type' : 'application/json'
                        },
                        body: JSON.stringify(data5)
                    })
                    .then((result) => result.text())
                    .then((result)=>{
                        var res;

                        try {
        
                            this.setState({ apiResponse:JSON.parse(result) });
                            res = JSON.parse(result);
                        } catch(error) {
        
                            this.setState({ apiResponse:result });
                            res = result;
                        }

                        if(res.length < 1 || (res.code && res.code === 404)) {
                            this.setState({ empty: true, errorMessage: res.message });
                        }

                        else if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
                            window.scrollTo(0, 0);
                            this.setState({ error: true });
                            this.setState({ errorMessage: this.state.apiResponse.message });
                        }
                        else {

                            const data6 = {
                                email: this.state.email
                            }
        
                            fetch('http://localhost:9000/searchCliente/results', {
                                method: "POST",
                                headers: {
                                    'Content-type' : 'application/json'
                                },
                                body: JSON.stringify(data6)
                            })
                            .then((result) => result.text())
                            .then((result)=>{
                                var res;

                                try {
                
                                    this.setState({ apiResponse:JSON.parse(result) });
                                    res = JSON.parse(result);
                                } catch(error) {
                
                                    this.setState({ apiResponse:result });
                                    res = result;
                                }
        
                                if(res.length < 1 || (res.code && res.code === 404)) {
                                    this.setState({ empty: true, errorMessage: res.message });
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
                        }
                    });
                }
            });
        }
    }

    render() {

        var documentoProp;
        var nome = this.state.nome;
        var cognome = this.state.cognome;
        var nascita = this.state.nascita
        var email = this.state.email;
        var telefono = this.state.telefonoTXT;

        if(!localStorage.getItem('logged')) {
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

        if(this.state.empty) {
            return(
                <Form className="contenitoreDatiPersonali">
                    <div className="DatiPersonali">
                        <h2>Qui puoi modificare i tuoi dati personali!</h2>
                            <Accordion >
                                <p>Si è verificato un errore: {this.state.errorMessage}</p>
                            </Accordion>
                    </div>
                </Form>
                            
                        
            );
        }

        if(localStorage.getItem('proprietario')) {

            var num_documento = this.state.num_documentoTXT;

            documentoProp = (
                <Card id="DatiPersonaliCarta" border="light">
                    <div className="view-cont">
                        <div className="sx-head">
                            <p>Documento: {num_documento}</p>
                        </div>
                    <Accordion.Toggle as={AiOutlineEdit} className="penna" variant="link" eventKey="2">
                    Modifica
                    </Accordion.Toggle>
                    </div>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                        <Form.Row>
                    <Form.Group as={Col} controlId="formGridDocument">
                        <Form.Label>Numero documento</Form.Label>
                        <Form.Control 
                            type="document_num" 
                            defaultValue = {num_documento}
                            id = "num_documento"
                            name = "num_documento"
                            onChange = {this.onChange}
                        />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridState" >
                    <Form.Label>Tipo documento</Form.Label>
                    <Form.Control as="select" className="prova" required>
                        <option></option>
                        <option>Carta di identità</option>
                        <option>Patente</option>
                        <option>Passaporto</option>
                    </Form.Control>
                    </Form.Group>
                </Form.Row>
                    <button type="submit" onClick = {this.onSubmit}>
                        Modifica 
                    </button>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            );
        }
            
        return(
            <Form className="contenitoreDatiPersonali" onSubmit = {this.onSubmit}>
                <>
                <Alert show={this.state.success} variant="success">
                <Alert.Heading style = {{fontWeight: 'bold'}}>Modifiche avvenute con successo!</Alert.Heading>
                <p>
                    Le modifiche del tuo account sono state correttamente caricate e memorizzate all'interno del sistema.
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
                    <Alert.Heading style = {{fontWeight: 'bold'}}>Modifiche non avvenute!</Alert.Heading>
                    <p>
                        La password non è stata modificata correttamente a causa di un errore!
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => this.setShowErr(false)} variant="outline-success">
                        <span style = {{fontWeight: 'bold'}}>Ok</span>
                        </Button>
                    </div>
                    </Alert>
                </>
                <div className="DatiPersonali">
                <h2>Qui puoi modificare i tuoi dati personali!</h2>
                <Accordion >
                <Card id="DatiPersonaliCarta1" border="no">
                        <div className="first-cont">
                        <div className="datiprofilo">
                            <p>Nome: {nome} </p>
                            <p>Cognome: {cognome}</p>
                            <p>Email: {email} </p>
                            <p>Data di nascita: {nascita}</p>
                        </div>
                        <RiAccountBoxLine className="imgprof" />
                    </div>
                </Card>
                {documentoProp}
                <Card id="DatiPersonaliCarta" border="light">
                        <div className="view-cont">
                        <div className="sx-head">
                            <p>Cambia la tua password</p>
                        </div>
                        <Accordion.Toggle as={AiOutlineEdit} className="penna" variant="link" eventKey="3">
                        </Accordion.Toggle>
                        </div>
                    <Accordion.Collapse eventKey="3"> 
                        <Card.Body>
                        <Form.Row>
                        <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Inserisci vecchia Password</Form.Label>
                <Form.Control 
                    type="password" 
                    title="Almeno 8 caratteri, una lettera maiuscola e un numero" 
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                    placeholder="Password" 
                    id = 'oldPassword'
                    name = 'oldPassword'
                    onChange={this.onChange} 
                    required/>
            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                        <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Nuova Password</Form.Label>
                <Form.Control 
                    type="password" 
                    title="Almeno 8 caratteri, una lettera maiuscola e un numero" 
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                    placeholder="Password" 
                    id = 'newPassword'
                    name = 'newPassword'
                    onChange={this.onChange} 
                    required/>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Ripeti Password</Form.Label>
                <Form.Control 
                    type="password" 
                    title="Almeno 8 caratteri, una lettera maiuscola e un numero" 
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                    placeholder="Password" 
                    id = 'confirmPassword'
                    name = 'confirmPassword'
                    onChange={this.onChange} 
                    required/>
            </Form.Group>
                        </Form.Row>
                        <button type="submit" onClick = {this.onSubmitPassword}>
                            Modifica password
                        </button>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card id="DatiPersonaliCarta" border="light">
                        <div className="view-cont">
                        <div className="sx-head">
                            <p>Numero di telefono: {telefono}</p>
                            </div>
                            <Accordion.Toggle as={AiOutlineEdit} className="penna" variant="link" eventKey="4">
                        </Accordion.Toggle>
                        </div>
                    <Accordion.Collapse eventKey="4">
                        <Card.Body>
                            <Form.Row>
                            <Form.Group as={Col} controlId="formGridIndirizzo">
                <Form.Label>Telefono</Form.Label>
                <Form.Control 
                    type = "tel" 
                    placeholder = "Telefono" 
                    id = 'telefono'
                    name = 'telefono'
                    onChange = {this.onChange} 
                    required
                />
            </Form.Group>
                            </Form.Row>
                            <button type="submit" onClick = {this.onSubmit}>
                                Modifica numero
                            </button>
                        </Card.Body>

                    </Accordion.Collapse>
            </Card>
                </Accordion>
                </div>
            </Form>      
        );
    }
}
export default DatiPersonali
