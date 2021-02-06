import React from "react";
import { SingleDatePicker } from "react-dates";
import {Accordion} from 'react-bootstrap'
import './AlloggioFiltro.css'
import moment from "moment";

class AlloggiFilter extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      case: this.props.case ? this.props.case : [],
      tipo: this.props.tipo ? this.props.tipo : '',
      localita: this.props.localita ? this.props.localita : '',
      posti: this.props.posti ? this.props.posti : 1,
      checkIn: this.props.checkIn ? this.props.checkIn : '',
      checkOut: '',
      checkInFocus: false,
      checkInFocusDROP: false,
      checkOutFocus: false,
      checkOutFocusDROP: false,
      startDate: null,
      endDate: null,
      searchServizi: [],
      costo: 1000,
      minCosto: 0,
      maxCosto: 1000,
      minSize: '',
      maxSize: '',
      error: false,
      errorMessage: ''
    }
  }

  componentDidMount() {

    var str = this.props.checkOut;
    var dmy = str.split("/");

    var d = new Date(dmy[2], dmy[1] - 1, dmy[0]);

    if(d.getFullYear() < 2099) {

      this.setState({ checkOut: d.toLocaleDateString() }, () => {

        this.setState({
          startDate: this.state.checkIn ? moment(this.state.checkIn, "DD-MM-YYYY") : null,
          endDate: this.state.checkOut ? moment(this.state.checkOut, "DD-MM-YYYY") : null
        }, () => {
          
          var ngiorni = this.state.endDate ? this.state.endDate.diff(this.state.startDate, 'days') : 1;
    
          if(ngiorni < 1) {
            ngiorni = 1;
          }
    
          this.setState({
            maxCosto: ngiorni * 150,
            costo: ngiorni*150
          });
        });
      })
    }

    this.setState({
      startDate: this.state.checkIn ? moment(this.state.checkIn, "DD-MM-YYYY") : null,
      endDate: this.state.checkOut ? moment(this.state.checkOut, "DD-MM-YYYY") : null
    }, () => {
      
      var ngiorni = this.state.endDate ? this.state.endDate.diff(this.state.startDate, 'days') : 1;

      if(ngiorni < 1) {
        ngiorni = 1;
      }

      this.setState({
        maxCosto: ngiorni * 150,
        costo: ngiorni*150
      });
    });
  }

  set_focused_checkIn = (e) => {
    this.setState({ checkInFocus: e });
  }

  set_focused_checkInDROP = (e) => {
    this.setState({ checkInFocusDROP: e });
  }

  set_focused_checkOut = (e) => {
      this.setState({ checkOutFocus: e });
  }

  set_focused_checkOutDROP = (e) => {
    this.setState({ checkOutFocusDROP: e });
}

  setStartDate = (e) => {
    this.setState({ startDate: e }, () => {

      var ngiorni = this.state.endDate ? this.state.endDate.diff(this.state.startDate, 'days') : 1;

      if(ngiorni < 1) {
        ngiorni = 1;
      }

      this.setState({
        maxCosto: ngiorni * 150,
        costo: ngiorni*150
      }, () => {
        this.props.onChange(this.state);
      });
      
      if(this.state.startDate.isAfter(this.state.endDate)) {
        this.setState({ endDate: this.state.startDate.add(1, 'days'), startDate: this.state.startDate.subtract(1, 'days') }, () => {
          var ngiorni = this.state.endDate.diff(this.state.startDate, 'days');

          this.setState({
            maxCosto: ngiorni * 150,
            costo: ngiorni*150,
            checkIn: new Date(this.state.startDate.format()).toLocaleDateString()
          }, () => {
            this.props.onChange(this.state);
          })
        })
      }
    });
  }

  setEndDate = (e) => {
      this.setState({ endDate: e }, () => {
        var ngiorni = this.state.endDate.diff(this.state.startDate, 'days');

        if(ngiorni < 1) {
          ngiorni = 1;
        }

        this.setState({
          maxCosto: ngiorni * 150,
          costo: ngiorni*150,
          checkOut: new Date(this.state.endDate.format()).toLocaleDateString()
        }, () => {
          this.props.onChange(this.state);
        })
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value }, () => {
      this.props.onChange(this.state);
    });
  }

  onChangeServizi = (e) => {
    if(e.target.checked) {
      this.setState({
        searchServizi: [...new Set(this.state.searchServizi.concat(e.target.id).sort())]
      }, () => {
        this.props.onChangeServizi(this.state);
      });
    }
    else {
      var filtraServizi = this.state.searchServizi.filter(servizio => servizio !== e.target.id);

      this.setState({
        searchServizi: filtraServizi
      }, () => {
        this.props.onChangeServizi(this.state);
      });
    }
  }

  render() {
    return (
      <div>
        <div className="schermiGrandi">
          <section className="filter-container">
            <form className="filter-form">
            <div class="product-search">
                        <div class="search-element">
                            <label class="search-label">Località</label>
                            <input class="search-input" type="text" autocomplete="on" 
                              placeholder="Località" id = 'localita' name="localita" onChange = {this.handleChange} defaultValue = {this.state.localita}
                            >
                            </input>
                        </div>
                        <div class="search-element">
                        <label class="search-label" htmlFor="start_date">Check-in</label>
                            <SingleDatePicker
                                class="search-element"
                                date={this.state.startDate}
                                onDateChange={date => this.setStartDate(date)}
                                focused={this.state.checkInFocus}
                                onFocusChange={({ focused }) => this.set_focused_checkIn(focused)}
                                id="start_date"
                                numberOfMonths={1}
                                placeholder="gg/mm/aaaa"
                                daySize={32}
                                hideKeyboardShortcutsPanel={true}
                                displayFormat="DD/MM/YYYY"
                                block={true}
                                verticalSpacing={8}
                                showClearDate={this.state.checkInFocus}
                                reopenPickerOnClearDate={true}
                                noBorder={true}
                            />
                        </div>
                        <div class="search-element">
                        <label class="search-label" htmlFor="end_date">Check-out</label>
                            <SingleDatePicker
                                class="search-element"
                                date={this.state.endDate}
                                onDateChange={date => this.setEndDate(date)}
                                focused={this.state.checkOutFocus}
                                onFocusChange={({ focused }) => this.set_focused_checkOut(focused)}
                                id="end_date"
                                numberOfMonths={1}
                                placeholder="gg/mm/aaaa"
                                daySize={32}
                                hideKeyboardShortcutsPanel={true}
                                displayFormat="DD/MM/YYYY"
                                block={true}
                                isDayHighlighted={day =>
                                    day.isAfter(this.state.startDate) && day.isBefore(this.state.endDate)
                                }
                                verticalSpacing={8}
                                anchorDirection="right"
                                isDayBlocked={day => day.isBefore(this.state.startDate)}
                                showClearDate={this.state.checkOutFocus}
                                reopenPickerOnClearDate={true}
                                noBorder={true}
                            />
                        </div>
                        <div class="search-element">
                            <label class="search-label">Tipo struttura</label>
                            <select class="search-input" placeholder="Struttura" id = 'tipo' name = 'tipo' onChange = {this.handleChange} defaultValue = {this.state.tipo}>
                                <option></option>
                                <option value="cv">Casa Vacanza</option>
                                <option value="bb">B&B</option>
                            </select>
                        </div>
                        <div class="search-element-ospiti">
                            <label class="search-label">Ospiti</label>
                            <select class="search-input-ospiti" placeholder="Ospiti" id = 'posti' name = 'posti' onChange = {this.handleChange} defaultValue = {this.state.posti}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                      </div>
              {/* end of casaVacanza price*/}
              {/* end of select type */}
            </form>
            {/* extras */}
            <div className="form-gruppo">
                <label htmlFor="costo">Costo €{this.state.costo}</label>
                  <input
                    type="range"
                    step = "20"
                    name="costo"
                    min={this.state.minCosto}
                    max={this.state.maxCosto}
                    id="costo"
                    onChange={this.handleChange}
                    className="form-control"
                    defaultValue = {this.state.costo}
                  />
            </div>
            <div className="form-gruppo-extra">
              {this.props.servizi.map(item => {
                return(
                  <div className="single-extra">
                    <input
                      type="checkbox"
                      name={item.servizio}
                      id={item.servizio}
                      onChange={this.onChangeServizi}
                    />
                    <label htmlFor={item.servizio}>&nbsp;{item.servizio}</label>
                  </div>
                )
              })}
              </div>
              {/* end of extras type */}
          </section>
          </div>
          <div className="schermiPiccoli">
          <Accordion>
              <Accordion.Toggle eventKey="0" id="bottoneDrop">Filtri</Accordion.Toggle >
                <Accordion.Collapse eventKey="0">
                <section className="filter-container">
                  <form className="filter-form">
                  <div class="product-search">
                              <div class="search-element">
                                  <label class="search-label">Località</label>
                                  <input class="search-input" type="text" autocomplete="on" 
                                    placeholder="Località" id = 'localita' name="localita" onChange = {this.handleChange} defaultValue = {this.state.localita}
                                  >
                                  </input>
                              </div>
                              <div class="search-element">
                              <label class="search-label" htmlFor="start_date">Check-in</label>
                                  <SingleDatePicker
                                      class="search-element"
                                      date={this.state.startDate}
                                      onDateChange={date => this.setStartDate(date)}
                                      focused={this.state.checkInFocusDROP}
                                      onFocusChange={({ focused }) => this.set_focused_checkInDROP(focused)}
                                      id="start_date"
                                      numberOfMonths={1}
                                      placeholder="gg/mm/aaaa"
                                      daySize={32}
                                      hideKeyboardShortcutsPanel={true}
                                      displayFormat="DD/MM/YYYY"
                                      block={true}
                                      verticalSpacing={8}
                                      showClearDate={this.state.checkInFocusDROP}
                                      reopenPickerOnClearDate={true}
                                      noBorder={true}
                                  />
                              </div>
                              <div class="search-element">
                              <label class="search-label" htmlFor="end_date">Check-out</label>
                                  <SingleDatePicker
                                      class="search-element"
                                      date={this.state.endDate}
                                      onDateChange={date => this.setEndDate(date)}
                                      focused={this.state.checkOutFocusDROP}
                                      onFocusChange={({ focused }) => this.set_focused_checkOutDROP(focused)}
                                      id="end_date"
                                      numberOfMonths={1}
                                      placeholder="gg/mm/aaaa"
                                      daySize={32}
                                      hideKeyboardShortcutsPanel={true}
                                      displayFormat="DD/MM/YYYY"
                                      block={true}
                                      isDayHighlighted={day =>
                                          day.isAfter(this.state.startDate) && day.isBefore(this.state.endDate)
                                      }
                                      verticalSpacing={8}
                                      anchorDirection="right"
                                      isDayBlocked={day => day.isBefore(this.state.startDate)}
                                      showClearDate={this.state.checkOutFocusDROP}
                                      reopenPickerOnClearDate={true}
                                      noBorder={true}
                                  />
                              </div>
                              <div class="search-element">
                                  <label class="search-label">Tipo struttura</label>
                                  <select class="search-input" placeholder="Struttura" id = 'tipo' name = 'tipo' onChange = {this.handleChange} defaultValue = {this.state.tipo}>
                                      <option></option>
                                      <option value="cv">Casa Vacanza</option>
                                      <option value="bb">B&B</option>
                                  </select>
                              </div>
                              <div class="search-element-ospiti">
                                  <label class="search-label">Ospiti</label>
                                  <select class="search-input-ospiti" placeholder="Ospiti" id = 'posti' name = 'posti' onChange = {this.handleChange} defaultValue = {this.state.posti}>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                      <option value="6">6</option>
                                      <option value="7">7</option>
                                      <option value="8">8</option>
                                      <option value="9">9</option>
                                      <option value="10">10</option>
                                  </select>
                              </div>
                            </div>
                    {/* end of casaVacanza price*/}
                    {/* end of select type */}
                  </form>
                  {/* extras */}
                  <div className="form-gruppo">
                      <label htmlFor="costo">Costo €{this.state.costo}</label>
                        <input
                          type="range"
                          step = "20"
                          name="costo"
                          min={this.state.minCosto}
                          max={this.state.maxCosto}
                          id="costo"
                          onChange={this.handleChange}
                          className="form-control"
                          defaultValue = {this.state.costo}
                        />
                  </div>
                  <div className="form-gruppo-extra">
                    {this.props.servizi.map(item => {
                      return(
                        <div className="single-extra">
                          <input
                            type="checkbox"
                            name={item.servizio}
                            id={item.servizio}
                            onChange={this.onChangeServizi}
                          />
                          <label htmlFor={item.servizio}>&nbsp;{item.servizio}</label>
                        </div>
                      )
                    })}
                    </div>
                    {/* end of extras type */}
                </section>
                </Accordion.Collapse>
              </Accordion>    
          </div>
      </div>
    );
  }
};

export default AlloggiFilter;
