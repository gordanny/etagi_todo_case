import React from 'react';
import PropTypes from 'prop-types';
import CreateTaskForm from './CreateTaskForm'

class Tasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasksList: [],
            view: this.props.view,
            username: this.props.username,
            userID: this.props.userID,
            responsibleList: [],
            refresh: false
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
    }

    componentDidMount() {
        console.log('pewpew');
        fetch('API/tasks/get/', {
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            }
            })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                this.setState({tasksList: json});
            });
        fetch('API/users/responsible/', {
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`
            }
            })
            .then(res => res.json())
            .then(json => {
                if (json.length) {
                const lst = json.map(item => {
                    return {id: item.id, username: item.username, view: true}
                });
                this.setState({responsibleList: lst});
                }
            });
    };

    handleShowForm = () => {
        return <CreateTaskForm 
            username={this.state.username}
            userID={this.state.userID}
            handleCreateTask={this.handleCreateTask}
            responsibleList={this.state.responsibleList}
            userList={this.props.userList}
            />;
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
            .then(json => console.log(json))
    };

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
            }
            responsibleList.push(<span key={responsible}>{name} </span>); 
        });
        return (
            <div>{responsibleList}</div>
        );
    }

    handleCreateTasksList = anyTasksList => {
        let taskList = anyTasksList.map(task => 
            <div key={task.id} id={task.id}>
                <div>{task.title}</div>
                <div>{this.priorityDict[task.priority]}</div>
                <div>{task.expiration_date}</div>
                <this.handleResposible list={task.responsible} />
                <div>{this.statusDict[task.status]}</div>
                <br />
            </div>
        );
        return (
            <div>{taskList}</div>
        );
    }

    handleShowMyTasks = () => {
        let today = this.handleFormattedDate();
        let week = new Date();
        week.setDate(week.getDate() + 7);
        let todayTasks = [];
        let weekTasks = [];
        let longTasks = [];
        this.state.tasksList.forEach(task => {
            let expDate = new Date(task.expiration_date);
            if (task.responsible.includes(this.state.userID)) {
                if (task.expiration_date === today) {
                    todayTasks.push(task);
                } else if (expDate <= week ) {
                    weekTasks.push(task);
                } else {
                    longTasks.push(task);
                }
            };
        });

        const todayTasksList = this.handleCreateTasksList(todayTasks);
        const weekTasksList = this.handleCreateTasksList(weekTasks);
        const longTasksList = this.handleCreateTasksList(longTasks);

        return (            
            <div>
                <span>TODAY</span>
                {todayTasksList}<br />
                <span>WEEK</span>
                {weekTasksList}<br />
                <span>OTHER</span>
                {longTasksList}<br />
            </div>
        );
    }

    handleShowMyTeamTasks = () => {
        let taskList = [];
        let myTeamTasksList;
        if (this.state.responsibleList.length) {
            this.state.tasksList.forEach(task => {
                for (let responsible of this.state.responsibleList) {
                    if (task.responsible.includes(responsible.id)) {
                        taskList.push(task);
                        break;
                    };
                };
            });
            if (taskList.length) {
                myTeamTasksList = this.handleCreateTasksList(taskList);
            } else {
                myTeamTasksList = <span>У ваших подчиненных нет текущих задач.</span>
            };
        } else {
            myTeamTasksList = <span>У вас нет подчиненных.</span>;
        };
        
        return (            
            <div>
                {myTeamTasksList}
            </div>
        );
    }

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
                <div key={responsible} id={responsible}>
                    <p>Задачи - {responsible}</p>
                    <div>{respTasks}</div>
                </div>
            );
        };
        return (            
            <div>
                {tasksByResponsible}
            </div>
        );
    }

    handleShowAllTasks = () => {
        let taskList = this.handleCreateTasksList(this.state.tasksList)
        return (            
            <div>
                {taskList}
            </div>
        );
    }

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
            case 'createForm':
                tasksView = this.handleShowForm();
                break;
            default:
                tasksView = null;
        };
        return (
            <div>
                <p>Tasks</p><br />
                <div>{tasksView}</div>
            </div>
        );
    }
}


export default Tasks;

Tasks.propTypes = {
    username: PropTypes.string.isRequired,
    userID: PropTypes.number.isRequired,
    view: PropTypes.string.isRequired,
    userList: PropTypes.object.isRequired
  };