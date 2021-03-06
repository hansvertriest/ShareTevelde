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
post_pictures = [
	'5ebbd85d46ebec5098d45f97',
	'5ebbd8b246ebec5098d45f9a',
	'5ebbd8ca46ebec5098d45f9d',
	'5ebbd8e446ebec5098d45fa0',
	'5ebbd91246ebec5098d45fa3',
	'5ebbd95646ebec5098d45fa6',
	'5ebbd97746ebec5098d45fa9',
	'5ebbd98f46ebec5098d45fac',
	'5ebbd9a746ebec5098d45faf',
	'5ebbd9dd46ebec5098d45fb2',
	'5ebbd9ee46ebec5098d45fb5',
	'5ebbd9ff46ebec5098d45fb8',
	'5ebbda1246ebec5098d45fbb',
	'5ebbe07e46ebec5098d45ffc',
	'5ebbe07e46ebec5098d45ffd',
	'5ec5865214629543bc4773d9',
	'5ec5865214629543bc4773da',
	'5eca4af2f7501056e4c9aea7',
	'5eca4afaf7501056e4c9aea8'
]

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
