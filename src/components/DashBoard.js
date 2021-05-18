import React, {Component} from 'react';
import StatusList from './StatusList.js';
import UserBar from './UserBar';
import TaskService from '../services/TaskService';
import '../css/dashboard.min.css';


export default class DashBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
				currentUser: JSON.parse(localStorage.getItem("currentUser")),
				tasks: this.props.dashboardProps.tasks,
				project: this.props.dashboardProps.project,
				projectId: this.props.dashboardProps.projectId,
				usersOnProject: this.props.dashboardProps.usersOnProject
		}
	}
	
	refreshDashBoard = async () => {
		const taskService = new TaskService();
		let tasks = await taskService.getAllTasksByProjectId(this.state.projectId);
		this.setState({
			tasks: tasks
		});
	}
	dragStartHandler = (e) => {
		let oldStatus = e.target.getAttribute('data-status');
		this.setState({
			taskIdToChange: e.target.id,
			oldStatus: oldStatus
		});
	}

	dragOverHandler = (e) => {
		e.preventDefault();
		e.currentTarget.style.background = '#a0a0a062';
	}

	dragLeaveHandler = (e) => {
		e.currentTarget.style.background = 'none'
	}

	dropHandler = (e) => {
		e.preventDefault();
		const newStatus = e.currentTarget.getAttribute('data-id');
		e.currentTarget.style.background = 'none';
		e.currentTarget.childNodes.forEach(item => {
			item.style.display = ''
		});
		this.updateTask(newStatus);
	}

	updateTask = async (newStatus) => {
		const taskService = new TaskService();
		const data = {
			"taskId": this.state.taskIdToChange,
			"status": newStatus
		};
		await taskService.taskStatusUpdate(data);
		const projectId = this.props.dashboardProps.projectId
		const tasks = await taskService.getAllTasksByProjectId(projectId);
		if (tasks) {
			this.setState({   
				tasks: tasks
			});
		}
	}

	render() {
		const {logout} = this.props;
		const {tasks, projectId, currentUser, usersOnProject} = this.state;
		// const {tasks, projectId, currentUser, usersOnProject} = this.props.dashboardProps;
		// let userName = this.state.currentUser.firstName + ' ' + this.state.currentUser.lastName;
		const tasksToShow = currentUser.roleId === 3 
		? tasks.filter(task => task.userId === currentUser.id)
		: tasks;

		let statusListProps = {
			// userName: userName,
			tasks: tasksToShow,
			currentUser: currentUser,
			usersOnProject: usersOnProject,
			userId: currentUser.id,
			roleId: currentUser.roleId,
			projectId: projectId,
			refreshDashBoard: () => this.refreshDashBoard(),
			dragStartHandler:  (e) =>this.dragStartHandler(e),
			dropHandler: (e) =>this.dropHandler(e),
			dragOverHandler: (e) => this.dragOverHandler(e),
			dragLeaveHandler: (e) => this.dragLeaveHandler(e)
		}
		return (
			<>
				<div className="container">
					<UserBar currentUser={currentUser} logout={logout} usersOnProject={usersOnProject} projectId={projectId} refreshDashBoard={() => this.refreshDashBoard()}/>
					<div className="dashBoard">
						<div className="dashBoard__wrapper">
							<StatusList key="1" statusListProps={statusListProps} tasks={tasksToShow} statusId={ 1 }/>
							<StatusList key="2" statusListProps={statusListProps} tasks={tasksToShow} statusId={ 2 }/>
							<StatusList key="3" statusListProps={statusListProps} tasks={tasksToShow} statusId={ 3 }/>
						</div>
					</div>
				</div>
			</>
		)
	}
}