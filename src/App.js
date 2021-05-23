import React, {Component} from 'react'
import { Navbar, NavbarBrand } from 'reactstrap';
import Menu from './components/MenuComponent'

class App extends Component{
  render(){
    return (
    
      <div className="App">
        <Navbar dark color = "primary">
          <div className="Container">
            <NavbarBrand href = "/">Ristorante Con Fusion</NavbarBrand>
          </div>
        </Navbar>
        <Menu /> 
      </div>
    
      );
  }
}

export default App;
