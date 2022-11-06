
const express = require('express')
const publicRouter = express.Router()

const publicController= require('../controllers/publicController')

publicRouter.get('/blog/publish/:id', publicController.getPublishedArticle)

publicRouter.get('/blog/list', publicController.getBlogList)


module.exports = publicRouter


