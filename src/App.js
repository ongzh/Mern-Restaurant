import React, {Component} from 'react'
import { Navbar, NavbarBrand } from 'reactstrap';
import Menu from './components/MenuComponent';
import { DISHES } from './components/shared/dishes';

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES
    };
  }


  render(){
    return (
    
      <div className="App">
        <Navbar dark color = "primary">
          <div className="Container">
            <NavbarBrand href = "/">Ristorante Con Fusion</NavbarBrand>
          </div>
        </Navbar>
        <Menu dishes={this.state.dishes} />
      </div>
    
      );
  }
}

export default App;
