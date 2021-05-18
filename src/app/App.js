import React, {Component} from 'react';
import Error from '../components/Error';
import TaskService from '../services/TaskService';
import UserService from '../services/UserService';
import ProjectService from '../services/ProjectService';
import DashBoard from '../components/DashBoard';
import LoginScreen from '../components/LoginScreen';
import '../css/index.css';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
				login: '',
				password: '',
				isChecked: false,
				loginFailed: false,
				showExecutor: false
		}
	}

	async componentDidMount() {
		const currentUser = JSON.parse(localStorage.getItem("currentUser"));
		if (currentUser) {
			const data = {
				login: currentUser.login,
				password: currentUser.password
			}
			await this.sendData(data);
		}
	}
	saveUserToLocalStorage = (currentUser) => {
		localStorage.setItem("currentUser", JSON.stringify(currentUser))
	}

	getUserFromLocalStorage = () => {
		return JSON.parse(localStorage.getItem("currentUser"))
	}
	removeUserFromLocalStorage = () => {
		localStorage.removeItem("currentUser");
	}

	changeLog = (event) => {
		this.setState({login: event.target.value});
	}
	changePass = (event) => {
		this.setState({password: event.target.value});
	}

	logout = () => {
		this.setState({
				isChecked: false, 
				loginFailed: false
		});
		this.removeUserFromLocalStorage()
	}

	sendData = async (data) => {

		const taskService = new TaskService();
		const userService = new UserService();
		const projectService = new ProjectService();
		const currentUser = await userService.userLogin(data);
		if (currentUser) {
			this.saveUserToLocalStorage(currentUser);
			let id = currentUser.id;
			const userProject = await userService.getUserProject(id);
			const projectId = userProject.projects[0].id;
			const tasks = await taskService.getAllTasksByProjectId(projectId);
			const project = await projectService.getAllInformationAboutProject(projectId);
			const usersOnProject = project.users;
			this.setState({
					currentUser: currentUser,
					tasks: tasks,
					project: project.projectId,
					projectId: projectId,
					usersOnProject: usersOnProject,
					isChecked: true,
					loginFailed: false
			});
		} else {
			this.setState({
				currentUser: null,
				isChecked: false,
				loginFailed: true
			});
		}
	}

	render () {
		const {currentUser, tasks, project, projectId, usersOnProject} = this.state;
		const dashboardProps = {
			currentUser: currentUser,
			tasks: tasks,
			project: project,
			projectId: projectId,
			usersOnProject: usersOnProject
		}
		if (this.state.loginFailed === true) {
				return (
						<Error/>
				)
		}
		return (
			<>
				<div className="container">
					{this.state.isChecked === false
						? <LoginScreen 
							sendData={(data) => this.sendData(data)} 
							changeLog={this.changeLog} 
							changePass={this.changePass}/>
						: <DashBoard dashboardProps={dashboardProps} logout={this.logout}/>}
				</div>

			</>
		)
	}
}

