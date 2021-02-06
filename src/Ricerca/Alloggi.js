import React from "react";

import AlloggiContainer from "../Ricerca/AlloggiContainer";

class Alloggi extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      case: this.props.history.location.state ? this.props.history.location.state.case : [],
      posti: this.props.history.location.state ? this.props.history.location.state.posti : 1,
      checkIn: this.props.history.location.state ? this.props.history.location.state.checkIn : '',
      checkOut: this.props.history.location.state ? this.props.history.location.state.checkOut : '',
      localita: this.props.history.location.state ? this.props.history.location.state.localita : '',
      tipo: this.props.history.location.state ? this.props.history.location.state.tipo : '',
    }
  }

  render() {
    return (
      <>
        <AlloggiContainer 
          case = {this.state.case} 
          posti = {this.state.posti} 
          checkIn = {this.state.checkIn} 
          checkOut = {this.state.checkOut}
          localita = {this.state.localita}
          tipo = {this.state.tipo}
        />
      </>
    );
  }
};

export default Alloggi;
