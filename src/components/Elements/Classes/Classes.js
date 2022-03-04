import React, { Component, Fragment } from 'react';
import Boxes from '../../Boxes/Boxes';
import axios from 'axios';
import Swal from 'sweetalert2';


export class Classes extends Component {
	state = {
		classes: [],
		loading: false,
		searchText: ''
	};

	getClasses = async () => {
		this.setState({ loading: true });
		try {
			const res = await axios.get(`settings/classes`);
			this.setState({ classes: res.data.classes, loading: false });
		} catch (error) {
			console.log(error);
			this.setState({ loading: false });
			alert('Error 500, Something went wrong, please try again later');
		}
	};

	goToAdd = () => {
		this.props.history.push('/Classes/Add');
	};

	goToEdit = classId => {
		this.props.history.push(`/Classes/Edit/${classId}`);
	};

	delete = async (classId, className) => {
	
			try {

				Swal.fire({
					title: `Do you want to delete a class with name ${className}`,
					text: "You won't be able to revert this!",
					icon: 'warning',
					showCancelButton: true,
					cancelButtonColor: '#d33',
					confirmButtonColor: '#3085d6',
					confirmButtonText: 'Yes, delete it!'
				}).then(async(result) => {
					
					if (result.isConfirmed) {
						await axios.delete(`settings/class/delete/${classId}`);
						this.getClasses();
					  Swal.fire(
						'Deleted!',
						`${className} is deleted`,
						'success'
					  )
					}
				  })
				
			} catch (error) {
				alert(error.response.data.error);
			}
		
	};

	searching = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	search = async () => {
		if (this.state.searchText === '')
		{
			return Swal.fire({
			title:'Please insert something',
			icon:'question'
		}) };
		this.setState({ loading: true });
		try {
			const res = await axios.get(`settings/classes/search/${this.state.searchText}`);
			this.setState({ loading: false });
			if (res.data.classes.length < 1) {
				return Swal.fire({
					title:'Classes Not Found!',
					icon:'info'
			});
			}
			this.setState({ classes: res.data.classes });
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	goToDetails = classId => {
		this.props.history.push(`/Classes/Details/${classId}`);
	};
	componentDidMount() {
		this.getClasses();
	}
	render() {
		return (
			<Fragment>
				<Boxes
					searching={this.searching}
					search={this.search}
					items={this.state.classes}
					loading={this.state.loading}
					logo='Class'
					thisCategory='Classes'
					goToAdd={this.goToAdd}
					goToEdit={this.goToEdit}
					goToDetails={this.goToDetails}
					delete={this.delete}
				/>
			</Fragment>
		);
	}
}

export default Classes;
