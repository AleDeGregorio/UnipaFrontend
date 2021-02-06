/*CSS COMPLETATO*/

import React from 'react';    
import {Form, Col, Button} from 'react-bootstrap'
//import { Row } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import './autenticazione.css'

import { Redirect } from 'react-router-dom';

class autenticazioneAccedi extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            dati_casa: this.props.history.location.state ? this.props.history.location.state.dati_casa : [],
            dati_servizi: this.props.history.location.state ? this.props.history.location.state.dati_servizi : [],
            checkIn: this.props.history.location.state ? this.props.history.location.state.checkIn : '',
            checkOut: this.props.history.location.state ? this.props.history.location.state.checkOut : '',
            posti: this.props.history.location.state ? this.props.history.location.state.posti : 1,
            tipo: this.props.history.location.state ? this.props.history.location.state.tipo : '',
            datiRicerca: this.props.history.location.state ? this.props.history.location.state.datiRicerca : []
        }
    }

    handleChange = (e) => {
        this.props.onChange(e);
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        var messaggioErrore;

        if(this.props.error && this.props.errorMessage !== '') {
            messaggioErrore = <p style={{color: 'red'}}>Nome utente o password errati</p>;
        }

        if((this.props.successCliente || this.props.successProprietario) && !Array.isArray(this.state.dati_casa)) {

            return (
                <Redirect 
                    to = {{
                    pathname: "/Alloggio",
                    state: {
                        dati_casa: this.state.dati_casa,
                        servizi: this.state.dati_servizi,
                        posti: this.state.posti,
                        checkIn: this.state.checkIn,
                        checkOut: this.state.checkOut,
                        tipo: this.state.tipo,
                        datiRicerca: this.state.datiRicerca
                    }
                    }}
                />
            );
        }

        if(this.props.successCliente) {
            return <Redirect to = "/" />
        }
        
        if(this.props.successProprietario) {
            return <Redirect to = "/PaginaProprietario" />
        }

        return(
            <div className="accedi">
                <Form className="contenitoreAutenticazione" onSubmit = {this.props.onSubmitLogin}>
                    <h2>Accedi</h2>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Control type="email" name = "email" placeholder="E-mail" onChange = {this.handleChange} required />
                        </Form.Group>
            
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Control type="password" name = "password" placeholder="Password" onChange = {this.handleChange} required/>
                        </Form.Group>
                        {messaggioErrore}
                        <label>Non sei iscritto?<Link to="/autenticazioneRegistrati"> REGISTRATI</Link></label>
                    <Button variant="primary" type="submit" className="pulsante">
                        Accedi
                    </Button>
                </Form>
            </div>
        );
    }
}

export default autenticazioneAccedi