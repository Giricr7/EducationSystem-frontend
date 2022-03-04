import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../../UI/Loader/Loader';
import Intro from '../../Intro/Intro';
import ControlsBar from '../../ControlsBar/ControlsBar';
import MyTable from '../../Table/MyTable';
export class Teachers extends Component {
	state = {
		loading: false,
		teachers: null,
		searchText: ''
	};

	getTeachers = async () => {
		try {
			this.setState({ loading: true });
			const res = await axios.get('settings/teachers');
			this.setState({ loading: false, teachers: res.data.teachers });
		} catch (error) {
			console.log(error);
			this.setState({ loading: false });
			alert('Error 500, Something Went Wrong, please try again later');
		}
	};

	goToAdd = () => {
		this.props.history.push('/Teachers/Add');
	};

	goToEdit = teacherId => {
		this.props.history.push(`/Teachers/Edit/${teacherId}`);
	};

	goToDetails = teacherId => {
		this.props.history.push(`/Teachers/Details/${teacherId}`);
	};
	deleteTeacher = async (teacherId, teacherName) => {
		
			try {

				Swal.fire({
					title: `Do you want to delete a teacher with name ${teacherName}`,
					text: "You won't be able to revert this!",
					icon: 'warning',
					showCancelButton: true,
					cancelButtonColor: '#d33',
					confirmButtonColor: '#3085d6',
					confirmButtonText: 'Yes, delete it!'
				}).then(async(result) => {
					
					if (result.isConfirmed) {
						await axios.delete(`settings/teachers/delete/${teacherId}`);
						this.getTeachers();
					  Swal.fire(
						'Deleted!',
						`${teacherName} is deleted`,
						'success'
					  )
					}
				  })
	
				
			} catch (error) {
				console.log(error);
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
			const res = await axios.get(`settings/teachers/search/${this.state.searchText}`);
			this.setState({ loading: false });
			if (res.data.teachers.length < 1) {
				return Swal.fire({
					title:'Teachers Not Found!',
					icon:'info'
			});
			}
			this.setState({ teachers: res.data.teachers });
		} catch (error) {
			alert(error.response.data.error);
		}
	};

	componentDidMount() {
		this.getTeachers();
	}
	render() {
		return (
			<div>
				<Intro thisCategory='Teachers' logo='Person' />
				<ControlsBar
					search={this.search}
					searching={this.searching}
					thisCategory='Teachers'
					adding={true}
					goToAdd={this.goToAdd}
				/>
				{this.state.teachers && (
					<MyTable
						view={true}
						options={true}
						heads={[ 'FullName', 'Email', 'Age', 'Gender', 'Salary', 'Joined-At' ]}
						body={[ 'email', 'age', 'gender', 'salary', 'joinedAt' ]}
						items={this.state.teachers}
						deleteItem={this.deleteTeacher}
						goToEdit={this.goToEdit}
						goToDetails={this.goToDetails}
					/>
				)}
				{this.state.loading && <Loader />}
			</div>
		);
	}
}

export default Teachers;
