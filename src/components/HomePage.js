import React from 'react';
import './HomePage.css';
//import {Card} from 'react-bootstrap'
//import { CardDeck } from 'react-bootstrap'
//import ProvaRicerca from '../ProvaRicerca/ProvaRicerca';
//import Carta from './Carta'
//import SecondaRicerca from '../secondaRicerca/secondaRicerca'
//import SearchPage from '../RicercaVecchia/SearchPage'
import Ricerca from '../Ricerca/Ricerca'

function HomePage(){
    return(
        <div className="HomePage">
            <div className="ricerca">
                <Ricerca/>
            </div>
            <div className="scritta">
                <h1>Cerca l'esperienza giusta per te</h1>
            </div>
        </div>
    );
}

export default HomePage;
