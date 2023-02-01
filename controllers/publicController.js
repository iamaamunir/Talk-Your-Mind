// 6. Logged in and not logged in users should be able to to get a published blog
// and
// When a single blog is requested, the api should return the user information with
// the blog. The read_count of the blog too should be updated by 1

const Article = require("../models/articleModel");
const userModel = require("../models/userModel");
const apiFeatures = require("../utils/apiFeatures");

exports.getPublishedArticle = async (req, res, next) => {
  const id = req.params.id;
  const article = await Article.findById(id).populate(
    "author",
    "first_name last_name"
  );
  if (article.state === "published") {
    article.read_count++;
    await article.save();
    res.status(200).send(article);
  } else {
    res.send("Cant access");
  }
};

// 14.The list of blogs endpoint that can be accessed by both logged in and not logged
// in users should be paginated,
// a. default it to 20 blogs per page.
// b. It should also be searchable by author, title and tags.
// c. It should also be orderable by read_count, reading_time and timestamp

exports.getBlogList = async function (req, res, next) {
  const features = new apiFeatures(Article.find(), req.query).sort().paginate();
  const articles = await features.query;
  res.status(200).json({
    status: "success",
    results: articles.length,
    data: {
      articles,
    },
  });
};
// if(article.state == 'published'){

// if (firstname) {
//   try {
//     const user = await userModel.findOne({ first_name: firstname });

//     const userId = user.article.toString().split(",");

//     for (let i = 0; i < userId.length; i++) {
//       if (userId[i] === "") {
//         userId.splice(i, 1);
//         i--;
//       }
//     }

//     const articles = await articleModel
//       .find({ _id: { $in: userId } })
//       .limit(limit)
//       .skip((page - 1) * limit)
//       .populate("author", "first_name last_name");
//     return res.status(200).send(articles);
//   } catch (err) {
//     return res.status(404).send({ message: "Unable to filter by name" });
//   }
// }
// if (firstname) {
//   try {
//     const user = await userModel.findOne({ first_name: firstname });

//     const userId = user.article.toString().split(",");

//     for (let i = 0; i < userId.length; i++) {
//       if (userId[i] === "") {
//         userId.splice(i, 1);
//         i--;
//       }
//     }

//     const articles = await articleModel
//       .find({ _id: { $in: userId } })
//       .limit(limit)
//       .skip((page - 1) * limit)
//       .populate("author", "first_name last_name");
//     return res.status(200).send(articles);
//   } catch (err) {
//     return res.status(404).send({ message: "Unable to filter by name" });
//   }
// }
// if (lastname) {
//   try {
//     const user = await userModel.findOne({ last_name: lastname });

//     const userId = user.article.toString().split(",");

//     for (let i = 0; i < userId.length; i++) {
//       if (userId[i] === "") {
//         userId.splice(i, 1);
//         i--;
//       }
//     }

//     const articles = await articleModel
//       .find({ _id: { $in: userId } })
//       .limit(limit)
//       .skip((page - 1) * limit)
//       .populate("author", "first_name last_name");
//     return res.status(200).send(articles);
//   } catch (err) {
//     return res.status(404).send({ message: "Unable to filter by name" });
//   }
// }
// if (firstname && lastname) {
//   try {
//     const user = await userModel.findOne({
//       first_name: firstname,
//       last_name: lastname,
//     });

//     const userId = user.article.toString().split(",");

//     for (let i = 0; i < userId.length; i++) {
//       if (userId[i] === "") {
//         userId.splice(i, 1);
//         i--;
//       }
//     }

//     const articles = await articleModel
//       .find({ _id: { $in: userId } })
//       .limit(limit)
//       .skip((page - 1) * limit)
//       .populate("author", "first_name last_name");
//     return res.status(200).send(articles);
//   } catch (err) {
//     return res.status(404).send({ message: "Unable to filter by name" });
//   }
// }

// if (title) {
//   try {
//     const result = await articleModel
//       .find({ title: title, state: "published" })
//       .limit(limit)
//       .skip((page - 1) * limit)
//       .populate("author", "first_name last_name");
//     return res.status(200).send(result);
//   } catch (err) {
//     res.status(500).send({ message: "Unable to filter by title" });
//   }
// }
// if (tags) {
//   try {
//     const result = await articleModel
//       .find({ tags: [tags], state: "published" })
//       .limit(limit)
//       .skip((page - 1) * limit)
//       .populate("author", "first_name last_name");
//     return res.status(200).send(result);
//   } catch (err) {
//     res.status(500).send({ message: "Unable to filter by tags" });
//   }
// }

// 15.When a single blog is requested, the api should return the user information with
// the blog. The read_count of the blog too should be updated by 1
