import json
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

class MainHandler(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/plain'
		self.response.out.write('Hello, webapp World!')

class TagsHandler(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = 'text/javascript'
		url = self.request.path[6:]
		data = {
			"size1": 1,
			"size2": 2,
			"size3": 3,
			"size4": 4,
			"size5": 5,
			"size6": 6,
			"size7": 7,
			"size8": 8,
		}
		self.response.out.write('taggly(%s);' % json.dumps(data))

application = webapp.WSGIApplication(
	[
		('/tags/.*', TagsHandler),
		('/', MainHandler)
	],
	debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()
