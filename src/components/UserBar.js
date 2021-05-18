import React, {Component} from 'react';
import UserBarSelect from '../components/userBarSelect';
import AddingForm from '../components/AddingForm';
import '../css/userbar.min.css';

export default class UserBar extends Component {
	constructor(props) {
		super(props);
		this.state= {
			currentUser: this.props.currentUser,
			projectId: '',
			showModal: false
		}
	}

	static getDerivedStateFromProps(props, state) {
		if(props.projectId !== state.projectId){
			return {projectId: props.projectId}
		} else {
		}
		return null
	}
	changeProject = (event) => {
		this.props.changeProject(event)
	}
	openModal = () => {
		this.setState({showModal: true});
	}
	closeModal = () => {
		this.setState({showModal: false});
		this.props.refreshDashBoard();
	}
	refreshDashBoard = () => {
		this.props.refreshDashBoard();
	}
	render () {
		const {currentUser, logout, usersOnProject} = this.props;
		const {projectId, showModal} = this.state;
		let modalClassName;
		showModal ? modalClassName = 'addingForm active' : modalClassName = 'addingForm';
		return (
			<div className="userbar">
				{showModal
				? <AddingForm usersOnProject={usersOnProject} projectId={projectId} modalClassName={modalClassName} closeModal={()=> this.closeModal()}></AddingForm>
				: null}
				<div className="container">
					<div className="userbar__content">
						<div className ="userbar__user">
							<div className="userbar__img">
							<img src="https://cdn2.iconfinder.com/data/icons/avatars-99/62/avatar-370-456322-512.png" alt="user_pic"/>
							</div>
							<h3 className="userbar__name">{currentUser.firstName} {currentUser.lastName}</h3>
						</div>
						{currentUser.roleId === 1 ? <UserBarSelect/> : null}
						<div className="userbar__btns">
							<button 
								onClick={()=> this.openModal()}
								type="button" 
								className="userbar__btn">New Task</button>
							<button 
								onClick={logout}
								type="button" 
								className="userbar__btn">Log Out</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}