import React from 'react';    
import {Form, Col, Button} from 'react-bootstrap'
//import { Row } from 'react-bootstrap
import {Link} from 'react-router-dom'
import './autenticazione.css'

import { Redirect } from 'react-router-dom';

class autenticazioneRegistratiProprietario extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            nome: '',
            cognome: '',
            nascita: '',
            num_documento: '',
            telefono: '',
            apiResponse: [],
            error:false,
            errorPswd: false,
            errorMessage:'',
            success: false, 
            empty: false,
            maxDate: ''
        };
    }

    componentDidMount() {

        var today = new Date();
        const offset = today.getTimezoneOffset()
        today = new Date(today.getTime() - (offset*60*1000))
        
        this.setState({ maxDate: today.toISOString().slice(0,10) })
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmitInsert = (e) => {
        e.preventDefault();

        if(this.state.password !== this.state.confirmPassword) {
            this.setState({ 
                errorPswd: true
            });

            return;
        }

        const data = {
            email: this.state.email,
            password: this.state.password,
            nome: this.state.nome,
            cognome: this.state.cognome,
            nascita: new Date(this.state.nascita).toLocaleDateString(),
            num_documento: this.state.num_documento,
            telefono: this.state.telefono
        }

        fetch('http://localhost:9000/insertProprietario/new', {
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
                const data2 = {
                    email: this.state.email,
                    password: this.state.password,
                    nome: this.state.nome,
                    cognome: this.state.cognome,
                    nascita: new Date(this.state.nascita).toLocaleDateString(),
                    telefono: this.state.telefono
                }
        
                fetch('http://localhost:9000/insertCliente/new', {
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
                      this.setState({ error: true });
                      this.setState({ errorMessage: this.state.apiResponse.message });
                    }
                    else {
                        this.setState({ success: true })
                    }
                });
            }
        });
    }

    render() {
        var pswdError;

        if(this.state.success) {
            return (
                <div className = 'Errore'>
                    <h1>Registrazione avvenuta con successo!</h1>
                    <p>Effettua pure il login, e comincia a navigare dove preferisci</p>
                </div>
            );
        }
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
        if(this.state.errorMessage) {
            return (
                <Form className="contenitoreAutenticazione" onSubmit={this.props.onSubmitInsert}>
                    <div className="contentNewCheckAutenticazione">
                        <h2>Iscriviti</h2>
                        <p>Si è verificato un errore: {this.state.errorMessage}</p>

                        <Link to="/autenticazioneRegistrati">Torna indietro</Link>
                    </div>
                </Form>
            );
        }
        if(this.state.errorPswd) {
            pswdError = (
                <p style = {{color: 'red'}}>Password non coincidenti</p>
            );
        }

        return (
            <Form className="contenitoreAutenticazione" onSubmit={this.onSubmitInsert}>
                <div className="contentNewCheckAutenticazione">
                    <h2>Iscriviti</h2>

                    <Form.Group as={Col} controlId="formGridName">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control 
                            type = "name" 
                            placeholder = "Nome" 
                            id = 'nome'
                            name = 'nome'
                            onChange = {this.onChange} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridSurname">
                        <Form.Label>Cognome</Form.Label>
                        <Form.Control 
                            type = "surname" 
                            placeholder = "Cognome" 
                            id = 'cognome'
                            name = 'cognome'
                            onChange = {this.onChange} 
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control 
                            type = "email" 
                            placeholder = "E-mail" 
                            id = 'email'
                            name = 'email'
                            onChange = {this.onChange} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type = "password" 
                            placeholder = "Password" 
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                            id = 'password'
                            name = 'password'
                            onChange = {this.onChange} 
                            required
                        />
                        <Form.Label>Conferma password</Form.Label>
                            <Form.Control 
                                type="password" 
                                title="Almeno 8 caratteri, una lettera maiuscola e un numero" 
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                                placeholder="Conferma password" 
                                id = 'confirmPassword'
                                name = 'confirmPassword'
                                onChange={this.onChange} 
                                required/>
                        {pswdError}
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridIndirizzo">
                        <Form.Label>Telefono</Form.Label>
                        <Form.Control 
                            type = "tel" 
                            placeholder = "Telefono" 
                            pattern = "^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$"
                            title = "Inserire il numero di telefono in un formato valido"
                            id = 'telefono'
                            name = 'telefono'
                            onChange = {this.onChange} 
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridIndirizzo">
                        <Form.Label>Numero documento</Form.Label>
                        <Form.Control 
                            type = "tel" 
                            placeholder = "Numero documento" 
                            id = 'num_documento'
                            name = 'num_documento'
                            onChange = {this.onChange} 
                            required
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridCap">
                        <Form.Label>Data di nascita</Form.Label>
                        <Form.Control 
                            type="date" 
                            required 
                            className="inputSignUp" 
                            onChange={this.onChange} 
                            id = 'nascita'
                            name = 'nascita'
                            max = {this.state.maxDate}
                        />
                    </Form.Group>

                    <Link to="/autenticazioneRegistrati">Torna indietro</Link>
                </div>
            
                <Button variant="primary" className="pulsante" onClick = {this.onSubmitInsert}>
                    Registrati
                </Button>
            </Form>
        );
    }
}
export default autenticazioneRegistratiProprietario