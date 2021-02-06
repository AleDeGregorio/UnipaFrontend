/*CSS COMPLETATO*/

import React from 'react';    
import {Form, Button} from 'react-bootstrap'
//import { Col, Row } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import './autenticazione.css'


function autenticazioneRegistrati(){
    return(

        <Form className="contenitoreAutenticazioneRegistrati">
            <div className="contentNewCheckAutenticazione">
                <h2>Iscriviti</h2>
                <div className="contenitorePulsanti">
                    <Button variant="primary" type="submit" className="pulsanti" href="/autenticazioneRegistratiCliente">
                        Cliente
                    </Button>
                    <Button variant="primary" type="submit" className="pulsanti" href="/autenticazioneRegistratiProprietario">
                        Proprietario
                    </Button>
                </div>
                <label>Sei già iscritto?<Link to="/autenticazioneAccedi"> ACCEDI</Link></label>
            </div>
        </Form>

    );
}
export default autenticazioneRegistrati