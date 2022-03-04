import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Boxes from '../../Boxes/Boxes';
import Swal from 'sweetalert2';
export class Subjects extends Component {
	state = {
		loading: false,
		subjects: [],
		searchText: ''
	};

	
	getSubjects = async () => {
		this.setState({ loading: true });
		try {
			const subjects = await axios.get('settings/subjects');
			this.setState({ subjects: subjects.data.subjects, loading: false });
		} catch (error) {
			console.error(error);
			this.setState({ loading: false });
			alert('Error 500, Something Went Wrong, please try again later');
		}
	};
	componentDidMount() {
		this.getSubjects();
	}

	goToAddSubjects = () => {
		this.props.history.push('/Subjects/Add');
	};

	goToEditSubject = subjectId => {
		console.log('Subjects -> subjectId', subjectId, typeof subjectId);

		this.props.history.push(`/Subjects/Edit/${subjectId}`);
	};

	goToDetails = subjectId => {
		this.props.history.push(`/Subjects/Details/${subjectId}`);
	};
	deleteSubject = async (subjectId, subjectName) => {
	
	
		try {
				
			Swal.fire({
				title: `Do you want to delete a subject with name ${subjectName}`,
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				cancelButtonColor: '#d33',
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Yes, delete it!'
			}).then(async(result) => {
				
				if (result.isConfirmed) {
					await axios.delete(`settings/subjects/delete/${subjectId.toString()}`);
					this.getSubjects();
				  Swal.fire(
					'Deleted!',
					`${subjectName} is deleted`,
					'success'
				  )
				}
			  })
				
			} catch (error) {
				console.log(error);
			}
		}
	

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
			const res = await axios.get(`settings/subjects/search/${this.state.searchText}`);
			this.setState({ loading: false });
			if (res.data.subjects.length < 1) {
				return Swal.fire({
					title:'Subjects Not Found!',
					icon:'info'
			});
			} else {
				this.setState({ subjects: res.data.subjects });
			}
		} catch (error) {
			alert(error.response.data.error);
		}
	};
	render() {
		return (
			<Fragment>
				<Boxes
					searching={this.searching}
					search={this.search}
					items={this.state.subjects}
					loading={this.state.loading}
					logo='School'
					thisCategory='Subjects'
					goToAdd={this.goToAddSubjects}
					goToEdit={this.goToEditSubject}
					delete={this.deleteSubject}
					goToDetails={this.goToDetails}
				/>
			</Fragment>
		);
	}
}

export default Subjects;
