import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksList: [],
      view: this.props.view,
      username: this.props.username,
      userID: this.props.userID,
      responsibleList: this.props.responsibleList
    };
    this.statusDict = {
      'TW': 'К выполнению',
      'IP': 'Выполняется',
      'FD': 'Выполнена',
      'CL': 'Отменена'
    };
    this.priorityDict = {
      'LW': 'Низкий',
      'MD': 'Средний',
      'HI': 'Высокий'
    };
  };

  handleFetchTasks = () => {
    fetch('API/tasks/get/', {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(json => {
      this.setState({tasksList: json});
    });
  }

  componentDidMount() {
    fetch('API/tasks/get/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.json())
      .then(json => {
        this.setState({tasksList: json});
      });
    this.timerID = setInterval(
        () => this.handleFetchTasks(),
        60000
      );
  };

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleFormattedDate = () => {
    const date = new Date();
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, 0);
    const formattedDate = [year,month,day].join('-');
    return formattedDate;
  };

  handleResposible = (props) => {
    let responsibleList = [];
    let name;
    props.list.forEach(responsible => {
      if (this.props.userList[responsible]) {
        name = this.props.userList[responsible].fullName;
      } else {
        name = responsible;
      };
      responsibleList.push(<Col md="auto" key={responsible}>{name}</Col>);
    });
    return responsibleList;
  }

  handleCreateTasksList = anyTasksList => {
    let taskList = [];
    let today = new Date(this.handleFormattedDate());
    let color;
    anyTasksList.forEach(task => {
      let expDate = new Date(task.expiration_date);
      if (task.status === "FD") {
        color = "finished";
      } else if (expDate < today && (task.status === "TW" || task.status === "IP")) {
        color = "expired";
      } else {
          color = "normal";
      };
      taskList.push(
        <Card key={task.id} id={task.id} onClick={e => this.props.handleShowEdit(e, task.id)}>
          <Card.Header as="h6" className={color}>{task.title}</Card.Header>
          <Card.Body>
            <Row>
              <Col>
                Приоритет: {this.priorityDict[task.priority]}
              </Col>
              <Col>
                Дата окончания: {new Date(task.expiration_date).toLocaleDateString()}
              </Col>
              <Col>
                Статус: {this.statusDict[task.status]}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row>Ответственные: <this.handleResposible list={task.responsible} /></Row>
          </Card.Footer>
        </Card>
      );
    });
    return taskList;
  };

  handleShowMyTasks = () => {
    let todayFormatted = this.handleFormattedDate();
    let today = new Date();
    let week = new Date();
    week.setDate(week.getDate() + 7);
    let expiredTasks = [];
    let todayTasks = [];
    let weekTasks = [];
    let longTasks = [];
    this.state.tasksList.forEach(task => {
      let expDate = new Date(task.expiration_date);
        if (task.responsible.includes(this.state.userID)) {
          if (expDate < today) {
            expiredTasks.push(task);
          } else if (task.expiration_date === todayFormatted) {
            todayTasks.push(task);
          } else if (expDate <= week ) {
            weekTasks.push(task);
          } else {
            longTasks.push(task);
          };
        };
      });

    const expiredTasksList = this.handleCreateTasksList(expiredTasks);
    const todayTasksList = this.handleCreateTasksList(todayTasks);
    const weekTasksList = this.handleCreateTasksList(weekTasks);
    const longTasksList = this.handleCreateTasksList(longTasks);

    return (
      <>
        <Card>
          <Card.Header as="h4">
            <Row className="justify-content-md-center">Просроченные</Row>
          </Card.Header>
          <Card.Body>
            {expiredTasksList}
          </Card.Body>
        </Card>
        <Card>
          <Card.Header as="h4">
            <Row className="justify-content-md-center">На сегодня</Row>
          </Card.Header>
          <Card.Body>
            {todayTasksList}
          </Card.Body>
        </Card>
        <Card>
          <Card.Header as="h4">
            <Row className="justify-content-md-center">На неделю</Row>
          </Card.Header>
          <Card.Body>
            {weekTasksList}
          </Card.Body>
        </Card>
        <Card>
          <Card.Header as="h4">
            <Row className="justify-content-md-center">На будущее</Row>
          </Card.Header>
          <Card.Body>
            {longTasksList}
          </Card.Body>
        </Card>
      </>
    );
  };

  handleShowMyTeamTasks = () => {
    let tasksList = [];
    let myTeamTasksList;
    if (this.state.responsibleList.length) {
      this.state.tasksList.forEach(task => {
        for (let responsible of this.state.responsibleList) {
          if (task.responsible.includes(responsible.id)) {
            tasksList.push(task);
            break;
          };
        };
      });
      if (tasksList.length) {
        myTeamTasksList = this.handleCreateTasksList(tasksList);
      } else {
        myTeamTasksList = <p>У ваших подчиненных нет текущих задач.</p>
      };
    } else {
      myTeamTasksList = <p>У вас нет подчиненных.</p>;
    };

    return (
      <Card>
        <Card.Body>{myTeamTasksList}</Card.Body>
      </Card>
    );
  };

  handleShowMyTeamTasksByResponsible = () => {
    let tasksDict = {};
    if (this.state.responsibleList.length) {
      this.state.tasksList.forEach(task => {
        for (let responsible of this.state.responsibleList) {
          if (task.responsible.includes(responsible.id)) {
            if (!(responsible.id in tasksDict)) {
              tasksDict[responsible.id] = [];
            }
            tasksDict[responsible.id].push(task);
          };
        };
      });
    };
    let tasksByResponsible = [];
    for (let responsible in tasksDict) {
      let respTasks = this.handleCreateTasksList(tasksDict[responsible])
      tasksByResponsible.push(
        <Card key={responsible} id={responsible}>
          <Card.Header as="h4">
            <Row className="justify-content-md-center">{this.props.userList[responsible].fullName}</Row>
          </Card.Header>
          <Card.Body>
            {respTasks}
          </Card.Body>
        </Card>
      );
    };
    return tasksByResponsible
  };

  handleShowTasksByResponsible = () => {
    let tasksDict = {};
    this.state.tasksList.forEach(task => {
      task.responsible.forEach(responsible => {
        if (!(responsible in tasksDict)) {
          tasksDict[responsible] = [];
        };
        tasksDict[responsible].push(task);
      });
    });
    let tasksByResponsible = [];
    for (let responsible in tasksDict) {
      let respTasks = this.handleCreateTasksList(tasksDict[responsible])
      tasksByResponsible.push(
        <Card key={responsible} id={responsible}>
          <Card.Header as="h4">
            <Row className="justify-content-md-center">{this.props.userList[responsible].fullName}</Row>
          </Card.Header>
          <Card.Body>
            {respTasks}
          </Card.Body>
        </Card>
      );
    };
    return tasksByResponsible
  };

  handleShowAllTasks = () => {
    let allTasksList = this.handleCreateTasksList(this.state.tasksList)
    return (
        <Card>
          <Card.Body>{allTasksList}</Card.Body>
        </Card>
    );
  };

  render() {
    let tasksView;
    switch (this.props.view) {
      case 'my':
        tasksView = this.handleShowMyTasks();
        break;
      case 'myTeam':
        tasksView = this.handleShowMyTeamTasks();
        break;
      case 'all':
        tasksView = this.handleShowAllTasks();
        break;
      case 'allByResponsible':
        tasksView = this.handleShowTasksByResponsible();
        break;
      case 'myTeamByResponsible':
        tasksView = this.handleShowMyTeamTasksByResponsible();
        break;
      case 'create':
        tasksView = this.handleShowForm();
        break;
      default:
        tasksView = null;
    };
    return (
      <Container className="bg-light">
        {tasksView}
      </Container>
    );
  };
};


export default Tasks;

Tasks.propTypes = {
  username: PropTypes.string.isRequired,
  userID: PropTypes.number.isRequired,
  view: PropTypes.string.isRequired,
  userList: PropTypes.object.isRequired,
  handleGetFullName: PropTypes.func.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  handleShowEdit: PropTypes.func.isRequired,
  responsibleList: PropTypes.array.isRequired
};