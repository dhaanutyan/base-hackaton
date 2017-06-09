var path = require('path')
var express = require('express')
var cookieSession = require('cookie-session')
var serveStatic = require('serve-static')
var serveIndex = require('serve-index')

// config
var PORT = 8000

// internals
var appRoot = path.resolve(__dirname)
var app = express()

app.use(cookieSession({
  name: 'session',
  keys: ['f03b1c0c-7ce1-4037-9013-fbd49fe1e141'],
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}))

// root path: redirect to remembered page or to examples
app.get(/^\/$/, function (request, response, next) {
  response.redirect(request.session.previousHtml || '/examples')
})

// remember html pages
app.use(function (request, response, next) {
  if (isHtmlPage(request.path)) request.session.previousHtml = request.path
  next()
})

// serve static files
app.use(serveStatic(__dirname))

// serve directory index
app.use(serveIndex(__dirname, {icons: true, view: 'details'}))

// start server
var listener = app.listen(process.env.PORT || PORT, function () {
  console.log('Your app is listening on http://localhost:' + listener.address().port)
})

// helpers
function isHtmlPage (path) {
  return /.*(\.html|.+\/)($|#.*|\?.*)/i.test(path)
}