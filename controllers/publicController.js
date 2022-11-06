// 6. Logged in and not logged in users should be able to to get a published blog
// and
// When a single blog is requested, the api should return the user information with
// the blog. The read_count of the blog too should be updated by 1

const articleModel = require("../models/articleModel");
const userModel = require("../models/userModel");

const getPublishedArticle = async (req, res, next) => {
  const id = req.params.id;
  const article = await articleModel
    .findById(id)
    .populate("author", "first_name last_name");
  if (article.state === "published") {
    article.read_count++;
    await article.save();
    res.status(200).send( article );
  } else {
    res.send("Cant access");
  }
};

// 14.The list of blogs endpoint that can be accessed by both logged in and not logged
// in users should be paginated,
// a. default it to 20 blogs per page.
// b. It should also be searchable by author, title and tags.
// c. It should also be orderable by read_count, reading_time and timestamp

const getBlogList = async (req, res) => {
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
        .find({ state: "published" })
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
        .find({ state: "published" })
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
        .find({ state: "published" })
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
        .find({ state: "published" })
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
        .find({ state: "published" })
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
};

// 15.When a single blog is requested, the api should return the user information with
// the blog. The read_count of the blog too should be updated by 1

module.exports = { getPublishedArticle, getBlogList };
