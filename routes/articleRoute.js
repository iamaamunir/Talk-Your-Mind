const express = require('express')
const articleRouter = express.Router()

const articleController = require('../controllers/articleController')


articleRouter.post('/blog/create', articleController.createArticle)


articleRouter.get('/blog/me/get',  articleController.getBlogByOwner)

articleRouter.get('/blog/me/publish/:id', articleController.getPublishedArticle)
articleRouter.patch('/blog/me/edit/:id', articleController.updateById)
articleRouter.patch('/blog/me/edit/state/:id', articleController.updateStateById)
articleRouter.delete('/blog/me/delete/:id', articleController.deleteById)
articleRouter.get('/blog/me/list' , articleController.getBlogList)

module.exports = articleRouter