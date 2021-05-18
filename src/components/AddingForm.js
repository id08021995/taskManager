import React, {Component} from 'react';
import TaskService from '../services/TaskService';
import '../css/addingForm.min.css';

export default class AddingForm extends Component {
	constructor(props) {
		super(props);
			this.state = {
				title: '',
				userId: null,
				projectId: '',
				status: '',
				usersOnProject: [],
				selectValue: '',
			}
	}
	static getDerivedStateFromProps(props, state) {
		if ((props.usersOnProject !== state.usersOnProject) 
		&& (props.projectId !== state.projectId)){
			return {usersOnProject: props.usersOnProject, projectId: props.projectId}
		}
		return null
	}

	onChangeHandler = (e) => {
		this.setState({title: e.target.value});
	}

	onSelectHandler = (e) => {
		this.setState({userId: e.target.value});
	}

	addTask = async () => {
		const data = {
			title: this.state.title,
			projectId: this.state.projectId,
			userId: this.state.userId,
			status: 1
		};
		const taskService = new TaskService();
		const success = document.querySelector(".addingForm__success");
		const res = await taskService.postNewTask(data);
		if (res) {
			success.style.display = 'block';
		}
		this.setState({title: '', userId: null});
		setTimeout(() => {
			success.style.display = 'none';
			this.closeModal();
		}, 1000);
	}
	
	closeModal = () => {
		this.props.closeModal();
	}

	render() {
		const {usersOnProject} = this.state;
		let developers = usersOnProject.filter(user => user.roleId === 3);
		developers = developers.map(user => {
			return {
				name: user.firstName + ' ' + user.lastName,
				id: user.id
			}
		});
		const textFromInput = this.state.title;
		return (
			<div className={this.props.modalClassName}>
				<form className="addingForm__modal">
					<div className="addingForm__title">New Task</div>
					<div className="addingForm__textarea">
						<label htmlFor="textarea">Enter your task here</label>
						<textarea id="textarea" maxLength="200" onChange={(e)=> this.onChangeHandler(e)} type="text"></textarea>
						{textFromInput.length >= 200 ? <div className="addingForm__textAreaError">Max length is 200 characters</div> : null}
					</div>
					<div className="addingForm__select">
						<label htmlFor="select">Choose a developer</label>
						<select id="select" className="select"
							required
							onChange={(e)=> this.onSelectHandler(e)}>
								<option value={null}></option>
							{developers.map(developer => {
								return (
									<option key={developer.id} value={developer.id}>{developer.name}</option>
								)
							})}
						</select>
						<div className="addingForm__success">New Task has been added</div>
						<div className="addingForm__error">Something wrong</div>
					</div>
					<div className="addingForm__btns">
					<button onClick={()=> this.addTask()}
							type="button" 
							className="addingForm__btn">Add task</button>
						<button onClick={()=> this.closeModal()}
							type="button" 
							className="addingForm__btn">Cancel</button>
					</div>
				</form>
			</div>
		)
	}
}