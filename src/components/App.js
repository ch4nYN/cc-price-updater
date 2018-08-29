import CCC from '../config/ccc-streamer-utilities.js';
import '../css/App.css';
import React, { Component } from 'react';
import io from 'socket.io-client';


var socket = io;
var currentPrice = {};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: '', 
      BTC: 0, 
      ETH: 0, 
      LTC: 0
    };

    this.priceDown = this.priceDown.bind(this);
    this.priceUp = this.priceUp.bind(this);
    this.receiveUpdate = this.receiveUpdate.bind(this);
  }
  dataUnpack(message) {
    var data = CCC.CURRENT.unpack(message);

		var from = data['FROMSYMBOL'];
		var to = data['TOSYMBOL'];
		var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
		var tsym = CCC.STATIC.CURRENCY.getSymbol(to);
		var pair = from + to;

		if (!currentPrice.hasOwnProperty(pair)) {
			currentPrice[pair] = {};
		}

		for (var key in data) {
			currentPrice[pair][key] = data[key];
		}

		if (currentPrice[pair]['LASTTRADEID']) {
			currentPrice[pair]['LASTTRADEID'] = parseInt(currentPrice[pair]['LASTTRADEID']).toFixed(0);
		}
		currentPrice[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']));
    currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";
    
		return currentPrice[pair];
  }
  componentDidMount() {
    socket = io.connect('https://streamer.cryptocompare.com/');
    var subs = ['2~Coinbase~BTC~USD', '2~Coinbase~ETH~USD', '2~Coinbase~LTC~USD'];
    socket.emit('SubAdd', {subs: subs});
    socket.on("m", this.receiveUpdate);
  }

  receiveUpdate(message) {
    var result = this.dataUnpack(message);
    if (result['FROMSYMBOL'] === 'BTC') {
      // BTC price went up
      if (result['PRICE'] > this.state.BTC) {
        this.priceUp('btc-price');
      } else if (result['PRICE'] < this.state.BTC) {
        this.priceDown('btc-price');
      }
      this.setState({BTC: result['PRICE']});
    }
    if (result['FROMSYMBOL'] === 'ETH') {
      // ETH price went up
      if (result['PRICE'] > this.state.ETH) {
        this.priceUp('eth-price');
      } else if (result['PRICE'] < this.state.BTC) {
        this.priceDown('eth-price');
      }
      this.setState({ETH: result['PRICE']});
    }
    if (result['FROMSYMBOL'] === 'LTC') {
      //LTC price went up
      if (result['PRICE'] > this.state.LTC) {
        this.priceUp('ltc-price');
      } else if (result['PRICE'] < this.state.BTC) {
        this.priceDown('ltc-price');
      }
      this.setState({LTC: result['PRICE']});
    }
  }
  
  priceUp(idName) {
    if (idName === 'btc-price') {
      var obj = document.getElementById(idName);
      obj.style.color = 'green';
      setTimeout(() => {
        obj.style.color = 'black';
      }, 2000);
    }
    if (idName === 'eth-price') {
      var obj = document.getElementById(idName);
      obj.style.color = 'green';
      setTimeout(() => {
        obj.style.color = 'black';
      }, 2000);
    }
    if (idName === 'ltc-price') {
      var obj = document.getElementById(idName);
      obj.style.color = 'green';
      setTimeout(() => {
        obj.style.color = 'black';
      }, 2000);
    }
  
  }
  priceDown(idName) {
    //btc
    if (idName === 'btc-price') {
      var obj = document.getElementById(idName);
      obj.style.color = 'red';
      setTimeout(() => {
        obj.style.color = 'black';
      }, 2000);
    }
    if (idName === 'eth-price') {
      var obj = document.getElementById(idName);
      obj.style.color = 'red';
      setTimeout(() => {
        obj.style.color = 'black';
      }, 2000);
    }
    if (idName === 'ltc-price') {
      var obj = document.getElementById(idName);
      obj.style.color = 'red';
      setTimeout(() => {
        obj.style.color = 'black';
      }, 2000);
    }
  
  }
  render() {
    return(
      <div className="container">
        <p className="header"><bold style={{color:'orange'}}>c r y p t o c u r r e n c y</bold>&nbsp;&nbsp;&nbsp;&nbsp;<bold style={{color:'purple'}}>l i v e</bold></p>
        <br/>
        <br/>
        <br/>

        <div className="price-container">
          <div className="BTC">
            <div style={{display:'inline-block'}}>
              <h1 style={{color:'orange'}}>B T C</h1>
            </div>
            <div>
              <p id="btc-price">${this.state.BTC}</p>
            </div>
          </div>
          <div className="ETH">
            <div style={{display:'inline-block'}}>
              <h1 style={{color:'purple'}}>E T H</h1>
            </div>
            <div>
              <p id="eth-price">${this.state.ETH}</p>
            </div>
          </div>
          <div className="LTC">
            <div style={{display:'inline-block'}}>
              <h1 style={{color:'grey'}}>L T C</h1>
            </div>
            <div style={{display:''}}>
              <p id="ltc-price">${this.state.LTC}</p>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default App;