import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToDo from './components/ToDo';
import Authentication from './components/Authentication'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: localStorage.getItem('token') ? true : false,
    };
  }

  handleLoggedInChange = isLoggedIn =>  {
    this.setState({isLoggedIn: isLoggedIn});
  }

  render() {
    let view;
    if (this.state.isLoggedIn) {
      view = <ToDo onLoggedInChange={this.handleLoggedInChange} />;
    } else {
      view = <Authentication onLoggedInChange={this.handleLoggedInChange} />;
    }
    return (
      view
    );
  }
}

export default App;
