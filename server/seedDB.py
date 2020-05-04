import requests 
import random
import json
from loaders import TextLoader



url_base = 'http://localhost:8080'

# GET ADMIN TOKEN
url_token = url_base + '/api/auth/signin'
token_params = {'email': 'admin@admin.com', 'password': 'admin148635'}
r_token = requests.post(url = url_token, data = token_params)
token = r_token.json()['token']

print 'Obtained admin token'

headers = {"Authorization": "Bearer " + token}

# GET USERS
url_get_users = url_base + '/api/user/softDeleted/all'
r_url_get_users = requests.get(url = url_get_users, headers = headers)
users = r_url_get_users.json()

print "Fetched all users"

# CREATE COURSES
course_titles = ['Advanced Graphical Techniques', "Photo Design", "Intro Vormgeving", "Web development I"]
course_schoolyears = ['2020-2021', '2019-2020']
course_directions = ["1GDM", "2NMD", "3NMD", "2CMO", "3CMO", "2GMB", "3GMB", "2AVD", "3AVD"]
course_years = ['2019', '2020']
courses_ids = []

print 'Creating courses.'
courses_loader = TextLoader(duration=len(course_titles))
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
	courses_loader.run()

# # CREATE ASSIGNMENTS
assignment_titles = ["Skateboard Design", "MERN final project", "Photoshop Collage", "Wekweek prototype", "Portfolio", "Rebranding Eindopdracht"]
assignments_ids = []

print 'Creating assignments.'
assignment_loader = TextLoader(duration=len(assignment_titles))
for i in range(len(assignment_titles)):
	url_new_assignment = url_base + '/api/assignment'
	data = {
		'title': assignment_titles[i],
		'courseId': random.choice(courses_ids),
	}
	r_new_assignment = requests.post(url = url_new_assignment, data = data, headers = headers)
	assignments_ids.append(r_new_assignment.json()['_id'])
	assignment_loader.run()

# CREATE POSTS
post_pictures = ['5e982c7d68849619dc5ba682', '5ea28c53a7ed76058468d9dd', '5eafd54f46f295416c4286c7', '5eafd58246f295416c4286d6', '5eafd59c46f295416c4286ef', '5eafd5ad46f295416c428708', '5eafd5c546f295416c42870e', '5eafd5d146f295416c428714', '5eafd5e846f295416c42871a', '5eafd5f846f295416c428721', '5eafd61446f295416c428739', '5eafd65046f295416c428751', '5eafd65b46f295416c428769', '5eafd67346f295416c42877d', '5eafd68546f295416c428782', '5eafd68d46f295416c428787', '5eafd69846f295416c42878c', '5eafd6ae46f295416c428794', '5eafd6bb46f295416c42879c', '5eafd6c646f295416c4287a3']

print 'Creating 4 posts per user.'
post_loader = TextLoader(duration=len(users))
for t in range(len(users)):
	if users[t]['email'] != 'admin@admin.com':
		r_token_user = requests.post(url = url_base + '/api/auth/signin', data = {'email': users[t]['email'], 'password': 'test'})
		print(users[t]['email'])
		token_user = r_token_user.json()['token']
		for i in range(4):
			amount_of_pictures = random.randint(1,4)
			pictures = []
			for i in range(0, amount_of_pictures):
				pictures.append(random.choice(post_pictures))
			url_post = url_base + '/api/post'
			post_headers = {"Authorization": "Bearer " + token_user}
			data = {
				"pictures": json.dumps(pictures, separators=(',', ':')),
				'assignmentId': random.choice(assignments_ids).encode("utf-8"),
				'urlToProject': 'www.google.com'.encode("utf-8"),
			}
			r_new_post = requests.post(url = url_post, data = data, headers = post_headers)
	post_loader.run()
