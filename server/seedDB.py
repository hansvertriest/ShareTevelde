import requests 
import random


url_base = 'http://localhost:8080'

# GET ADMIN TOKEN
url_token = url_base + '/api/auth/signin'
token_params = {'email': 'admin@admin.com', 'password': 'admin148635'}
r_token = requests.post(url = url_token, data = token_params)
token = r_token.json()['token']

headers = {"Authorization": "Bearer " + token}

# GET USERS
url_get_users = url_base + '/api/user/softDeleted/all'
r_url_get_users = requests.get(url = url_get_users, headers = headers)
users = r_url_get_users.json()

# CREATE COURSES
course_titles = ['Advanced Graphical Techniques', "Photo Design", "Intro Vormgeving", "Web development I"]
course_schoolyears = ['2020-2021', '2019-2020']
course_directions = ["1GDM", "2NMD", "3NMD", "2CMO", "3CMO", "2GMB", "3GMB", "2AVD", "3AVD"]
course_years = ['2019', '2020']
courses_ids = []

for i in range(len(course_titles)):
	url_new_post = url_base + '/api/course'
	data = {
		'courseTitle': course_titles[i],
		'schoolyear': random.choice(course_schoolyears),
		'direction': random.choice(course_directions),
		'year': random.choice(course_years),
	}
	r_new_post = requests.post(url = url_new_post, data = data, headers = headers)
	courses_ids.append(r_new_post.json()['_id'])

# # CREATE ASSIGNMENTS
assignment_titles = ["Skateboard Design", "MERN final project", "Photoshop Collage", "Wekweek prototype", "Portfolio", "Rebranding Eindopdracht"]
assignments_ids = []

for i in range(len(assignment_titles)):
	url_new_assignment = url_base + '/api/assignment'
	data = {
		'title': assignment_titles[i],
		'courseId': random.choice(courses_ids),
	}
	r_new_assignment = requests.post(url = url_new_assignment, data = data, headers = headers)
	assignments_ids.append(r_new_assignment.json()['_id'])

# CREATE POSTS
for t in range(len(users)):
	r_token_user = requests.post(url = url_base + '/api/auth/signin', data = {'email': users[t]['email'], 'password': 'test'})
	token_user = r_token_user.json()['token']
	for i in range(2):
		url_post = url_base + '/api/post'
		post_headers = {"Authorization": "Bearer " + token_user}
		data = {
			"pictures": '["5e982c7d68849619dc5ba682", "5ea28c53a7ed76058468d9dd"]'.encode("utf-8"),
			'assignmentId': random.choice(assignments_ids).encode("utf-8"),
			'urlToProject': 'www.google.com'.encode("utf-8"),
		}
		r_new_post = requests.post(url = url_post, data = data, headers = post_headers)
