import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import {CgProfile} from 'react-icons/cg'
import './NavCss.css'
import { Redirect } from 'react-router-dom';

class NavBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tipo: '',
            apiResponse: [],
            error: false,
            errorMessage: '',
            redirect: false
        }
    }
    
    onClick = () => {
        localStorage.clear();
    }

    cercaBB = () => {

        if(this.state.apiResponse !== []) {
            this.setState({
                tipo: '',
                apiResponse: [],
                error: false,
                errorMessage: '',
                redirect: false
            })
        }

        this.setState({ tipo: 'bb' });

        const data = {
            tipo: 'bb',
            localita: '',
            provincia: '',
            servizi: '',
            posti: '%%',
            costo: '',
            checkIn: '',
            checkOut: ''
        };

        fetch('http://localhost:9000/ricercaAlloggio/risultati', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((result) => result.text())
        .then((result) => {

            try {
                this.setState({ apiResponse: JSON.parse(result) });
                
            } catch (error) {
                this.setState({ apiResponse: result });

                this.setState({ empty: true });
            }

            if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
                this.setState({ error: true });
                this.setState({ errorMessage: this.state.apiResponse.message });
            }
            else {
                this.setState({ redirect: true })
                window.location.reload();
            }
        });
    }

    cercaCV = () => {

        if(this.state.apiResponse !== []) {
            this.setState({
                tipo: '',
                apiResponse: [],
                error: false,
                errorMessage: '',
                redirect: false
            })
        }

        this.setState({ tipo: 'cv' });

        const data = {
            tipo: 'cv',
            localita: '',
            provincia: '',
            servizi: '',
            posti: '%%',
            costo: '',
            checkIn: '',
            checkOut: ''
        };

        fetch('http://localhost:9000/ricercaAlloggio/risultati', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((result) => result.text())
        .then((result) => {

            try {
                this.setState({ apiResponse: JSON.parse(result) });
                
            } catch (error) {
                this.setState({ apiResponse: result });

                this.setState({ empty: true });
            }

            if(this.state.apiResponse.status && this.state.apiResponse.status === 'error') {
                this.setState({ error: true });
                this.setState({ errorMessage: this.state.apiResponse.message });
            }
            else {
                this.setState({ redirect: true })
                window.location.reload();
            }
        });
    }

    render() {
        var loggato = <Nav.Link href="/autenticazioneAccedi">ACCEDI</Nav.Link>;
        var nome = '';
        var cognome = '';
        
        if(localStorage.getItem('logged') && localStorage.getItem('cliente')) {
            nome = localStorage.getObj('user_data')[0].nome_cl ? localStorage.getObj('user_data')[0].nome_cl : localStorage.getObj('user_data')[0].nome_prop;
            cognome = localStorage.getObj('user_data')[0].cognome_cl ? localStorage.getObj('user_data')[0].cognome_cl : localStorage.getObj('user_data')[0].cognome_prop;
            
            loggato = (
                <Dropdown>
                    <Dropdown.Toggle id="dropNavLog">
                        {nome} {cognome}<Menu />
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        <Dropdown.Item href="/GestionePrenotazione" >Gestisci prenotazioni</Dropdown.Item>
                        <Dropdown.Item href="/DiventaHost">Diventa un host</Dropdown.Item>
                        <Dropdown.Item href="/DatiPersonali">Dati personali</Dropdown.Item>
                        <Dropdown.Item href="/autenticazioneAccedi" onClick = {this.onClick}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ); 
        }

        if(localStorage.getItem('logged') && localStorage.getItem('proprietario')) {
            loggato = (
                <Nav>
                    <Nav.Link href="/PaginaProprietario">Area personale host</Nav.Link>
                    <Nav.Link href="/autenticazioneAccedi" onClick = {this.onClick}>ESCI</Nav.Link>
                </Nav>
            );
        }

        if(localStorage.getItem('logged') && localStorage.getItem('proprietario') && localStorage.getItem('cliente')) {
            nome = localStorage.getObj('user_data')[0].nome_cl ? localStorage.getObj('user_data')[0].nome_cl : localStorage.getObj('user_data')[0].nome_prop;
            cognome = localStorage.getObj('user_data')[0].cognome_cl ? localStorage.getObj('user_data')[0].cognome_cl : localStorage.getObj('user_data')[0].cognome_prop;
            
            loggato = (
                <Dropdown>
                    <Dropdown.Toggle id="dropNavLog">
                        {nome} {cognome}<Menu />
                    </Dropdown.Toggle>
                    <Dropdown.Menu >
                        <Dropdown.Item href="/GestionePrenotazione">Le tue prenotazioni</Dropdown.Item>
                        <Dropdown.Item href="/PaginaProprietario">Area personale host</Dropdown.Item>
                        <Dropdown.Item href="/DatiPersonali">Dati personali</Dropdown.Item>
                        <Dropdown.Item href="/autenticazioneAccedi" onClick = {this.onClick}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ); 
        }

        if(this.state.redirect) {

            return (
                <> 
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="/">Sito Progetto</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href="/">Home</Nav.Link>
                                <Nav.Link onClick = {this.cercaBB}>B&B</Nav.Link>
                                <Nav.Link onClick = {this.cercaCV}>Casa Vacanza</Nav.Link>
                            </Nav>
                                {loggato}
                        </Navbar.Collapse>
                    </Navbar>
                    <Redirect 
                        to = {{
                            pathname: "/RisultatiRicerca",
                            state: {
                                case: this.state.apiResponse,
                                tipo: this.state.tipo
                            }
                        }}
                    />
                </>
            )
        }

        return(
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Sito Progetto</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link onClick = {this.cercaBB}>B&B</Nav.Link>
                        <Nav.Link onClick = {this.cercaCV}>Casa Vacanza</Nav.Link>
                    </Nav>
                        {loggato}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavBar;

function Menu (){
    return(
        <CgProfile className="menu-prop" />
    )
}
/*<Dropdown>
                   <Dropdown.Toggle as={Menu}>
                 </Dropdown.Toggle>

             <Dropdown.Menu >
               <Dropdown.Item eventKey="1">Gestisci prenotazioni</Dropdown.Item>
               <Dropdown.Item eventKey="2">Logout</Dropdown.Item>
               <Dropdown.Item eventKey="3"></Dropdown.Item>
               
              </Dropdown.Menu>
             </Dropdown>
             
             
                <Nav.Link href="/GestionePrenotazione">Le tue prenotazioni</Nav.Link>
                <Nav.Link href="/DiventaHost">Diventa un Host</Nav.Link>
                <Nav.Link href="/autenticazioneAccedi" onClick = {this.onClick}>Logout</Nav.Link>
                <Nav.Link href="/DatiPersonali">Modifica Account</Nav.Link>
             */

             