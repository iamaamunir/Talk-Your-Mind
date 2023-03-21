const Article = require("../models/articleModel");
const User = require("../models/userModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// 7. Logged in users should be able to create a blog.

exports.createArticle = async (req, res, next) => {
  try {
    const { title, description, tags, body } = req.body;

    //     13.Blogs created should have title, description, tags, author, timestamp, state,
    // read_count, reading_time and body.
    const user = await User.findById(req.user._id);
    const totalWordCount = body.split(" ").length;
    const wordsPerMinute = totalWordCount / 200;
    const reading_time =
      Math.round(wordsPerMinute) === 0 ? 1 : Math.round(wordsPerMinute);
    const ownerFirstName = user.first_name;
    const ownerLastName = user.last_name;
    const owner = `${ownerFirstName} ${ownerLastName}`;
    const articleObject = {
      title,
      description,
      tags,
      author: { _id: req.user._id },
      reading_time,
      body,
      owner,
    };
    const article = new Article(articleObject);
    const savedArticle = await article.save();
    user.article = user.article.concat(savedArticle._id);
    await user.save();

    return res
      .status(201)
      .json({ status: true, message: "Artcle created successfully" });
  } catch (err) {
    err.status = 404;
    err.message = "the error is from here";
    console.log(err);
    next(err);
  }
};

// 12.The owner of the blog should be able to get a list of their blogs.
// a. The endpoint should be paginated
// b. It should be filterable by state

exports.getBlogByOwner = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Article.find({ author: { _id: req.user._id } }),
    req.query
  ).paginate();
  const posts = await features.query;
  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});

// // 10. The owner of a blog should be able to edit the blog in draft or published state

exports.updateById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const { body } = req.body;
  const article = await Article.findById(id);
  if (!article) {
    return next(new AppError("Can't access article", 404));
  }
  // const user = await User.findById(req.user._id);
  const totalWordCount = body.split(" ").length;
  const wordsPerMinute = totalWordCount / 200;
  const reading_time =
    Math.round(wordsPerMinute) === 0 ? 1 : Math.round(wordsPerMinute);
  const blogAuthor = article.author.toString();
  const currentUser = req.user._id;
  if (blogAuthor === currentUser) {
    article.body = body;
    article.reading_time = reading_time;
    await article.save();
    res.status(204).json({ message: "Update successfull" });
  }
});

// // 9. The owner of the blog should be able to update the state of the blog to published

exports.updateStateById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const state = req.body.state;
  const article = await Article.findById(id);
  if (!article) {
    return next(new AppError("Can't access article", 404));
  }
  const blogAuthor = article.author.toString();
  const currentUser = req.user._id;
  if (state === "published" && blogAuthor === currentUser) {
    article.state = state;
    await article.save();
    res.status(204).json({
      status: "success",
      message: "Update successful",
    });
  } else {
    return res.status(400).json({
      status: false,
      message: "Article already published or you are not authorized",
    });
  }
});

// 6. users should be able to to get a published blog

exports.getPublishedArticle = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const article = await Article.findById(id);
  if (!article) {
    return next(new AppError("Can't access article", 404));
  }
  const blogAuthor = article.author.toString();
  const currentUser = req.user._id;
  if (article.state === "published" && blogAuthor === currentUser) {
    article.read_count++;
    article.save();
    res.status(200).json({ status: "success", data: article });
  }
});
// // 11. The owner of the blog should be able to delete the blog in draft or published
// //  state
// // owner delete blog by id

exports.deleteById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const article = await Article.findById(id);
  if (!article) {
    return next(new AppError("Can't access article", 404));
  }

  const blogAuthor = article.author.toString();
  const user = await User.findById(req.user._id);
  const currentUser = req.user._id;
  if (blogAuthor === currentUser) {
    await article.deleteOne();
    // delete article id from user document
    user.article = user.article.filter(
      (post) => post.toString() !== article._id.toString()
    );
    await user.save();
    return res.status(200).send({ message: "Article deleted successfully" });
  }
});
// The list of blogs endpoint that can be accessed by both logged in and not logged
// in users should be paginated,
// a. default it to 20 blogs per page.
// b. It should also be searchable by author, title and tags.
// c. It should also be orderable by read_count, reading_time and timestamp
exports.getBlogList = catchAsync(async (req, res, next) => {
  // const article = await articleModel.find({});
  const features = new APIFeatures(Article.find(), req.query)
    // .sort()
    // .paginate()
    .search();
  const articles = await features.query;
  res.status(200).json({
    status: "success",
    results: articles.length,
    data: {
      articles,
    },
  });
});

// search published article by author

// exports.articleByAuthor = catchAsync(async (req, res, next)=>{
//   const author = req.query
//   const author = Article.
// })

// if(article.state == 'published'){

//   if (firstname) {
//     try {
//       const user = await User.findOne({ first_name: firstname });

//       const userId = user.article.toString().split(",");

//       for (let i = 0; i < userId.length; i++) {
//         if (userId[i] === "") {
//           userId.splice(i, 1);
//           i--;
//         }
//       }

//       const articles = await articleModel
//         .find({ _id: { $in: userId } })
//         .limit(limit)
//         .skip((page - 1) * limit)
//         .populate("author", "first_name last_name");
//       return res.status(200).send(articles);
//     } catch (err) {
//       return res.status(404).send({ message: "Unable to filter by name" });
//     }
//   }
//   if (firstname) {
//     try {
//       const user = await userModel.findOne({ first_name: firstname });

//       const userId = user.article.toString().split(",");

//       for (let i = 0; i < userId.length; i++) {
//         if (userId[i] === "") {
//           userId.splice(i, 1);
//           i--;
//         }
//       }

//       const articles = await articleModel
//         .find({ _id: { $in: userId } })
//         .limit(limit)
//         .skip((page - 1) * limit)
//         .populate("author", "first_name last_name");
//       return res.status(200).send(articles);
//     } catch (err) {
//       return res.status(404).send({ message: "Unable to filter by name" });
//     }
//   }
//   if (lastname) {
//     try {
//       const user = await userModel.findOne({ last_name: lastname });

//       const userId = user.article.toString().split(",");

//       for (let i = 0; i < userId.length; i++) {
//         if (userId[i] === "") {
//           userId.splice(i, 1);
//           i--;
//         }
//       }

//       const articles = await articleModel
//         .find({ _id: { $in: userId } })
//         .limit(limit)
//         .skip((page - 1) * limit)
//         .populate("author", "first_name last_name");
//       return res.status(200).send(articles);
//     } catch (err) {
//       return res.status(404).send({ message: "Unable to filter by name" });
//     }
//   }
//   if (firstname && lastname) {
//     try {
//       const user = await userModel.findOne({
//         first_name: firstname,
//         last_name: lastname,
//       });

//       const userId = user.article.toString().split(",");

//       for (let i = 0; i < userId.length; i++) {
//         if (userId[i] === "") {
//           userId.splice(i, 1);
//           i--;
//         }
//       }

//       const articles = await articleModel
//         .find({ _id: { $in: userId } })
//         .limit(limit)
//         .skip((page - 1) * limit)
//         .populate("author", "first_name last_name");
//       return res.status(200).send(articles);
//     } catch (err) {
//       return res.status(404).send({ message: "Unable to filter by name" });
//     }
//   }

//   if (title) {
//     try {
//       const result = await articleModel
//         .find({ title: title, state: "published" })
//         .limit(limit)
//         .skip((page - 1) * limit)
//         .populate("author", "first_name last_name");
//       return res.status(200).send(result);
//     } catch (err) {
//       res.status(500).send({ message: "Unable to filter by title" });
//     }
//   }
//   if (tags) {
//     try {
//       const result = await articleModel
//         .find({ tags: [tags], state: "published" })
//         .limit(limit)
//         .skip((page - 1) * limit)
//         .populate("author", "first_name last_name");
//       return res.status(200).send(result);
//     } catch (err) {
//       res.status(500).send({ message: "Unable to filter by tags" });
//     }
//   }
// }
