const express = require("express");
const articleRouter = express.Router();

const articleController = require("../controllers/articleController");

const articleValidator = require("../validators/article.validator");

// articleRouter.post(
//   "/blog/create",
//   articleValidator,
//   articleController.createArticle
// );

articleRouter
  .route("/blog")
  .post(articleValidator, articleController.createArticle)
  .get(articleController.getBlogByOwner);

articleRouter.get("/blog/publish/:id", articleController.getPublishedArticle);
articleRouter
  .route("/blog/:id")
  .patch(articleController.updateById)
  .delete(articleController.deleteById);
articleRouter.patch("/blog/state/:id", articleController.updateStateById);
articleRouter.get("/blog/list", articleController.getBlogList);

module.exports = articleRouter;
