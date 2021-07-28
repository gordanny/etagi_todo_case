import React from 'react';
import PropTypes from 'prop-types';
import Tasks from './Tasks';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';
import ToDoNavBar from './ToDoNavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

class ToDo extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        view: 'my',
        load: false,
        listLoad: false,
        showCreate: false,
        showEdit: false,
        editTask: '',
        responsibleList: [],
      };
      this.userList = {};
      this.userID = '';
      this.usename = '';
      this.userFullName = '';
      this.userChief = '';
  }

  handleFetchResponsible = () => {
    fetch('API/users/responsible/', {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(json => {
      if (json.length) {
        const lst = json.map(item => {
          return {id: item.id, username: this.handleGetFullName(item), view: true}
        });
      this.setState({responsibleList: lst});
      };
      return true;
    })
    .then(state => {
      this.setState({listLoad: state});
    });
  }

  componentDidMount() {
    fetch('API/users/current/', {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(json => {
      this.userID = json.id;
      this.username = json.username;
      this.userFullName = this.handleGetFullName(json);
      this.userChief = json.chief;
    });

    this.handleFetchResponsible();

    fetch('API/users/get_all/', {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(json => {
      if (json.length) {
        json.forEach(element => {
          this.userList[element.id] = {};
          Object.assign(this.userList[element.id], element);
          delete this.userList[element.id].id;
          this.userList[element.id].fullName = this.handleGetFullName(element);
        });
      };
      return true;
    })
    .then(state => {
      this.setState({load: state});
    });
  };

  handleGetFullName = (person) => {
    let firstName = person.first_name ? person.first_name.slice(0,1).toUpperCase() + '.' : '';
    let patronymic = person.patronymic ? person.patronymic.slice(0,1).toUpperCase() + '.' : '';
    let init = firstName ? ' ' + firstName + patronymic : '';
    let fullName = person.last_name + init;
    return fullName = fullName ? fullName : person.username;
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    this.props.onLoggedInChange(false);
  };

  handleViewChange = (e, view) => {
    e.preventDefault();
    this.setState({view: view});
  };

  handleShowCreate = e => {
    e.preventDefault();
    this.setState({showCreate: true});
  };

  handleCloseCreate = e => {
    e.preventDefault();
    this.setState({showCreate: false});
  };

  handleShowEdit = (e, taskID) => {
    e.preventDefault();
    fetch('API/tasks/get/' + taskID, {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(json => {
      this.setState({editTask: json});
      return true;
    })
    .then(state => {      
      this.setState({showEdit: true});
    });
  };

  handleCloseEdit = e => {
    e.preventDefault();
    this.setState({showEdit: false});
  };

  handleCreateTask = (e, data) => {
    e.preventDefault();
    fetch('API/tasks/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      this.handleFetchResponsible();
      return false;
    })
    .then(() => {
      this.setState({showCreate: false});
    });
  };

  handleEditTask = (e, data) => {
    delete data.responsibleList;
    delete data.responsibleSelect;
    delete data.show;
    delete data.task;
    console.log(data);
    e.preventDefault();
    fetch('API/tasks/edit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      this.handleFetchResponsible();
      return false;
    })
    .then(state => {
      this.setState({showEdit: state});
    });
  };

  render() {
    let navbar;
    let tasks;
    let createForm;
    let editForm;
    if (this.state.listLoad && this.state.showCreate) {
      createForm = <CreateTaskModal
        show={this.state.showCreate}
        handleCloseCreate={this.handleCloseCreate}
        handleCreateTask = {this.handleCreateTask}
        username = {this.userFullName}
        userID = {this.userID}
        responsibleList = {this.state.responsibleList}
        userList = {this.userList}
      />;
    } else {
      createForm = null;
    }
    if (this.state.listLoad && this.state.editTask && this.state.showEdit) {
      editForm = <EditTaskModal
        show={this.state.showEdit}
        handleCloseEdit={this.handleCloseEdit}
        handleEditTask={this.handleEditTask}
        username = {this.userFullName}
        userID = {this.userID}
        chief = {this.userChief}
        responsibleList = {this.state.responsibleList}
        userList = {this.userList}
        task = {this.state.editTask}
      />;
    } else {
      editForm = null;
    }
    if (this.state.load) {
      navbar = <ToDoNavBar
        username={this.userFullName}
        handleLogout={this.handleLogout}
        handleViewChange={this.handleViewChange}
        handleShowCreate={this.handleShowCreate}
      />;
      tasks = <Tasks
        username={this.userFullName}
        userID={this.userID}
        view={this.state.view}
        userList={this.userList}
        handleGetFullName={this.handleGetFullName}
        handleViewChange={this.handleViewChange}
        handleShowEdit={this.handleShowEdit}
        responsibleList={this.state.responsibleList}
      />;
    };
    return (
      <Container  className="bg-light">
        <Row>
          {navbar}
        </Row>
        <Row>
          {tasks}
        </Row>
        {createForm}
        {editForm}
      </Container>
    );
  };
}

export default ToDo;

ToDo.propTypes = {
  onLoggedInChange: PropTypes.func.isRequired
};