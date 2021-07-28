import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class CreateTaskModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        form: {
        title: '',
        description: '',
        expiration_date: this.handleFormattedDate(),
        priority: 'LW',
        status: 'TW',
        creator: this.props.userID,
        responsible: [],
        show: false
        },
        responsibleList: [
          {id: 0, username: 'Выбрать', view: true},
          {id: this.props.userID, username: this.props.username, view: true}
        ].concat(this.props.responsibleList),
        responsibleSelect: 0
    };
  }

  handleFormattedDate = () => {
    const date = new Date();
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, 0);
    const formattedDate = [year,month,day].join('-');
    return formattedDate;
  };

  handleInputChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    const form = "form";
    this.setState(prevstate => {
      const newState = {...prevstate};
      if (name === "responsibleSelect") {
        newState[name] = value;
      } else {
        newState[form][name] = value;
      };
      return newState;
    });
  };

  handleResponsibleAdd = e => {
    e.preventDefault();
    const value = e.target.value;
    const newList = this.state.responsibleList.slice();
    for (let item of newList) {
      if (item.id && item.id === +value) {
        item.view = false;
        this.state.form.responsible.push(value);
        break;
      };
    this.setState({responsibleList: newList});
    };
  };

  handleResponsibleSelect = () => {
    let listItems = this.state.responsibleList.map(item => {
      if (item.view) {
        let name;
        if(this.props.userList[item.id]){
          name = this.props.userList[item.id].fullName;
        } else {
          name = item.username;
        };
        return <option key={item.id} value={item.id}>{name}</option>;
      } else {
        return null;
      };
    });
    return (
      <div>
        <select
          name="responsibleSelect"
          value={this.state.responsibleSelect}
          onChange={this.handleInputChange}
        >
          {listItems}
        </select>
        <button value={this.state.responsibleSelect} onClick={this.handleResponsibleAdd}>Добавить</button><br />
      </div>
    );
  }

  render() {
    const responsibleSelectField = this.handleResponsibleSelect();
    return (
      <>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title>Новая задача</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <label htmlFor="title">Заголовок</label>
              <input
                type="text"
                name="title"
                value={this.state.form.title}
                onChange={this.handleInputChange}
              />
              <label htmlFor="description">Описание</label>
              <input
                type="text"
                name="description"
                value={this.state.form.description}
                onChange={this.handleInputChange}
              />
              <label htmlFor="expiration_date">Дата окончания</label>
              <input
                type="text"
                name="expiration_date"
                value={this.state.form.expiration_date}
                onChange={this.handleInputChange}
              />
              <label htmlFor="priority">Приоритет</label><br />
              <select
                name="priority"
                value={this.state.form.priority}
                onChange={this.handleInputChange}
              >
                <option value="LW">Низкий</option>
                <option value="MD">Средний</option>
                <option value="HI">Высокий</option>
              </select><br />
              <label htmlFor="responsible">Ответственные</label><br />
              {responsibleSelectField}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleCloseCreate}>
              Close
            </Button>
            <Button variant="primary" onClick={e => this.props.handleCreateTask(e, this.state.form)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
}

export default CreateTaskModal;

CreateTaskModal.propTypes = {
  handleCreateTask: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  userID: PropTypes.number.isRequired,
  responsibleList: PropTypes.array.isRequired,
  userList: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  handleCloseCreate: PropTypes.func.isRequired
};