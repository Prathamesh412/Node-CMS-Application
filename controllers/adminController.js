const Post = require("../model/PostModel");
const {
  findByIdAndDelete
} = require("../model/PostModel");
const Category = require("../model/CategoryModel");
const Comment = require('../model/CommentModel');
const {
  selectOption,
  isEmpty
} = require("../config/customFunctions");

module.exports = {
  index: (req, res, next) => {
    res.render("layouts/adminlayout");
  },

  getPosts: (req, res, next) => {
    Post.find({}, function (err, posts) {
      res.render("admin/posts/index", {
        posts: posts,
      });
    }).populate("category");
  },

  submitPosts: (req, res, next) => {
    const commentsAllowed = req.body.allowComments ? true : false;

    // Check for the input file
    let filename = '';

    if (!isEmpty(req.files)) {
      let file = req.files.uploadedFile;
      let filename = file.name
      // console.log(filename)

      let uploadDir = "./public/uploads/";

      file.mv(uploadDir + filename, function (err) {
        if (err) console.log(err)
      })

      const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        allowComments: commentsAllowed,
        category: req.body.category,
        file: `/uploads/${filename}`
      });

      newPost.save().then((post) => {
        req.flash("success-message", "Post created successfully !!!");
        res.redirect("/admin/posts");
      });
    }
  },

  createPostGet: (req, res, next) => {
    Category.find({}, function (err, cats) {
      res.render("admin/posts/create", {
        cats: cats
      });
    });
  },

  editPost: (req, res, next) => {
    const postId = req.params.id;

    Post.findById(postId, function (err, post) {
      Category.find({}, function (err, category) {
        res.render("admin/posts/edit", {
          post: post,
          cats: category,
          helpers: {
            select: selectOption
          }
        });
      })
    })
  },

  editPostSubmit: (req, res) => {
    const commentsAllowed = req.body.allowComments ? true : false;
    Post.findById(
      req.params.id,
      function (err, post) {

        post.title = req.body.title;
        post.description = req.body.description;
        post.status = req.body.status;
        post.commentsAllowed = commentsAllowed;
        post.category = req.body.category;

        post.save(function (err) {
          if (err) console.log(err);
          else {
            res.redirect("/admin/posts")
          }
        })
      })
  },

  deletePost: (req, res) => {
    Post.findByIdAndDelete(req.params.id, function (err) {
      console.log(err);
    });

    res.redirect("/admin/posts");
  },

  /* All Controllers method*/

  getCategories: (req, res) => {
    Category.find({}, function (err, cats) {
      res.render("admin/categories/index", {
        cats: cats
      });
    });
  },

  createCategories: (req, res) => {
    var categoryName = req.body.name;

    if (categoryName) {
      const newCategory = new Category({
        title: categoryName,
      });

      newCategory.save().then((category) => {
        res.status(200).json(category);
      });
    }
  },
  editCategoriesGetRoute: async (req, res) => {
    const catId = req.params.id;

    const cats = await Category.find();

    Category.findById(catId).then(cat => {

      res.render('admin/categories/editCategories', {
        category: cat,
        categories: cats
      });

    });
  },

  editCategoriesPostRoute: (req, res) => {
    const catId = req.params.id;
    const newTitle = req.body.name;

    if (newTitle) {
      Category.findById(catId).then(category => {

        category.title = newTitle;

        category.save().then(updated => {
          res.status(200).json({
            url: '/admin/category'
          });
        });

      });
    }
  },
  getComments: (req, res) => {
    Comment.find()
      .populate('user')
      .then(comments => {
        res.render('admin/comments/commentsIndex', {
          comments: comments
        });
      })
  },
  approveComments: (req, res, next) => {

  },
};