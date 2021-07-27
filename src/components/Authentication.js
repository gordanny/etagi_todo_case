import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm'

class Authentication extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginError: null,
        };
    }

    verifyAuthenticationJSON = json => {
        if (json.token) {
            localStorage.setItem('token', json.token);
            this.props.onLoggedInChange(true);
        } else {
            this.setState({loginError: json.non_field_errors});
        };
    }

    handleLogin = (e, data) => {
        e.preventDefault();
        if (data.username && data.password) {
            fetch('/token-auth/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              })
                .then(res => res.json())
                .then(json => this.verifyAuthenticationJSON(json));
        } else {            
            const error = data.username ? 'empty_password' : 'empty_username';
            this.setState({loginError: error})
        }  
      };

    render() {
        const errorDict = {
            'invalid_username': 'Пользователя с таким логином не существует',
            'invalid_password': 'Неверный пароль',
            'empty_username': 'Имя пользователя не может быть пустым',
            'empty_password': 'Пароль не может быть пустым'
        };
        return (
            <div>
                <span>{errorDict[this.state.loginError]}</span>
                <LoginForm handleLogin={this.handleLogin} />
            </div>
        );
    }
}

export default Authentication;

Authentication.propTypes = {
    onLoggedInChange: PropTypes.func.isRequired
  };