import React from 'react';
import { Accordion} from 'react-bootstrap'
// eslint-disable-next-line
import DatePicker from './InputDate';
//import Dropdown from 'react-bootstrap/Dropdown'
//import DropdownButton from 'react-bootstrap/DropdownButton'
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import './Ricerca.css'

import { Redirect } from "react-router-dom"

class Ricerca extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            checkInFocus: false,
            checkInFocusDROP: false,
            checkOutFocus: false,
            checkOutFocusDROP: false,
            startDate: moment(),
            endDate: null,
            tipo: '',
            localita: '',
            posti: 1,
            checkIn: '',
            checkOut: '',
            apiResponse: [],
            error: false,
            errorMessage: '',
            success: false
        }
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
        this.setState({ startDate: e });
    }

    setEndDate = (e) => {
        this.setState({ endDate: e });
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();

        var inizio = new Date(this.state.startDate.format());
        var fine = this.state.endDate ? new Date(this.state.endDate.format()) : new Date(moment([2099]).format());

        this.setState({
            checkIn: inizio.toLocaleDateString(),
            checkOut: fine.toLocaleDateString()
        }, () => {
            const offsetInizio = inizio.getTimezoneOffset();
            inizio = new Date(inizio.getTime() - (offsetInizio*60*1000));
            inizio = inizio.toISOString().slice(0,10);

            const offsetFine = fine.getTimezoneOffset();
            fine = new Date(fine.getTime() - (offsetFine*60*1000));
            fine = fine.toISOString().slice(0,10);

            const data = {
                tipo: this.state.tipo,
                localita: this.state.localita,
                provincia: '',
                servizi: '',
                posti: this.state.posti ? this.state.posti : '%%',
                costo: '',
                checkIn: inizio,
                checkOut: fine
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
                    this.setState({ success: true })
                }
            });
        })
    }
    
    render() {
        if(this.state.success) {

            return <Redirect 
            to = {{
              pathname: "/RisultatiRicerca",
              state: {
                case: this.state.apiResponse,
                posti: this.state.posti,
                checkIn: this.state.checkIn,
                checkOut: this.state.checkOut,
                localita: this.state.localita,
                tipo: this.state.tipo
              }
            }}
          />
        }
        return(
            <div>
                <div className="noSmartphone">
                <form onSubmit = {this.onSubmit} className="RicercaSchermi">
                    <div class="product-search">
                        <div class="search-element">
                            <label class="search-label">Dove</label>
                            <input class="search-input" type="text" autocomplete="on" 
                                placeholder="Dove vuoi andare?" id = 'localita' name="localita" onChange = {this.onChange}
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
                            <select class="search-input" placeholder="Struttura" id = 'tipo' name = 'tipo' onChange = {this.onChange}>
                                <option></option>
                                <option value="cv">Casa Vacanza</option>
                                <option value="bb">B&B</option>
                            </select>
                        </div>
                        <div class="search-element-ospiti">
                            <label class="search-label">Ospiti</label>
                            <select class="search-input-ospiti" placeholder="Ospiti" id = 'posti' name = 'posti' onChange = {this.onChange}>
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
                        <button type="submit" class="search-button">Ricerca</button>
                    </div>
                </form>
                </div>
                <div className="ricercaDrop">
                <Accordion>
                    <Accordion.Toggle eventKey="0" id="bottoneDrop">Ricerca</Accordion.Toggle >
                    <Accordion.Collapse eventKey="0">
                        <div>
                        <form onSubmit = {this.onSubmit} className="RicercaSchermi">
                    <div class="product-search">
                        <div class="search-element">
                            <label class="search-label">Dove</label>
                            <input class="search-input" type="text" autocomplete="on" 
                                placeholder="Dove vuoi andare?" id = 'localita' name="localita" onChange = {this.onChange}
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
                            <select class="search-input" placeholder="Struttura" id = 'tipo' name = 'tipo' onChange = {this.onChange}>
                                <option></option>
                                <option value="cv">Casa Vacanza</option>
                                <option value="bb">B&B</option>
                            </select>
                        </div>
                        <div class="search-element-ospiti">
                            <label class="search-label">Ospiti</label>
                            <select class="search-input-ospiti" placeholder="Ospiti" id = 'posti' name = 'posti' onChange = {this.onChange}>
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
                        <button type="submit" class="search-button">Ricerca</button>
                    </div>
                </form>               
                        </div>
                    </Accordion.Collapse>
                </Accordion>                   
                </div>
            </div>

        );
    }
}

export default Ricerca;