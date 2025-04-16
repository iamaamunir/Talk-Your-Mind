export class Apifeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = Math.min(parseInt(this.queryString.limit) || 10, 100);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  search() {
    const searchQuery = {};
    if (this.queryString.author) {
      searchQuery.owner = {
        $regex: this.queryString.author,
        $options: "i",
      };
    }
    if (this.queryString.title) {
      searchQuery.title = {
        $regex: this.queryString.title,
        $options: "i",
      };
    }

    if (this.queryString.tags) {
      searchQuery.tags = {
        $regex: this.queryString.tags,
        $options: "i",
      };
    }

    if (Object.keys(searchQuery).length > 0) {
      this.query = this.query.find(searchQuery);
    }

    return this;
  }
}
