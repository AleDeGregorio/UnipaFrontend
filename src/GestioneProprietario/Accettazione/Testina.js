import React from 'react';
import {Tabs, Tab} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import ListPrAccettare from './ListPrAccettare';
import ElencoCheck from './ElencoCheck';
import './Accettazione.css'

class Testina extends React.Component {

    constructor(props) {
        
        super(props);

        this.state = {
            apiResponse_accettazione: [],
            apiResponse_accettate: [],
            email_prop: localStorage.getItem('email'),
            error: false,
            errorMessage: ''
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
        else {
            return( 
                <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="vogliostilizzarti">
                    <Tab eventKey="home" title="Accetta Prenotazioni" id="vogliostilizzarti2">
                        <ListPrAccettare />       
                    </Tab>
                    <Tab eventKey="profile" title="Check-in" id="vogliostilizzarti2">
                        <ElencoCheck />
                    </Tab>
                </Tabs>
            );
        }
    }  
}
export default Testina;