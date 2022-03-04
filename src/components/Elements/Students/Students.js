import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../../UI/Loader/Loader';
import Intro from '../../Intro/Intro';
import ControlsBar from '../../ControlsBar/ControlsBar';
import MyTable from '../../Table/MyTable';
class Students extends Component {
	state = {
		loading: false,
		students: null,
		classId: '',
		classes: [],
		searchText: ''
	};

	getStudents = async () => {
		try {
			this.setState({ loading: true });
			const res = await axios.get('settings/students');
			this.setState({ loading: false, students: res.data.students });
		} catch (error) {
			console.log(error);
			this.setState({ loading: false });
			alert('Error 500, Something Went Wrong, please try again later');
		}
	};

	goToAdd = () => {
		this.props.history.push('/Students/Add');
	};

	goToEdit = studentId => {
		this.props.history.push(`/Students/Edit/${studentId}`);
	};

	goToDetails = studentId => {
		this.props.history.push(`/Students/Details/${studentId}`);
	};
	delete = async (studentId, studentName) => {
		
		try {
				
			Swal.fire({
				title: `Do you want to delete a student with name ${studentName}`,
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				cancelButtonColor: '#d33',
				confirmButtonColor: '#3085d6',
				confirmButtonText: 'Yes, delete it!'
			}).then(async(result) => {
				
				if (result.isConfirmed) {
					await axios.delete(`settings/student/delete/${studentId}`);
					this.getStudents();
				  Swal.fire(
					'Deleted!',
					`${studentName} is deleted`,
					'success'
				  )
				}
			  })

			} catch (error) {
				console.log(error);
			}
		
	};

	classChangeHandler = e => {
		this.setState({ classId: e.target.value });
	};

	addStudentToClassHandler = async (e, studentId) => {
		e.preventDefault();
		this.setState({ loading: true });
		// get the classId from the state
		const classId = this.state.classId;
		try {
			const body = { classId: classId, studentId: studentId };
			await axios.patch(`settings/class/addStudent`, body);
			this.getStudents();
		} catch (error) {
			alert(error.response.data.error);
			this.setState({ loading: false });
		}
	};

	getClassesForSelecting = async () => {
		try {
			const res = await axios.get('settings/classes');
			this.setState({ classes: res.data.classes });
		} catch (error) {
			alert('error');
		}
	};
	searching = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	search = async () => {
		if (this.state.searchText === '')
		{ return Swal.fire({
			title:'Please insert something',
			icon:'question'
		}) };
		this.setState({ loading: true });
		try {
			const response = await axios.get(`settings/students/search/${this.state.searchText}`);
			console.log('search -> res', response);
			this.setState({ loading: false });
			console.log(response.data.students);

			if (response.data.students.length < 1) {
				return Swal.fire({
					title:'Students Not Found!',
					icon:'info'
			});
			}
			this.setState({ students: response.data.students });
		} catch (error) {
			console.log('search -> error', error);
			alert(error.response.data.error);
		}
	};

	componentDidMount() {
		this.getClassesForSelecting();
		this.getStudents();
	}
	render() {
		return (
			<div>
				<Intro thisCategory='Students' logo='People' />
				<ControlsBar
					searching={this.searching}
					search={this.search}
					thisCategory='Students'
					adding={true}
					goToAdd={this.goToAdd}
				/>
				{this.state.students && (
					<MyTable
						classId={this.state.classId}
						classes={this.state.classes}
						addStudentToClass={this.addStudentToClassHandler}
						classChangeHandler={this.classChangeHandler}
						students={true}
						view={true}
						options={true}
						heads={[ 'FullName', 'Email', 'Age', 'Gender', 'Joined-At' ]}
						body={[ 'email', 'age', 'gender', 'joinedAt' ]}
						items={this.state.students}
						deleteItem={this.delete}
						goToEdit={this.goToEdit}
						goToDetails={this.goToDetails}
					/>
				)}
				{this.state.loading && <Loader />}
			</div>
		);
	}
}

export default Students;
