const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
  isUserAuthenticated
} = require("../config/customFunctions");

router.all("/*", isUserAuthenticated, (req, res, next) => {
  req.app.locals.layout = "adminlayout";

  next();
});

router.route("/").get(adminController.index);

router.route("/posts").get(adminController.getPosts);

router
  .route("/post/create")
  .get(adminController.createPostGet)
  .post(adminController.submitPosts);

router.route("/posts/edit/:id").get(adminController.editPost).post(adminController.editPostSubmit);

router.route("/posts/delete/:id").delete(adminController.deletePost);


/* ADMIN CATEGORY ROUTES*/

router.route("/category").get(adminController.getCategories);

router.route("/category/create").post(adminController.createCategories);

router
  .route("/category/edit/:id")
  .get(adminController.editCategoriesGetRoute)
  .post(adminController.editCategoriesPostRoute);

/* ADMIN COMMENT ROUTES */
router.route('/comment')
  .get(adminController.getComments)
  .post(adminController.approveComments);

module.exports = router;