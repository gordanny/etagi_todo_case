import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  };

  handleInputChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <p>Добро пожаловать в приложение TODO-LIST!</p>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md={{ span: 4 }}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicUsername" md={4}>
                <Form.Control
                  type="username"
                  name="username"
                  placeholder="Введите имя пользователя"
                  value={this.state.username}
                  onChange={this.handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="Пароль"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                 />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button variant="primary" type="submit" onClick={e => this.props.handleLogin(e, this.state)}>
              Войти
            </Button>
          </Col>
        </Row>
      </Container>
    );
  };
}

export default LoginForm;

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
};