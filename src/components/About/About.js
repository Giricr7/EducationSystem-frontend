import React from 'react';
import './About.scss';
function About() {
	return (
		<div id='About'>
			<h1 style={{ textAlign: 'center' }}>About The Application</h1>
			<div className='row'>
				<div className='col-md-6'>
					<p>
						This is an app which is built for showing some programming skills purpose, as a part of my final project.
					</p>
					<p>
						This app has the basic functionalities of a CRUD. Here you can create,read,update and delete a subject,student,class and teacher.
					</p>
				</div>
				<div className='col-md-6'>
					<p>
						This is a school tracking system in which you can manage the school subjects, teachers,
						students and classes
					</p>
					<p>Start using the app, navigate from the navbar at the left side, happy hacking :)</p>
				</div>
			</div>
		</div>
	);
}

export default About;
