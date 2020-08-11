const Post = require("../model/PostModel");
const Category = require("../model/CategoryModel");
const User = require("../model/UserModel");
const Comment = require("../model/CommentModel");
const bcrypt = require("bcryptjs");

module.exports = {
    index: (req, res, next) => {
        Post.find({}, function (err, posts) {
            Category.find({}, function (err, categories) {
                res.render("layouts/default", {
                    posts: posts,
                    categories: categories,
                });
            });
        });
    },

    loginGet: (req, res) => {
        res.render("default/login");
    },

    loginPost: (req, res) => {
        res.send("YOU HAV SUCCESSFULLY Logged in");
    },

    registerGet: (req, res) => {
        res.render("default/register");
    },

    registerPost: (req, res) => {
        User.findOne({
                email: req.body.email,
            },
            function (err, user) {
                if (user) {
                    console.log("User exists");
                } else {
                    const newuser = new User();

                    newuser.firstName = req.body.firstName;
                    newuser.lastName = req.body.lastName;
                    newuser.email = req.body.email;
                    newuser.password = req.body.password;

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newuser.password, salt, function (err, hash) {
                            newuser.password = hash;

                            newuser.save(function (err) {
                                if (err) console.log(err);
                                else {
                                    res.redirect("/login");
                                }
                            });
                        });
                    });
                }
            }
        );
    },
    singlePost: (req, res, next) => {
        const id = req.params.id;

        Post.findById(id, function (err, post) {
            if (!post) {
                res.status(404).json({
                    message: "No post Found"
                })
            } else {
                console.log(post.comments)
                res.render("default/single-page", {
                    post: post,
                    comments: post.comments
                })
            }
        })
    },
    submitComment: (req, res) => {
        if (req.user) {
            Post.findById(req.body.id).then(post => {
                const newComment = new Comment();

                newComment.user = req.user.id;
                newComment.body = req.body.comment_body;
                // newComment.user = req.user.id;
                // newComment.user = req.user.id;
                // newComment.user = req.user.id;

                post.comments.push(newComment);

                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                        res.redirect(`/post/${post._id}`)
                    });
                })

            })
        } else {
            req.flash('error-message', 'Login first to comment');
            res.redirect('/login');
        }
    }
};