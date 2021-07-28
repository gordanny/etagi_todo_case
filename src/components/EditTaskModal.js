import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class EditTaskModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        id: this.props.task.id,
        title: this.props.task.title,
        description: this.props.task.description,
        expirationDate: this.props.task.expiration_date,
        creationDate: this.props.task.creation_date,
        updateDate: this.props.task.update_date,
        priority: this.props.task.priority,
        status: this.props.task.status,
        creator: this.props.task.creator,
        responsible: this.props.task.responsible,
        show: false,
        responsibleList: [
          {id: 0, username: 'Выбрать', view: true},
          {id: this.props.userID, username: this.props.username, view: true}
        ].concat(this.props.responsibleList),
        responsibleSelect: 0,
        task: ''
    };
  }

  handleInputChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = {...prevstate};
      newState[name] = value;
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
    let form;
    const responsibleSelectField = this.handleResponsibleSelect();
    if (this.state.creator === this.props.chief) {
    form = (
      <form>
        <label htmlFor="title">Заголовок</label>
        <input
          type="text"
          name="title"
          value={this.state.title}
          readOnly
        />
        <label htmlFor="description">Описание</label>
        <input
          type="text"
          name="description"
          value={this.state.description}
          readOnly
        />
        <label htmlFor="expirationDate">Дата окончания</label>
        <input
          type="text"
          name="expirationDate"
          value={this.state.expirationDate}
          readOnly
        />
        <label htmlFor="creationDate">Дата создания</label>
        <input
          type="text"
          name="creationDate"
          value={this.state.creationDate}
          readOnly
        />
        <label htmlFor="updateDate">Дата обновления</label>
        <input
          type="text"
          name="updateDate"
          value={this.state.updateDate}
          readOnly
        />
        <label htmlFor="priority">Приоритет</label><br />
        <input
          type="text"
          name="priority"
          value={this.state.priority}
          readOnly
        />
        <label htmlFor="status">Статус</label><br />
        <select
        name="status"
        value={this.state.status}
        onChange={this.handleInputChange}
        >
        <option value="TW">К выполнению</option>
        <option value="IP">Выполняется</option>
        <option value="FD">Выполнена</option>
        <option value="CL">Отменена</option>
        </select><br />
        <label htmlFor="creator">Создатель</label>
        <input
          type="text"
          name="creator"
          value={this.state.creator}
          readOnly
        />
        <label htmlFor="responsible">Ответственные</label><br />
        {responsibleSelectField}
      </form>
    )} else {
      form = (  
        <form>
          <label htmlFor="title">Заголовок</label>
          <input
            type="text"
            name="title"
            value={this.state.title}
            onChange={this.handleInputChange}
          />
          <label htmlFor="description">Описание</label>
          <input
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.handleInputChange}
          />
          <label htmlFor="expirationDate">Дата окончания</label>
            <input
            type="text"
            name="expirationDate"
            value={this.state.expirationDate}
            onChange={this.handleInputChange}
          />
          <label htmlFor="creationDate">Дата создания</label>
          <input
            type="text"
            name="creationDate"
            value={this.state.creationDate}
            readOnly
          />
          <label htmlFor="updateDate">Дата обновления</label>
          <input
            type="text"
            name="updateDate"
            value={this.state.updateDate}
            readOnly
            />
          <label htmlFor="priority">Приоритет</label><br />
          <select
            name="priority"
            value={this.state.priority}
            onChange={this.handleInputChange}
          >
            <option value="LW">Низкий</option>
            <option value="MD">Средний</option>
            <option value="HI">Высокий</option>
          </select><br />
          <label htmlFor="status">Статус</label><br />
          <select
            name="status"
            value={this.state.status}
            onChange={this.handleInputChange}
            >
            <option value="TW">К выполнению</option>
            <option value="IP">Выполняется</option>
            <option value="FD">Выполнена</option>
            <option value="CL">Отменена</option>
          </select><br />
          <label htmlFor="creator">Создатель</label>
          <input
            type="text"
            name="creator"
            value={this.state.creator}
            readOnly
          />
          <label htmlFor="responsible">Ответственные</label><br />
            {responsibleSelectField}
        </form>
      );
    };
    return (
      <>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title>Редактирование задачи</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {form}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleCloseEdit}>
              Закрыть
            </Button>
            <Button variant="primary" onClick={e => this.props.handleEditTask(e, this.state)}>
              Сохранить
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
}

export default EditTaskModal;

EditTaskModal.propTypes = {
  username: PropTypes.string.isRequired,
  userID: PropTypes.number.isRequired,
  responsibleList: PropTypes.array.isRequired,
  userList: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  handleCloseEdit: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  handleEditTask: PropTypes.func.isRequired,
  chief: PropTypes.number
};