exports.index = function (req, res) {
  Post.list({}, function (err, posts) {
    res.render('posts', {
      title: 'List of posts',
      posts: posts
    })
  })
}

// load a post
exports.load = function (req, res, next, id) {
  // set req.post
  next()
}

// list posts
// GET /posts
exports.index = function (req, res) {
  // render posts/index
}

// new post
// GET /posts/new
exports.new = function (req, res) {
  // render posts/new
}

// create post
// POST /posts
exports.create = function (req, res) {
  // render posts/new if err
  // redirect to posts/:id if created
}

// show post
// GET /posts/:id
exports.show = function (req, res) {
  // render posts/show
}

// edit post
// GET /posts/:id/edit
exports.edit = function (req, res) {
  // render posts/edit
}

// update post
// PUT /posts/:id
exports.update = function (req, res) {
  // render posts/edit if err
  // redirect to /posts/:id if updated
}

// delete post
// DEL /posts/:id
exports.destroy = function (req, res) {
  // redirect to /posts
}