import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

class Authentication extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        loginError: null,
    };
  };

  verifyAuthenticationJSON = json => {
    if (json.token) {
      localStorage.setItem('token', json.token);
      this.props.onLoggedInChange(true);
    } else {
      this.setState({loginError: json.non_field_errors});
    };
  };

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
    };
  };

  render() {
    const errorDict = {
      'invalid_username': 'Пользователя с таким логином не существует',
      'invalid_password': 'Неверный пароль',
      'empty_username': 'Имя пользователя не может быть пустым',
      'empty_password': 'Пароль не может быть пустым'
    };
    let error;
    if (this.state.loginError) {
      error = (
        <Alert variant='danger'>
          {errorDict[this.state.loginError]}
        </Alert>
      );
    } else {
      error = null;
    };
    return (
      <Container>
        <br />
        <br />
        <LoginForm handleLogin={this.handleLogin} />
        <br />
        <Row className="justify-content-md-center">
          <Col md="auto">
            {error}
          </Col>
        </Row>
      </Container>
    );
  };
};

export default Authentication;

Authentication.propTypes = {
  onLoggedInChange: PropTypes.func.isRequired
};