import React, {Component} from 'react';
import '../css/statusList.min.css';
import Task from './Task.js';

export default class StatusList extends Component{
	constructor(props) {
		super(props);
		this.state = {
				taskIdtoChange: '',
				newStatusOfTask: '',
		}
	}

	static getDerivedStateFromProps (props, state) {
		if(props.tasks !== state.tasks)
		return ({
			tasks: props.statusListProps.tasks,
			usersOnProject: props.statusListProps.usersOnProject,
			projectId: props.statusListProps.projectId,
			statusId: props.statusId
		});
		return null
	}
	// componentDidMount() {
	// 	this.setState({
	// 		tasks: this.props.statusListProps.tasks,
	// 		usersOnProject: this.props.statusListProps.usersOnProject,
	// 		projectId: this.props.statusListProps.projectId,
	// 		statusId: this.props.statusId
	// 	})
	// }

	refreshDashBoard = () => {
		this.props.statusListProps.refreshDashBoard();
	}
	dragStartHandler = (e) => {
		this.props.statusListProps.dragStartHandler(e)
	}
	dragOverHandler = (e) => {
		this.props.statusListProps.dragOverHandler(e)
	}
	dragLeaveHandler = (e) => {
		this.props.statusListProps.dragLeaveHandler(e)
	}
	dropHandler = (e) => {
			this.props.statusListProps.dropHandler(e)
	}
	 
	render () {
		const {tasks, statusId, usersOnProject} = this.state;
		let filteredTasks;
		let statusListClassName;
		let statusListTitleName;
		switch (statusId) {
			case 1: 
				filteredTasks = tasks.filter(task => task.status === 1);
				statusListClassName = 'statusList statusList__backlog';
				statusListTitleName = "BACKLOG";
			break;
			case 2:
				filteredTasks = tasks.filter(task => task.status === 2);
				statusListClassName = 'statusList statusList__inProgress'
				statusListTitleName = "IN PROGRESS"
			break;
			case 3:
				filteredTasks = tasks.filter(task => task.status === 3);
				statusListClassName = 'statusList statusList__done'
				statusListTitleName = "DONE"
			break;
			default:
			return undefined;
		}
		return (
			<div
				onDragStart={(e) => this.dragStartHandler(e)}
				onDragLeave={(e) => this.dragLeaveHandler(e)}
				onDragOver={(e) => this.dragOverHandler(e)}
				onDrop={(e) => this.dropHandler(e)}
				data-id = {statusId}
				className={statusListClassName}>
					<div className="statusList__title">{statusListTitleName}</div>
					{filteredTasks.map(task => {
						return <Task 
							key={task.id} 
							task={task}
							usersOnProject={usersOnProject}
							refreshDashBoard={() => this.refreshDashBoard()}/>
					})}
			</div>
		)
	}
}