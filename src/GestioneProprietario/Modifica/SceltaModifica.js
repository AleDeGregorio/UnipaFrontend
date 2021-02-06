import React from 'react';
//import Card from 'react-bootstrap/Card'
//import CardColumns from 'react-bootstrap/CardColumns'
import './SceltaModifica.css'
//import {SiCashapp} from "react-icons/si";
//import {RiAccountBoxLine} from "react-icons/ri";
//import {Link} from 'react-router-dom'
//import {Col} from 'react-bootstrap'
import ElencoCasaVacanza from './ElencoCasaVacanza'
import ElencoBeB from './ElencoB&B'

import { Redirect } from 'react-router-dom';

class SceltaModifica extends React.Component{
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
                <div className="sceltaModificaContainer">
                    <div className="liste">
                    <ElencoCasaVacanza />
                    </div>
                    <div className="liste">
                    <ElencoBeB />
                     </div>
               </div>
            );
        }
    }
}
export default SceltaModifica;