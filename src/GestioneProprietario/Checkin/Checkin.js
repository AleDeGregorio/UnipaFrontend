/*CSS FATTO*/ 

import React from 'react';    
import {Form, Col, Button, Alert} from 'react-bootstrap'
import './Checkin.css'
import moment from "moment";

import { Redirect } from "react-router-dom";

class Checkin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dati: this.props.history.location.state ? this.props.history.location.state.dati : [],
            foto1SRC: '',
            foto1: null,
            foto2SRC: '',
            foto2: null,
            apiResponse: [],
            error: false,
            errorMessage: '',
            success: false,
            tassa: 3,
            complete: false
        }
    }

    componentDidMount() {

        var nascita =  this.state.dati.data_nascita_sogg ? moment(new Date(this.state.dati.data_nascita_sogg).toLocaleDateString(), "DD-MM-YYYY") : null;
        var oggi = moment(new Date().toLocaleDateString(), "DD-MM-YYYY");
        
        var eta = nascita ? oggi.diff(nascita, 'years') : 1;

        if(eta < 18 || eta >= 75) {
            this.setState({ tassa: 0 });
        }
    }

    setShowSucc = (e) => {
        this.setState({ success: e })
    }
    
    setShowErr = (e) => {
        this.setState({ error: e })
    }

    onChangeFoto = (e) => {
        this.setState({ [e.target.name]: URL.createObjectURL(e.target.files[0]) })
        this.setState({ [e.target.id]: e.target.files[0] });

        if(e.target.id === 'foto2') {
            this.setState({ tassa: 0 })
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        const data = {
            ref_soggiornante: this.state.dati.ref_soggiornante,
            ref_proprietario: this.state.dati.ref_proprietario,
            data_partenza: new Date(this.state.dati.data_partenza).toLocaleDateString(),
            data_ritorno: new Date(this.state.dati.data_ritorno).toLocaleDateString(),
            ammontare: this.state.tassa
        }

        fetch('http://localhost:9000/insertTassa/new', {
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
                window.scrollTo(0, 0);
                this.setState({ error: true });
                this.setState({ errorMessage: this.state.apiResponse.message });
            }

            else {

                const data = {
                    id_prenotazione: this.state.dati.id_prenotazione,
                }
        
                fetch('http://localhost:9000/checkinPrenotazione/checkin', {
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
                        this.setState({ apiResponse: JSON.parse(result) });
                        
                        res = JSON.parse(result);
                    } catch (error) {
                        this.setState({ apiResponse: result });
                        
                        res = result;

                        this.setState({ empty: true });
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
                        
                        window.scrollTo(0, 0);
                        this.setState({success:true, error: false},()=>{
                            window.scrollTo(0, 0);
                            window.setTimeout(()=>{
                                this.setState({success:false, complete: true})
                            }, 3000)
                        })
                    }
                });
            }
        });
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

        if(this.state.complete) {
            return <Redirect
                to={{
                    pathname: "/Testina"
                }}
            />
        }

        var pagata;
        var esente;

        if(this.state.dati.caparra > 0) {
            pagata = (
                <h4 style = {{color: 'red', fontWeight: 'bold'}}>La tassa risulta ancora da pagare</h4>
            );
        }

        else {
            pagata = (
                <h4 style = {{color: 'green', fontWeight: 'bold'}}>La tassa risulta già pagata</h4>
            );
        }

        if(this.state.tassa === 0 || this.state.foto2 !== null) {
            esente = (
                <h4 style = {{color: 'green', fontWeight: 'bold'}}>Il soggiornante è esente al pagamento della tassa</h4>
            );

            pagata = null;
        }

        return (  
            <Form className="contenitore" onSubmit = {this.onSubmit}>

                <>
                    <Alert show={this.state.success} variant="success" id="allerta" style = {{zIndex: 2}}>
                    <Alert.Heading style = {{fontWeight: 'bold'}}>Check-in effettuato con successo!</Alert.Heading>
                    <p>
                        Il check-in dell'ospite è stato registrato con successo. Inoltre, i suoi dati sono stati trasmessi con successo
                        alla Questura. Stai per essere reinderizzato alla pagina delle prenotazioni
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
                    <Alert show={this.state.error} variant="danger" id="allerta" style = {{zIndex: 2}}>
                    <Alert.Heading style = {{fontWeight: 'bold'}}>Check-in fallito!</Alert.Heading>
                    <p>
                        Si è verificato un errore nell'inserimento dei dati, e questi non sono ancora stati spediti alla Questura.
                        Riprovare.
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => this.setShowErr(false)} variant="outline-success">
                        <span style = {{fontWeight: 'bold'}}>Ok</span>
                        </Button>
                    </div>
                    </Alert>
                </>
            
            <div className="contentNewCheck">
                <h5>Compila questo form per effettuare il check-in degli ospiti della tua struttura!</h5>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="name" value={this.state.dati.nome_sogg} required />
                    </Form.Group>
    
                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control type="surname" value={this.state.dati.cognome_sogg} required/>
                    </Form.Group>
                </Form.Row>
    
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridCity">
                    <Form.Label>Città</Form.Label>
                    <Form.Control type="city" value={this.state.dati.localita} required/>
                    </Form.Group>
    
                    <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>Provincia</Form.Label>
                    <Form.Control as="select" value = {this.state.dati.provincia} required>
                            <option></option>
                            <option value="AG">Agrigento</option>
                            <option value="AL">Alessandria</option>
                            <option value="AN">Ancona</option>
                            <option value="AO">Aosta</option>
                            <option value="AR">Arezzo</option>
                            <option value="AP">Ascoli Piceno</option>
                            <option value="AT">Asti</option>
                            <option value="AV">Avellino</option>
                            <option value="BA">Bari</option>
                            <option value="BT">Barletta-Andria-Trani</option>
                            <option value="BL">Belluno</option>
                            <option value="BN">Benevento</option>
                            <option value="BG">Bergamo</option>
                            <option value="BI">Biella</option>
                            <option value="BO">Bologna</option>
                            <option value="BZ">Bolzano</option>
                            <option value="BS">Brescia</option>
                            <option value="BR">Brindisi</option>
                            <option value="CA">Cagliari</option>
                            <option value="CL">Caltanissetta</option>
                            <option value="CB">Campobasso</option>
                            <option value="CI">Carbonia-iglesias</option>
                            <option value="CE">Caserta</option>
                            <option value="CT">Catania</option>
                            <option value="CZ">Catanzaro</option>
                            <option value="CH">Chieti</option>
                            <option value="CO">Como</option>
                            <option value="CS">Cosenza</option>
                            <option value="CR">Cremona</option>
                            <option value="KR">Crotone</option>
                            <option value="CN">Cuneo</option>
                            <option value="EN">Enna</option>
                            <option value="FM">Fermo</option>
                            <option value="FE">Ferrara</option>
                            <option value="FI">Firenze</option>
                            <option value="FG">Foggia</option>
                            <option value="FC">Forl&igrave;-Cesena</option>
                            <option value="FR">Frosinone</option>
                            <option value="GE">Genova</option>
                            <option value="GO">Gorizia</option>
                            <option value="GR">Grosseto</option>
                            <option value="IM">Imperia</option>
                            <option value="IS">Isernia</option>
                            <option value="SP">La spezia</option>
                            <option value="AQ">L'aquila</option>
                            <option value="LT">Latina</option>
                            <option value="LE">Lecce</option>
                            <option value="LC">Lecco</option>
                            <option value="LI">Livorno</option>
                            <option value="LO">Lodi</option>
                            <option value="LU">Lucca</option>
                            <option value="MC">Macerata</option>
                            <option value="MN">Mantova</option>
                            <option value="MS">Massa-Carrara</option>
                            <option value="MT">Matera</option>
                            <option value="VS">Medio Campidano</option>
                            <option value="ME">Messina</option>
                            <option value="MI">Milano</option>
                            <option value="MO">Modena</option>
                            <option value="MB">Monza e della Brianza</option>
                            <option value="NA">Napoli</option>
                            <option value="NO">Novara</option>
                            <option value="NU">Nuoro</option>
                            <option value="OG">Ogliastra</option>
                            <option value="OT">Olbia-Tempio</option>
                            <option value="OR">Oristano</option>
                            <option value="PD">Padova</option>
                            <option value="PA">Palermo</option>
                            <option value="PR">Parma</option>
                            <option value="PV">Pavia</option>
                            <option value="PG">Perugia</option>
                            <option value="PU">Pesaro e Urbino</option>
                            <option value="PE">Pescara</option>
                            <option value="PC">Piacenza</option>
                            <option value="PI">Pisa</option>
                            <option value="PT">Pistoia</option>
                            <option value="PN">Pordenone</option>
                            <option value="PZ">Potenza</option>
                            <option value="PO">Prato</option>
                            <option value="RG">Ragusa</option>
                            <option value="RA">Ravenna</option>
                            <option value="RC">Reggio di Calabria</option>
                            <option value="RE">Reggio nell'Emilia</option>
                            <option value="RI">Rieti</option>
                            <option value="RN">Rimini</option>
                            <option value="RM">Roma</option>
                            <option value="RO">Rovigo</option>
                            <option value="SA">Salerno</option>
                            <option value="SS">Sassari</option>
                            <option value="SV">Savona</option>
                            <option value="SI">Siena</option>
                            <option value="SR">Siracusa</option>
                            <option value="SO">Sondrio</option>
                            <option value="TA">Taranto</option>
                            <option value="TE">Teramo</option>
                            <option value="TR">Terni</option>
                            <option value="TO">Torino</option>
                            <option value="TP">Trapani</option>
                            <option value="TN">Trento</option>
                            <option value="TV">Treviso</option>
                            <option value="TS">Trieste</option>
                            <option value="UD">Udine</option>
                            <option value="VA">Varese</option>
                            <option value="VE">Venezia</option>
                            <option value="VB">Verbano-Cusio-Ossola</option>
                            <option value="VC">Vercelli</option>
                            <option value="VR">Verona</option>
                            <option value="VV">Vibo valentia</option>
                            <option value="VI">Vicenza</option>
                            <option value="VT">Viterbo</option>
                    </Form.Control>
                    </Form.Group> 
    
                </Form.Row>
    
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridDocument">
                        <Form.Label>Numero documento</Form.Label>
                        <Form.Control type="document_num" placeholder="Documento" required/>
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
                <Form.Group>
                
                    <Form.Row className = "justify-content-center">
                        <input
                        id = "foto1"
                        type = "file"
                        name = "foto1SRC"
                        onChange = {this.onChangeFoto}
                        className = "inputImg"
                        accept = "image/*"
                        required
                        />
                        <img src = {this.state.foto1SRC} alt = "Documento" ></img>
                    </Form.Row>
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridDocument">
                        <Form.Label>Documento di esenzione</Form.Label>
                        <Form.Control type="document_num" placeholder="Documento di esenzione"/>
                    </Form.Group>
                    
                </Form.Row>
                <Form.Group>
                <Form.Row className = "justify-content-center">
                    <input
                    type = "file"
                    id = "foto2"
                    name = "foto2SRC"
                    onChange = {this.onChangeFoto}
                    className = "inputImg"
                    accept = "image/*"
                    />
                    <img src = {this.state.foto2SRC} alt = "Esenzione" ></img>
                </Form.Row>
                </Form.Group>
            </div>
            
            <h3 style = {{fontWeight: 'bold'}}>Ammontare tassa di soggiorno: <span>€{this.state.tassa}</span></h3>
            {pagata}
            {esente}
            <br/>
            <br/>

            <Button variant="primary" type="submit" id="checkinButton">
                Invia dati
            </Button>

            </Form>
        );
    }
}
export default Checkin