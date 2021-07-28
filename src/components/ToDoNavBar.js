import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

class ToDoNavBar extends React.Component {

  render () {
    return (
      <Container className="bg-light">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">TODO-List</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav>
                <NavDropdown title={this.props.username} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={this.props.handleLogout}>Выход</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Nav justify variant="tabs" defaultActiveKey="my" bg="light">
          <Nav.Item>
            <Nav.Link eventKey="my" onClick={e => this.props.handleViewChange(e, 'my')}>Мои задачи</Nav.Link>
          </Nav.Item>
          <NavDropdown title="Задачи моей команды" id="basic-nav-dropdown">
              <NavDropdown.Item eventKey="myTeam" onClick={e => this.props.handleViewChange(e, 'myTeam')}>Без группировки</NavDropdown.Item>
              <NavDropdown.Item eventKey="myTeamByResponsible" onClick={e => this.props.handleViewChange(e, 'myTeamByResponsible')}>По ответственным</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Все задачи" id="basic-nav-dropdown">
              <NavDropdown.Item eventKey="all" onClick={e => this.props.handleViewChange(e, 'all')}>Без группировки</NavDropdown.Item>
              <NavDropdown.Item eventKey="allByResponsible" onClick={e => this.props.handleViewChange(e, 'allByResponsible')}>По ответственным</NavDropdown.Item>
          </NavDropdown>
          <Nav.Item>
            <Nav.Link eventKey="create" onClick={e => this.props.handleShowCreate(e)}>Создать задачу</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>

    );
  };
}

export default ToDoNavBar;

ToDoNavBar.propTypes = {
  username: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  handleShowCreate: PropTypes.func.isRequired
};