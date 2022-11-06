const articleModel = require("../models/articleModel");
const userModel = require("../models/userModel");

// 7. Logged in users should be able to create a blog.

const createArticle = async (req, res, next) => {
  try {
    const { title, description, tags, body } = req.body;

    //     13.Blogs created should have title, description, tags, author, timestamp, state,
    // read_count, reading_time and body.
    const user = await userModel.findById(req.user._id);
    const totalWordCount = body.split(" ").length;
    const time = totalWordCount / 200;
    const [min, sec] = time.toString().split(".");
    const roundedSec = Math.round(sec * 0.6);
    const reading_time = `${min}mins:${roundedSec}secs`;

    const articleObject = {
      title,
      description,
      tags,
      author: { _id: req.user._id },
      timestamp: Date.now(),
      reading_time,
      body,
    };

    const article = new articleModel(articleObject);

    const savedArticle = await article.save();
    user.article = user.article.concat(savedArticle._id);
    await user.save();

    return res
      .status(201)
      .json({ status: true, message: "Artcle created successfully" });
  } catch (err) {
    err.status = 404;
    err.message = "the error is from here";
    next(err);
  }
};

// 12.The owner of the blog should be able to get a list of their blogs.
// a. The endpoint should be paginated
// b. It should be filterable by state

async function getBlogByOwner(req, res) {
  try {
    if (req.query.limit || req.query.state) {
      const limit = parseInt(req.query.limit);
      const articles = await articleModel
        .find({ state: req.query.state, author: { _id: req.user._id } })
        .limit(limit)
        .populate("author", "first_name last_name");
      res.status(200).send(articles);
    } else {
      const articles = await articleModel
        .find({ author: { _id: req.user._id } })
        .populate("author", "first_name last_name");
      res.status(200).send(articles);
    }
  } catch (err) {
    err.status = 404;
    err.message = "the error is from here";
    next(err);
  }
}

// // 10. The owner of a blog should be able to edit the blog in draft or published state

async function updateById(req, res) {
  const id = req.params.id;

  const { body } = req.body;
  const article = await articleModel.findById(id);
  const totalWordCount = body.split(" ").length;
  const time = totalWordCount / 200;
  const [min, sec] = time.toString().split(".");
  const roundedSec = Math.round(sec * 0.6);
  const reading_time = `${min}mins:${roundedSec}secs`;
  if (!article) {
    return res
      .status(400)
      .json({ status: false, message: "Article cant be found" });
  }
  const owner = article.author.toString();

  if (owner === req.user._id) {
    article.body = body;
    article.reading_time = reading_time;
    await article.save();
    res.status(200).send(article);
  } else {
    res.status(403).send({ message: "Unauthorized" });
  }
}

// // 9. The owner of the blog should be able to update the state of the blog to published

async function updateStateById(req, res) {
  const id = req.params.id;
  const state = req.body.state;

  if (state == "published") {
    const article = await articleModel.findById(id);
    if (!article) {
      return res
        .status(500)
        .json({ status: false, message: "Article does not exist" });
    }
    const owner = article.author.toString();

    if (req.user._id === owner) {
      article.state = state;

      await article.save();
      res.status(200).send(article);
    } else {
      res.status(403).send({ message: "Unauthorized" });
    }
  } else {
    res.status(200).send("Blog has already been published");
  }
}
// 6. users should be able to to get a published blog

const getPublishedArticle = async (req, res) => {
  const id = req.params.id;
  const article = await articleModel.findById(id);
  const owner = article.author.toString();
  const user = req.user._id;
  if (article.state === "published" && owner === user) {
    try {
      article.read_count++;
      article.save();
      res.status(200).send(article);
    } catch (err) {
      res.status(404).send({ message: "Error trying to get an article" });
    }
  }
};
// // 11. The owner of the blog should be able to delete the blog in draft or published
// //  state
// // owner delete blog by id

async function deleteById(req, res, next) {
  try {
    const id = req.params.id;
    const article = await articleModel.findById(id);
if(!article){
  res.status(400).send({message:"Article does not exist"})
}
    const owner = article.author.toString();
    const user = await userModel.findById(req.user._id);
    if (owner === req.user._id) {
      await article.deleteOne();
      user.article = user.article.filter((post)=>post.toString()!==article._id.toString())
    await user.save();
      return res.status(200).send({message:"Article deleted successfully"});
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
  const article = await articleModel.find({});
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const title = req.query.title;
  const tags = req.query.tags;
  const read_count = req.query.read_count;
  const reading_time = req.query.reading_time;
  const timestamp = req.query.timestamp;
  const page = req.query.page;
  const limit = 20;
  if (read_count === "asc") {
    try {
      const result = await articleModel
        .find({ author: { _id: req.user._id } })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ read_count: 1 })
        .populate("author", "first_name last_name");

      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: "Unable to order by read_count" });
    }
  } else if (read_count === "desc") {
    try {
      const result = await articleModel
        .find({ author: { _id: req.user._id } })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ read_count: -1 })
        .populate("author", "first_name last_name");

      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: "Unable to order by read_count" });
    }
  }
  if (reading_time === "asc") {
    try {
      const result = await articleModel
        .find({ author: { _id: req.user._id } })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ reading_time: 1 })
        .populate("author", "first_name last_name");
      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: "Unable to order by reading_time" });
    }
  } else if (reading_time === "desc") {
    try {
      const result = await articleModel
        .find({ author: { _id: req.user._id } })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ reading_time: -1 })
        .populate("author", "first_name last_name");
      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: "Unable to order by reading_time" });
    }
  }
  if (timestamp === "asc") {
    try {
      const result = await articleModel
        .find({ author: { _id: req.user._id } })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ timestamp: 1 })
        .populate("author", "first_name last_name");
      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: "Unable to order by timestamp" });
    }
  } else if (timestamp === "desc") {
    try {
      const result = await articleModel
        .find({ state: "published" })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ timestamp: -1 })
        .populate("author", "first_name last_name");
      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: "Unable to order by timestamp" });
    }
  }
  // if(article.state == 'published'){

  if (firstname) {
    try {
      const user = await userModel.findOne({ first_name: firstname });

      const userId = user.article.toString().split(",");

      for (let i = 0; i < userId.length; i++) {
        if (userId[i] === "") {
          userId.splice(i, 1);
          i--;
        }
      }

      const articles = await articleModel
        .find({ _id: { $in: userId } })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("author", "first_name last_name");
      return res.status(200).send(articles);
    } catch (err) {
      return res.status(404).send({ message: "Unable to filter by name" });
    }
  }
  if (firstname) {
    try {
      const user = await userModel.findOne({ first_name: firstname });

      const userId = user.article.toString().split(",");

      for (let i = 0; i < userId.length; i++) {
        if (userId[i] === "") {
          userId.splice(i, 1);
          i--;
        }
      }

      const articles = await articleModel
        .find({ _id: { $in: userId } })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("author", "first_name last_name");
      return res.status(200).send(articles);
    } catch (err) {
      return res.status(404).send({ message: "Unable to filter by name" });
    }
  }
  if (lastname) {
    try {
      const user = await userModel.findOne({ last_name: lastname });

      const userId = user.article.toString().split(",");

      for (let i = 0; i < userId.length; i++) {
        if (userId[i] === "") {
          userId.splice(i, 1);
          i--;
        }
      }

      const articles = await articleModel
        .find({ _id: { $in: userId } })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("author", "first_name last_name");
      return res.status(200).send(articles);
    } catch (err) {
      return res.status(404).send({ message: "Unable to filter by name" });
    }
  }
  if (firstname && lastname) {
    try {
      const user = await userModel.findOne({
        first_name: firstname,
        last_name: lastname,
      });

      const userId = user.article.toString().split(",");

      for (let i = 0; i < userId.length; i++) {
        if (userId[i] === "") {
          userId.splice(i, 1);
          i--;
        }
      }

      const articles = await articleModel
        .find({ _id: { $in: userId } })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("author", "first_name last_name");
      return res.status(200).send(articles);
    } catch (err) {
      return res.status(404).send({ message: "Unable to filter by name" });
    }
  }

  if (title) {
    try {
      const result = await articleModel
        .find({ title: title, state: "published" })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("author", "first_name last_name");
      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: "Unable to filter by title" });
    }
  }
  if (tags) {
    try {
      const result = await articleModel
        .find({ tags: [tags], state: "published" })
        .limit(limit)
        .skip((page - 1) * limit)
        .populate("author", "first_name last_name");
      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ message: "Unable to filter by tags" });
    }
  }
}

module.exports = {
  createArticle,
  getBlogByOwner,
  getPublishedArticle,
  updateById,
  updateStateById,
  deleteById,
  getBlogList,
};
