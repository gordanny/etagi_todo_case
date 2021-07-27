import React from 'react';
import PropTypes from 'prop-types';
import Tasks from './Tasks';

class ToDo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            userID: '',
            view: 'all',
            createTask: false
        };
        this.userList = {};
    }

    componentDidMount() {
        fetch('API/users/current/', {
        headers: {
            Authorization: `JWT ${localStorage.getItem('token')}`
        }
        })
        .then(res => res.json())
        .then(json => {
            this.setState({ username: json.username });
            this.setState({ userID: json.id });
        });
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
                        let firstName = element.first_name ? element.first_name.slice(0,1).toUpperCase() + '.' : '';
                        let patronymic = element.patronymic ? element.patronymic.slice(0,1).toUpperCase() + '.' : '';
                        let init = firstName ? ' ' + firstName + patronymic : '';
                        let fullName = element.last_name + init;
                        this.userList[element.id].fullName = fullName ? fullName : element.username;
                    });
                }
            });
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        this.props.onLoggedInChange(false);
      };

    handleUserCheck = () => {
        return this.state.username && this.state.userID;
    }

    handleViewChange = (e) => {
        e.preventDefault();
        this.setState({view: e.target.value});
    }

    render() {
        let showFormButton;
        let tasks;
        if (this.handleUserCheck()) {
            showFormButton = <button value='createForm' onClick={e => this.handleViewChange(e)}>Создать</button>;
            tasks = <Tasks
                username={this.state.username}
                userID={this.state.userID}
                view={this.state.view}
                userList={this.userList}                    
            /> 
        } else {
            showFormButton = false;
            tasks = false;
        };
        return (
            <div>
                <div>
                    <span>{this.state.username}</span>               
                    <button onClick={this.handleLogout}>logout</button>
                    <div>
                        <button value='my' onClick={e => this.handleViewChange(e)}>Мои задачи</button>
                        <button value='myTeam' onClick={e => this.handleViewChange(e)}>Задачи моей команды</button>
                        <button value='all' onClick={e => this.handleViewChange(e)}>Все задачи</button>
                        <button value='allByResponsible' onClick={e => this.handleViewChange(e)}>Задачи по отвественным</button>
                        {showFormButton}
                    </div>
                </div>
                <br />
                {tasks}                           
            </div>
        );
    }
}

export default ToDo;

ToDo.propTypes = {
    onLoggedInChange: PropTypes.func.isRequired
  };