import React from "react";
import { Link } from "react-router-dom";
import './Alloggio.css';

class Alloggio extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

      incomplete: true
    }
  }

  onClick = () => {

    if(new Date(this.props.checkOut).getFullYear() === 2099) {

      this.props.incomplete(true);
    }

    else {

      this.setState({ incomplete: false }, () => {

        this.props.incomplete(false);
      })
    }
  }

  render() {

    var dati_casa = this.props.casaVacanza ? this.props.casaVacanza : '';
    var datiRicerca = this.props.datiRicerca ? this.props.datiRicerca : '';
    var servizi = this.props.servizi ? this.props.servizi : [];
    var checkIn = this.props.checkIn ? this.props.checkIn : '';
    var checkOut = this.props.checkOut ? this.props.checkOut : '';
    var tipo = this.props.tipo ? this.props.tipo : '';

    var link = (
      <p className = "vai">Visualizza dettagli</p>
    );

    if(!this.state.incomplete) {

      link = (
        <Link 
          to = {{
            pathname: "/Alloggio",
            state: {
              dati_casa: dati_casa,
              datiRicerca: datiRicerca,
              servizi: servizi,
              checkIn: checkIn,
              checkOut: checkOut,
              tipo: tipo
            }
          }}
          className = "vai"
        >
          Visualizza dettagli
        </Link>
      );
    }

    return (
      <article className="casaVacanza">
          <div className="containerFoto">
            <img src={dati_casa.img1} alt="single casaVacanza" className="fotoAlloggi"/>
          </div>
          <div className="info">
            <h5 className="casaVacanza-info">{dati_casa.nome_proprieta}</h5>
            <div className="descrizione">
              <p className="casaVacanza-info">Località: {dati_casa.localita}</p>
              <p className="casaVacanza-info">Capienza: {dati_casa.posti} {dati_casa.posti === 1 ? 'ospite' : 'ospiti'}</p>
            </div>
            <div className="price-top">
              <h6>€{dati_casa.costo} ({dati_casa.ngiorni} {dati_casa.ngiorni === 1 ? 'giorno' : 'giorni'})</h6>
            </div>
            <div className="bottoneLink" onClick = {this.onClick}>
              {link}
            </div>
        </div>
      </article>
    );
  }
}

export default Alloggio;
