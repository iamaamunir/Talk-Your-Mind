const Article = require("../models/articleModel");
const User = require("../models/userModel");
const APIFeatures = require("./../utils/apiFeatures");
// 7. Logged in users should be able to create a blog.

const createArticle = async (req, res, next) => {
  try {
    const { title, description, tags, body } = req.body;

    //     13.Blogs created should have title, description, tags, author, timestamp, state,
    // read_count, reading_time and body.
    const user = await User.findById(req.user._id);
    const totalWordCount = body.split(" ").length;
    const wordsPerMinute = totalWordCount / 200;
    const reading_time =
      Math.round(wordsPerMinute) === 0 ? 1 : Math.round(wordsPerMinute);

    const articleObject = {
      title,
      description,
      tags,
      author: { _id: req.user._id },
      reading_time,
      body,
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

async function getBlogByOwner(req, res, next) {
  try {
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
  } catch (err) {
    console.log(err);
    err.status = 404;
    err.message = "the error is from here";
    next(err);
  }
}

// // 10. The owner of a blog should be able to edit the blog in draft or published state

async function updateById(req, res, next) {
  try {
    const id = req.params.id;
    const { body } = req.body;
    const article = await Article.findById(id);
    if (!article) {
      return res
        .status(400)
        .json({ status: false, message: "Article cant be found" });
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
  } catch (err) {
    console.log(err);
    err.status = 404;
    err.message = "the error is from here";
    next(err);
  }
}

// // 9. The owner of the blog should be able to update the state of the blog to published

async function updateStateById(req, res, next) {
  try {
    const id = req.params.id;
    const state = req.body.state;
    const article = await Article.findById(id);
    if (!article) {
      return res
        .status(500)
        .json({ status: false, message: "Article does not exist" });
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
  } catch (err) {
    console.log(err);
    err.status = 404;
    err.message = "the error is from here";
    next(err);
  }
}

// 6. users should be able to to get a published blog

const getPublishedArticle = async (req, res) => {
  try {
    const id = req.params.id;
    const article = await articleModel.findById(id);
    const blogAuthor = article.author.toString();
    const currentUser = req.user._id;
    if (article.state === "published" && blogAuthor === currentUser) {
      article.read_count++;
      article.save();
      res.status(200).send(article);
    }
  } catch (err) {
    res.status(404).send({ message: "Error trying to get an article" });
  }
};
// // 11. The owner of the blog should be able to delete the blog in draft or published
// //  state
// // owner delete blog by id

async function deleteById(req, res, next) {
  try {
    const id = req.params.id;
    const article = await Article.findById(id);
    if (!article) {
      res.status(400).send({ message: "Article does not exist" });
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
  } catch (err) {
    err.status = 404;
    err.message = "the error is from here";
    next(err);
  }
}
// The list of blogs endpoint that can be accessed by both logged in and not logged
// in users should be paginated,
// a. default it to 20 blogs per page.
// b. It should also be searchable by author, title and tags.
// c. It should also be orderable by read_count, reading_time and timestamp
async function getBlogList(req, res) {
  // const article = await articleModel.find({});
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const title = req.query.title;
  const tags = req.query.tags;
  const read_count = req.query.read_count;
  const reading_time = req.query.reading_time;
  const timestamp = req.query.timestamp;
  const page = req.query.page;
  const limit = 20;
  const features = new APIFeatures(Article.find(), req.query)
    .sort()
    .paginate()

    .search();
  const tours = await features.query;
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
}
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

module.exports = {
  createArticle,
  getBlogByOwner,
  getPublishedArticle,
  updateById,
  updateStateById,
  deleteById,
  getBlogList,
};
