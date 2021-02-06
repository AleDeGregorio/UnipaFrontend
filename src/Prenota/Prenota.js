import React from 'react';
import {Form,Col,Button,Accordion,Card, Alert} from 'react-bootstrap'
import './Prenota.css'
import {Redirect} from "react-router-dom";

class Prenota extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dati_casa: this.props.history.location.state ? this.props.history.location.state.dati_casa : [],
            checkIn: this.props.history.location.state? this.props.history.location.state.checkIn : '',
            checkOut: this.props.history.location.state ? this.props.history.location.state.checkOut : '',
            posti: this.props.history.location.state ? this.props.history.location.state.posti : 1,
            numPosti: [],
            numPostiProps: [],
            maxDate: '',
            partenza: '',
            ritorno: '',
            pagamento: '',
            cf: '',
            nome: '',
            cognome: '',
            nascita: '',
            soggiornanti: [],
            apiRespone: [],
            error: false,
            errorMessage: '',
            success: false,
            incomplete: false,
            successSoggiornante: false,
            errorSoggiornante: false
        }
    }

     componentDidMount(){
        if(this.state.checkIn !== '' && this.state.checkOut !== '') {
            var str1 = this.state.checkIn;
            var dmy1 = str1.split("/");
            var date1 = new Date(dmy1[2], dmy1[1] - 1, dmy1[0]);
            var offset1 = date1.getTimezoneOffset();
            date1 = new Date(date1.getTime() - (offset1*60*1000));

            var str2 = this.state.checkOut;
            var dmy2 = str2.split("/");
            var date2 = new Date(dmy2[2], dmy2[1] - 1, dmy2[0]);
            var offset2 = date2.getTimezoneOffset();
            date2 = new Date(date2.getTime() - (offset2*60*1000));

            this.setState({ 
                partenza: date1.toISOString().slice(0,10),
                ritorno: date2.toISOString().slice(0,10)
            });
        }

        var array = [];

        for(var i = 0; i < this.state.dati_casa.posti; i++) {
        array[i] = i;
        array[i]++;
        }

        this.setState({ 
            numPosti: array,
            numPostiProps: array 
        });

        var today = new Date();
        const offset = today.getTimezoneOffset()
        today = new Date(today.getTime() - (offset*60*1000))
        
        this.setState({ maxDate: today.toISOString().slice(0,10) })
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value })

        if(e.target.id === 'posti') {

            var array = [];

            for(var i = 0; i < e.target.value; i++) {
                array[i] = i;
                array[i]++;
            }

            this.setState({ numPosti: array });
        }
    }

    setShowSucc = (e) => {
        this.setState({ success: e })
    }

    setShowErr = (e) => {
        this.setState({ error: e })
    }

    setShowSuccSogg = (e) => {
        this.setState({ successSoggiornante: e })
    }

    setShowErrSogg = (e) => {
        this.setState({ errorSoggiornante: e })
    }

    setShowIncomplete = (e) => {
        this.setState({ incomplete: e })
    }

    onSubmit = (e) => {
        e.preventDefault();

        if(this.state.pagamento === '' || this.state.soggiornanti.length < this.state.posti) {
            window.scrollTo(0, 0);
            this.setState({ incomplete: true });
            return;
        }

        for(var i = 0; i < this.state.soggiornanti.length; i++) {
            const data = {
                ref_soggiornante: this.state.soggiornanti[i],
                ref_cliente: localStorage.getItem("email"),
                ref_proprietario: this.state.dati_casa.ref_proprietario,
                ref_proprieta: this.state.dati_casa.id_proprieta,
                num_soggiornanti: this.state.posti,
                costo: this.state.pagamento === 'ora' ? (this.state.dati_casa.costo + this.state.posti*3) : this.state.dati_casa.costo,
                caparra: this.state.pagamento === 'ora' ? 0 : this.state.dati_casa.costo,
                data_partenza: this.state.checkIn,
                data_ritorno: this.state.checkOut
            };
        
            fetch('http://localhost:9000/insertPrenotazione/new', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((result) => result.text())
            .then((result) => {
                try {

                    this.setState({ apiRespone: JSON.parse(result) });
                } catch(error) {

                    this.setState({ apiRespone: result });
                }
        
                if(this.state.apiRespone.status && this.state.apiRespone.status === 'error') {
                    window.scrollTo(0, 0);
                    this.setState({ error: true });
                    this.setState({ errorMessage: this.state.apiRespone.message });
                }
            });
        }  
        if(!this.state.error) {
            window.scrollTo(0, 0);
            this.setState({ success: true, error: false },()=>{
                window.setTimeout(()=>{
                    this.setState({success:false})
                }, 3000)
            }) 
        } 
    }

    onSubmitSoggiornante = (e) => {

        e.preventDefault();

        const data = {
          cf: this.state.cf,
          nome: this.state.nome,
          cognome: this.state.cognome,
          nascita: new Date(this.state.nascita).toLocaleDateString()
        };
    
        fetch('http://localhost:9000/insertSoggiornante/new', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((result) => result.text())
        .then((result) => {
            var res;

            try {
                res = JSON.parse(result);
            }
            catch(e) {
                res = result;
            }
    
            if(res.status && res.status === 'error') {
                window.scrollTo(0, 0);
                this.setState({ errorSoggiornante: true });
                this.setState({ errorMessage: res.message });
            }

            else {
                window.scrollTo(0, 0);
                this.setState({
                    successSoggiornante: true,
                    errorSoggiornante: false,
                    soggiornanti: this.state.soggiornanti.concat(this.state.cf)
                }, () => {
                    window.setTimeout(()=>{
                        this.setState({successSoggiornante:false})
                    }, 3000)
                })
            }
        });
    }
    
    render(){
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

        return(
            <div className="prenota-cont">
                <>
                    <Alert show={this.state.incomplete} variant="danger" id = "allerta">
                    <Alert.Heading style = {{fontWeight: 'bold'}}>Dati non completi!</Alert.Heading>
                    <p>
                        Non tutti i campi risultano essere compilati correttamente &nbsp;
                        Inserisci tutti i dati necessari per proseguire
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => this.setShowIncomplete(false)} variant="outline-success">
                        <span style = {{fontWeight: 'bold'}}>Ok</span>
                        </Button>
                    </div>
                    </Alert>
                </>
                <>
                    <Alert show={this.state.success} variant="success" id = "allerta">
                    <Alert.Heading style = {{fontWeight: 'bold'}}>Prenotazione avvenuta con successo!</Alert.Heading>
                    <p>
                        Il pagamento è avvenuto correttamente <br/>
                        Le informazioni della tua prenotazione sono state prese in carico dal sistema e verranno presto inoltrate al
                        gestore della struttura
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
                    <Alert show={this.state.error} variant="danger" id = "allerta">
                    <Alert.Heading style = {{fontWeight: 'bold'}}>Prenotazione non avvenuta!</Alert.Heading>
                    <p>
                        Si è verificato un errore nell'inserimento dei dati, provare a ricompilare i campi
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => this.setShowErr(false)} variant="outline-success">
                        <span style = {{fontWeight: 'bold'}}>Ok</span>
                        </Button>
                    </div>
                    </Alert>
                </>
                <>
                    <Alert show={this.state.successSoggiornante} variant="success" id = "allerta">
                    <Alert.Heading style = {{fontWeight: 'bold'}}>Soggiornante registrato con successo!</Alert.Heading>
                    <p>
                        Le informazioni del soggiornante sono state correttamente caricate all'interno del sistema. &nbsp;
                        Compila le informazioni degli altri soggiornanti, se presenti
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => this.setShowSuccSogg(false)} variant="outline-success">
                        <span style = {{fontWeight: 'bold'}}>Ok</span>
                        </Button>
                    </div>
                    </Alert>
                </>
                <>
                    <Alert show={this.state.errorSoggiornante} variant="danger" id = "allerta">
                    <Alert.Heading style = {{fontWeight: 'bold'}}>Soggiornante non registrato!</Alert.Heading>
                    <p>
                        Si è verificato un errore nell'inserimento dei dati, provare a ricompilare i campi
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => this.setShowErrSogg(false)} variant="outline-success">
                        <span style = {{fontWeight: 'bold'}}>Ok</span>
                        </Button>
                    </div>
                    </Alert>
                </>
                <div className="prenota-sx-cont">
                    <h3>Conferma la tua prenotazione</h3>
                    <div className="infoviaggio">
                    <h5>Info viaggio</h5>
                    <Accordion>
                        <div className="headaccpren">
                            <p>Date:</p>
                            <Accordion.Toggle  eventKey="0" id="modifica">
                                Visualizza
                            </Accordion.Toggle>
                        </div>
                            <Accordion.Collapse eventKey="0">
                                <div>
                            <Form id="prenotaForm">
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridDate">
                                        <Form.Label>Check-In</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            placeholder="Inserisci data di inizio" 
                                            id = 'data_partenza'
                                            name = 'data_partenza'
                                            value = {this.state.partenza}
                                            disabled = "true"
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridDate1">
                                        <Form.Label>Check-Out</Form.Label>
                                        <Form.Control 
                                            type="date" 
                                            placeholder="Inserisci data di fine" 
                                            id = 'data_ritorno'
                                            name = 'data_ritorno'
                                            value = {this.state.ritorno}
                                            disabled = "true"
                                        />
                                    </Form.Group>
                                </Form.Row>
                            </Form>
                                </div>
                            </Accordion.Collapse>
                        <div className="headaccpren">
                            <p>Numero ospiti: </p>
                            <Accordion.Toggle eventKey="1" id="modifica">
                                Modifica
                            </Accordion.Toggle>
                        </div>
                        <Accordion.Collapse eventKey="1">
                        <Form id="prenotaFormOspiti">
                        <Form.Group as={Col} controlId="formGridDate">
                        <Form.Label>Ospiti</Form.Label>
                            <Form.Control as="select" onChange = {this.onChange} id="posti" value = {this.state.posti}>
                                {this.state.numPostiProps.map(item => (
                                <option value = {item} id = "posti">{item}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        </Form>
                        </Accordion.Collapse>
                        <div className="headaccpren">
                            <p>Dati dei soggiornanti: </p>
                            <Accordion.Toggle eventKey="2" id="modifica">
                                Compila
                            </Accordion.Toggle>
                        </div>
                        <Accordion.Collapse eventKey="2">
                        <Form id="prenotaFormOspiti">
                        <Form.Group as={Col} controlId="formGridDate">
                            {this.state.numPosti.map(item => (
                                <div>
                                    <Form.Label>Soggiornante {item}</Form.Label>
                                    <Form.Control as = "input" placeholder = "Codice fiscale" id = "cf" onChange = {this.onChange}/>
                                    <br />
                                    <Form.Control as = "input" placeholder = "Nome" id = "nome" onChange = {this.onChange}/>
                                    <br />
                                    <Form.Control as = "input" placeholder = "Cognome" id = "cognome" onChange = {this.onChange}/>
                                    <br />
                                    <Form.Control type = "date" max = {this.state.maxDate} placeholder = "Data di nascita" id = "nascita" onChange = {this.onChange}/>
                                    <br />
                                    <button className = "bottonePrenota" onClick = {this.onSubmitSoggiornante}>Registra soggiornante</button>
                                </div>
                            ))}
                        </Form.Group>
                        </Form>
                        </Accordion.Collapse>
                    </Accordion>
                        <div>
                            <h4>Scegli come pagare</h4>
                            <div className="containerPaga">
                                    <div className="paga">
                                        <h5>Paga per intero</h5>
                                        <div className="row-flex">
                                            <Form.Check inline label="Paga adesso" type="radio" id="pagamento" name = "pagamento" value = "ora" onChange = {this.onChange}/>
                                            <p>Nel caso in cui tu voglia pagare già adesso le tasse di soggiorno</p>
                                        </div>
                                    </div>
                                    <div className="paga">
                                        <h5>Paga una parte</h5>
                                        <div className="row-flex">
                                        <Form.Check inline label="Paga dopo" type="radio" id="pagamento" name = "pagamento" value = "dopo" onChange = {this.onChange}/>
                                        <p>Nel caso in cui tu voglia pagare in loco le tasse di soggiorno, o disponga di una esenzione</p>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div> 
                    <button className="bottonePrenota" onClick = {this.onSubmit}>Prenota e Paga</button>    
                </div>
                <div className="prenota-dx-cont">
                    <Card id="cartaInfo">
                        <Card.Body>
                            <h3>INFO PRENOTAZIONE!</h3>
                            <Card.Title>Riepilogo alloggio</Card.Title>
                            <Card.Text>
                                {this.state.dati_casa.tipo_proprieta === 'cv' ? "Casa vacanza" : "B&B"} &nbsp;
                                {this.state.dati_casa.nome_proprieta},&nbsp;
                                {this.state.dati_casa.localita} ({this.state.dati_casa.provincia})
                            </Card.Text>
                            <Card.Title>Periodo</Card.Title>
                            <Card.Text>{this.state.checkIn} - {this.state.checkOut}</Card.Text>
                            <Card.Title>Numero di ospiti</Card.Title>
                            <Card.Text>{this.state.posti} {this.state.posti === 1 ? "persona" : "persone"}</Card.Text>
                            <Card.Title>Costo alloggio</Card.Title>
                            <Card.Text>€{this.state.dati_casa.costo}</Card.Text>
                            <Card.Title>Costo tassa di soggiorno</Card.Title>
                            <Card.Text>€3 per ogni soggiornante</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
}
export default Prenota;