import React, {Component} from 'react';
import TaskService from '../services/TaskService';
import '../css/taskModalEdit.min.css';

export default class TaskModalEdit extends Component {
	constructor(props) {
		super(props);
			this.state = {
				task: '',
				title: '',
				projectId: '',
				userId: null,
				status: 1,
				taskDeveloper: {},
				usersOnProject: [],
				confirm: false
			}
	}
	static getDerivedStateFromProps(props, state) {
		if (props.task !== state.task) {
			return {
				task: props.task,
				title: props.task.title,
				projectId: props.task.projectId,
				userId: props.task.userId,
				status: props.task.status,
				usersOnProject: props.usersOnProject}
		} 
		return null
	}

	onChangeHandler = (e) => {
		this.setState({title: e.target.value});
	}

	onSelectHandler = (e) => {
		this.setState({userId: e.target.value});
	}

	saveChanges = async () => {
		const data = {
			id: this.state.task.id,
			title: this.state.title,
			projectId: this.state.projectId,
			userId: this.state.userId,
			status: this.state.status
		};
		const service = new TaskService();
		const success = document.querySelector(".taskModalEdit__success");
		const error = document.querySelector(".taskModalEdit__error");
		const res = await service.editTask(data);
		if (res) {
			success.style.display = 'block';
			this.setState({task: '', title: '', userId: null});
			setTimeout(() => {
				success.style.display = 'none';
				this.closeTaskModalEdit();
			}, 1000);
		} else {
			error.style.display = 'block';
		}
	}
	

	closeTaskModalEdit = () => {
		this.props.closeTaskModalEdit();
	}

	render() {
		const {title, userId, usersOnProject} = this.state;
		const justDevelopers = usersOnProject.filter(user => user.roleId === 3);

		let selectedDeveloper;
		let selectedDeveloperId;
		let otherDevelopers;
		let selectedDeveloperName;
		if (userId) {
			selectedDeveloper = justDevelopers.filter(user => user.id === userId)[0]
			selectedDeveloperId = selectedDeveloper.id;
			otherDevelopers = justDevelopers.filter(user => user.id !== selectedDeveloperId);
			selectedDeveloperName = selectedDeveloper.firstName + ' ' + selectedDeveloper.lastName;
		} else {
			selectedDeveloper = null;
			selectedDeveloperId = null;
			selectedDeveloperName = null;
			otherDevelopers = justDevelopers;
		}

		const textFromInput = this.state.title;
		return (
			<div className={this.props.taskModalClassName}>
				<form className="taskModalEdit__modal">
					<div className="taskModalEdit__title">Task Editor</div>
					<div className="taskModalEdit__textarea">
						<label htmlFor="textarea">Task</label>
						<textarea value={title} id="textarea" maxLength="200" onChange={(e)=> this.onChangeHandler(e)} type="text"></textarea>
						{textFromInput.length >= 200 ? <div className="taskModalEdit__textAreaError">Max length is 200 characters</div> : null}
					</div>
					<div className="taskModalEdit__select">
						<label htmlFor="select">Developer</label>
						<select id="select" className="select"
							required
							onChange={(e)=> this.onSelectHandler(e)}>
								<option value={selectedDeveloperId}>{selectedDeveloperName}</option>
							{otherDevelopers.map(developer => {
								return (
									<option key={developer.id} value={developer.id}>{developer.firstName} {developer.lastName}</option>
								)
							})}
						</select>
						<div className="taskModalEdit__success">Task was successfully changed</div>
						<div className="taskModalEdit__error">Something wrong</div>

					</div>
					<div className="taskModalEdit__btns">
					<button onClick={() => this.saveChanges()}
							type="button" 
							className="taskModalEdit__btn">Save changes</button>
						<button onClick={()=> this.closeTaskModalEdit()}
							type="button" 
							className="taskModalEdit__btn">Cancel</button>
					</div>
				</form>
			</div>
		)
	}
}