import React, {Component} from 'react';
import TaskService from '../services/TaskService';
import TaskModalEdit from '../components/TaskModalEdit';
import Confirm from '../components/Confirm';
import '../css/task.min.css';

export default class Task extends Component  {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.task.id,
			title: this.props.task.title,
			projectId: this.props.task.projectId,
			userId: this.props.task.userId,
			showMoreInformation: false,
			taskHasBeenDeleted: false,
			showTaskModalEdit: false,
			showConfirm: false
		}
	}

	getClassName = (taskStatus) => {
		switch(taskStatus) {
			case 1:
				return 'task task__backlog';
			case 2:
				return'task task__inProgress';
			case 3:
				return 'task task__done';
			default:
				return undefined;
			};
	}


	deleteTask = async (e) => {
		const taskId = e.target.getAttribute('data-id');
		const taskService = new TaskService();
		const res =  await taskService.deleteTask(taskId);
		if (res) {
			this.setState({taskHasBeenDeleted: true})
			setTimeout(() => {
				this.refreshDashBoard();
			}, 500)
		} else {
			console.log("Что-то пошло не туда")
		}
	};

	refreshDashBoard = () => {
		this.props.refreshDashBoard();
	};

	showMore = (e) => {
		const elem = e.target.parentNode.parentNode.parentNode;
		console.log(elem)
		if (e.target.classList.contains('fa-arrow-down')) {
			e.target.classList.remove('fa-arrow-down')
			e.target.classList.add('fa-arrow-up');
			elem.classList.add('task__increased');
			this.setState({showMoreInformation: true})
		} else {
				e.target.classList.remove('fa-arrow-up')
			e.target.classList.add('fa-arrow-down');
			elem.classList.remove('task__increased');
			this.setState({showMoreInformation: false})
		}
	};

	openTaskModalEdit = () => {
		this.setState({showTaskModalEdit: true});
	}
	
	closeTaskModalEdit = () => {
		this.setState({showTaskModalEdit: false});
		this.refreshDashBoard();
	}

	showConfirm = () => {
		this.setState({showConfirm: true})
	}

	closeConfirm = () => {
		this.setState({showConfirm: false})
	}
	
	render() {
		const {taskHasBeenDeleted, showTaskModalEdit, showConfirm} = this.state;
		const {task, usersOnProject} = this.props;
		const userName = task.user ? task.user.firstName + ' ' + task.user.lastName : '';
		let taskClassName = this.getClassName(task.status);
		let taskText;
		if (!this.state.showMoreInformation && task.title.length > 100) {
			taskText = task.title.substring(0, 100) + '...';
		} else {
			taskText = task.title
		}

		let confirmClassName;
		showConfirm ? confirmClassName = 'confirm active' : confirmClassName = 'confirm';

		let taskModalClassName;
		showTaskModalEdit ? taskModalClassName = 'taskModalEdit active' : taskModalClassName = 'taskModalEdit';
		return (
			<>
				{showConfirm
				? <Confirm 
					confirmClassName={confirmClassName} 
					data={task.id}
					deleteTask={(e) => this.deleteTask(e)} 
					closeConfirm={() => this.closeConfirm()} />
				: null }
				{showTaskModalEdit
					? <TaskModalEdit 
						task={task} 
						usersOnProject={usersOnProject} 
						taskModalClassName={taskModalClassName} 
						closeTaskModalEdit={()=> this.closeTaskModalEdit()} 
						refreshDashBoard={() => this.refreshDashBoard()}/>
				: null}
				<div draggable={true}
				key={task.id}
				id={task.id}
				data-status={task.status}
				className={taskClassName}>
				<div className="task__text">
					{taskHasBeenDeleted? <div className="task__deleted">Task has been deleted</div> : <div className="task__title">{taskText}</div>}
					
					<div className="task__arrow">
						<i className="fa fa-arrow-down" aria-hidden="true" onClick={(e) => this.showMore(e)}></i>
					</div>
				</div>
				<div className="task__divider"></div>
				<div className="task__info">
					<div className="task__executor">
						{ task.roleId !== 3 
						?
						<div>
							<h4 className="task__subtitle">Исполнитель: {userName} </h4> 
						</div>
						: null
						}
					</div>
					<div className="task__icons">
						<div className="task__edit">
							<i className="fa fa-pencil" data-id={task.id} data-status={task.status} onClick={() => this.openTaskModalEdit()} aria-hidden="true"></i>
						</div>
						<div className="task__delete">
							<i className="fa fa-trash" data-id={task.id} onClick={() => this.showConfirm()}  aria-hidden="true"></i>
						</div>
					</div>
				</div>
			</div>
			</>
		)
	}
};
