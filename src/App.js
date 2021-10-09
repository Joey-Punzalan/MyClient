import React from 'react';
import CSVReader from 'react-csv-reader'
import './App.css';

class Exercise extends React.Component {

    constructor(props) {
        super(props);

        this._isMounted = false;

        this.state = {
            btnAccount: 'Display Accounts',
            btnMeterData: 'Display Meter Data',
            accounts: [],
            meterData: [],
            valid: [],
            invalid: [],
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
            if (this.state.btnAccount === 'Hide Accounts') {
                this.getAccounts();
            }
            if (this.state.btnMeterData === 'Hide Meter Data') {
                this.getMeterData();
            }
        }
    }

    getAccounts() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', 'https://localhost:44379/get-accounts/', true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        xhr.onload = () => {
            const response = JSON.parse(xhr.responseText);
            this.setState({ accounts: response });
        }

        xhr.send();
    }

    getMeterData() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', 'https://localhost:44379/get-meter-data/', true);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        xhr.onload = () => {
            const response = JSON.parse(xhr.responseText);
            this.setState({ meterData: response });
        }

        xhr.send();
    }

    displayAccounts = () => {
        var newName = this.state.btnAccount === 'Display Accounts' ? 'Hide Accounts' : 'Display Accounts';
        this.setState({ btnAccount: newName });
    }

    displayMeterData = () => {
        var newName = this.state.btnMeterData === 'Display Meter Data' ? 'Hide Meter Data' : 'Display Meter Data';
        this.setState({ btnMeterData: newName });
    }

    onFileLoaded = (csv, fileInfo, originalFile) => {
        const xhr = new XMLHttpRequest();

        var json = this.csvJSON(csv);

        var data = { "csv": JSON.stringify(json) };

        const params = JSON.stringify(data);

        xhr.open('post', 'https://localhost:44379/meter-reading-uploads', true);

        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        xhr.onload = () => {
            const response = JSON.parse(xhr.responseText);

            this.setState({
                valid: response.Valid,
                invalid: response.Invalid
            });
        }

        xhr.send(params);
    }

    csvJSON(csv) {
        var result = [];
        var headers = csv[0];

        for (var i = 1; i < csv.length; i++) {

            var obj = {};
            var currentline = csv[i];

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);

        }
        return result;
    }

    render() {
        var { btnAccount, btnMeterData, accounts, meterData, valid, invalid } = this.state;
        var data = [];

        console.log('valid', valid);
        console.log('invalid', invalid);

        return (
            <div className="App">
                <div className="App-body">
                    <div>
                        <div>
                            <span className="App-title">Exercise API Client</span>
                        </div>
                        <div>
                            <button className="App-button" type='button' value='{btnAccount}' onClick={this.displayAccounts}>{btnAccount}</button>
                            <button className="App-button" type='button' value='{btnMeterData}' onClick={this.displayMeterData}>{btnMeterData}</button>
                            <CSVReader onFileLoaded={this.onFileLoaded}
                                cssClass="App-csv-reader"
                                inputStyle={{ color: 'blue', fontSize: '12px'  }}
                            />
                        </div>
                    </div>
                    <div className='App-main-container'>
                        <div className='App-accounts-container'>
                            {
                                btnAccount === 'Hide Accounts' ?
                                    <div>
                                        <table className='App-table'>
                                            <tr>
                                                <th>Account Id</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                            </tr>
                                            {
                                                accounts.map((e) => {
                                                    return (
                                                        <tr>
                                                            <td>{e.AccountId}</td>
                                                            <td>{e.FirstName}</td>
                                                            <td>{e.LastName}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </table>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        <div className='App-accounts-container'>
                            {
                                btnMeterData === 'Hide Meter Data' ?
                                    <div>
                                        <table className='App-table'>
                                            <tr>
                                                <th>Account Id</th>
                                                <th>Date Time</th>
                                                <th>Read Value</th>
                                            </tr>
                                            {
                                                meterData.map((e) => {
                                                    return (
                                                        <tr>
                                                            <td>{e.AccountId}</td>
                                                            <td>{e.MeterReadingDateTime}</td>
                                                            <td>{e.MeterReadValue}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </table>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        <div className='App-accounts-container'>
                            {
                                valid.length > 0 ?
                                    <div>
                                        <div>
                                            <span className='App-title'>Successful Readings</span>
                                        </div>
                                        <div>
                                            <table className='App-table'>
                                                <tr>
                                                    <th>Account Id</th>
                                                    <th>Date Time</th>
                                                    <th>Read Value</th>
                                                </tr>
                                                {
                                                    valid.map((e) => {
                                                        return (
                                                            <tr>
                                                                <td>{e.AccountId}</td>
                                                                <td>{e.MeterReadingDateTime}</td>
                                                                <td>{e.MeterReadValue}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>
                                        </div>
                                    </div>
                                : null
                            }
                        </div>
                        <div className='App-accounts-container'>
                            {
                                invalid.length > 0 ?
                                    <div>
                                        <div>
                                            <span className='App-title'>Unsuccessful Readings</span>
                                        </div>
                                        <div>
                                            <table className='App-table'>
                                                <tr>
                                                    <th>Account Id</th>
                                                    <th>Date Time</th>
                                                    <th>Read Value</th>
                                                </tr>
                                                {
                                                    invalid.map((e) => {
                                                        return (
                                                            <tr>
                                                                <td>{e.AccountId}</td>
                                                                <td>{e.MeterReadingDateTime}</td>
                                                                <td>{e.MeterReadValue}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </table>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>

                    </div>

                </div>
            </div>
        );
    }
}

export default Exercise;
