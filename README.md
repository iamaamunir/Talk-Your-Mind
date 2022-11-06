# Talk Your Mind

This is an api for a blogging app

---

## Requirements

1. Users should have a first_name, last_name, email, password, (you can add other
   attributes you want to store about the user)
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state

12.The owner of the blog should be able to get a list of their blogs.
    a. The endpoint should be paginated
    b. It should be filterable by state

13.Blogs created should have title, description, tags, author, timestamp, state,
    read_count, reading_time and body.
    
    14.The list of blogs endpoint that can be accessed by both logged in and not logged
    in users should be paginated,
    a. default it to 20 blogs per page.
    b. It should also be searchable by author, title and tags.
    c. It should also be orderable by read_count, reading_time and timestamp
    15.When a single blog is requested, the api should return the user information with
    the blog. The read_count of the blog too should be updated by 1
    16.Come up with any algorithm for calculating the reading_time of the blog.

---

## Setup

- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm run start:dev`

---

## Base URL

- somehostsite.com

## Models

---

### User

| field      | data_type | constraints           |
| ---------- | --------- | --------------------- |
| email      | string    | required, unique=true |
| password   | string    | required              |
| first_name | string    | required              |
| last_name  | string    | required              |
| article    | ObjectId  | optional              |

### Order

| field        | data_type | constraints      |
| ------------ | --------- | ---------------- |
| title        | string    | required, unique |
| description  | string    | optional         |
| author       | ObjectId  | optional         |
| state        | string    | default, enum    |
| read_count   | Number    | default          |
| reading_time | string    | optional         |
| body         | String    | required, unique |
| timestamp    | Date      | optional         |

## APIs

---

### Signup User

- Route: /api/signup
- Method: POST
- Body:

```
{
  "email": "user1@example.com",
  "password": "user1",
  "first_name": john",
  "last_name": "doe"
}
```

- Responses

Success

```


{
   "_id":"39129875839208"
  "email": "user1@example.com",
  "password": "user1",
  "first_name": john",
  "last_name": "doe"
}

```

---

### Login User

- Route: /api/login
- Method: POST
- Body:

```
{
  "password": "user1",
  "email": 'user1@example.com",
}
```

- Responses

Success

```
{
   
    "token": 'sjlkafjkldsfjsd'
}
```

---

### Create Article by Owner

- Route: /api/blog/create
- Method: POST
- Header
  - Authorization: Bearer {token}
- Body:

```

{
  "title": "blog title",
  "description": "some description about the blog",
  "tags": [
    "#blog"
  ],
  "body": "blog content"
}

```

- Responses

Success

```
{
  "status": true,
  "message": "Artcle created successfully"
}
```

---

### Get article by owner

- Route: /api/blog/me
- Method: GET
- Header
  - Authorization: Bearer {token}
- Responses

Success

```
[
    {
 "_id": "6363c14586e8598bc3bfeef7",
    "title": "blog title",
    "description": "some description about the blog",
    "author": {
      "_id": "636266fea10ebec99154bb55",
      "first_name": "john",
      "last_name": "doe"
    },
    "state": "draft",
    "read_count": 0,
    "reading_time": "0mins:00secs",
    "tags": [
      "#blog"
    ],
    "body": "blog content"
    }
]
```

---

### Get blog owner with id(published)

- Route: /api/blog/me/publish/:id
- Method: GET
- Header:
  - Authorization: Bearer {token}
- Query params:
  - id
 
- Responses

Success

```
{
    
    "article": {
    "_id": "6363cd9d7f752e876317a830",
    "title": "title",
    "description": "description",
    "author": {
      "_id": "636266fea10ebec99154bb55",
      "first_name": "john",
      "last_name": "doe"
    },
     "state": "published",
    "read_count": 4,
    "reading_time": "0mins:57secs",
    "tags": [
      "#nodejs"
    ],
    "body": "body content",
    "timestamp": "2022-11-03T14:18:05.747Z",
    
}
```

### Get update blog with id

- Route: /api/blog/me/edit/:id
- Method:PATCH
- Header:
  - Authorization: Bearer {token}
- Query params:
  - id
- Body:
  {
  
  "body": "edit body content"
} 
- Responses

Success

```
{
    
    "article": {
    "_id": "6363cd9d7f752e876317a830",
    "title": "title",
    "description": "description",
    "author": {
      "_id": "636266fea10ebec99154bb55",
      "first_name": "john",
      "last_name": "doe"
    },
     "state": "published",
    "read_count": 4,
    "reading_time": "0mins:57secs",
    "tags": [
      "#nodejs"
    ],
    "body": "body content",
    "timestamp": "2022-11-03T14:18:05.747Z",
    
}
```

### Get update state with id

- Route: /api/blog/me/edit/:id
- Method:PATCH
- Header:
  - Authorization: Bearer {token}
- Query params:
  - id
- Body:
  {
  
  "state": "published"
} 
- Responses

Success

```
{
    
    "article": {
    "_id": "6363cd9d7f752e876317a830",
    "title": "title",
    "description": "description",
    "author": {
      "_id": "636266fea10ebec99154bb55",
      "first_name": "john",
      "last_name": "doe"
    },
     "state": "published",
    "read_count": 4,
    "reading_time": "0mins:57secs",
    "tags": [
      "#nodejs"
    ],
    "body": "body content",
    "timestamp": "2022-11-03T14:18:05.747Z",
    
}
```
### Get published blog list with not logged in user

- Route: /api/blog/publish'
- Method:GET
- Header:
  - Authorization: Bearer {token}

- Query params:
  - id
  - firstname
  - lastname
  - timestamp
  - reading_time
  - read_count
 
- Responses

Success

```
[
    
    "article": {
    "_id": "6363cd9d7f752e876317a830",
    "title": "title",
    "description": "description",
    "author": {
      "_id": "636266fea10ebec99154bb55",
      "first_name": "john",
      "last_name": "doe"
    },
     "state": "published",
    "read_count": 4,
    "reading_time": "0mins:57secs",
    "tags": [
      "#nodejs"
    ],
    "body": "body content",
    "timestamp": "2022-11-03T14:18:05.747Z",
    
}
]

```

### delete blog with id

- Route: /api/blog/me/delete/:id
- Method:DELETE
- Header:
  - Authorization: Bearer {token}
- Query params:
  - id
 
- Responses

Success

```
{
  "message": "Article deleted successfully"
}
```

### Get published blog with not logged in user

- Route: /api/blog/publish/:id'
- Method:GET

- Query params:
  - id
 
- Responses

Success

```
[
    
    "article": {
    "_id": "6363cd9d7f752e876317a830",
    "title": "title",
    "description": "description",
    "author": {
      "_id": "636266fea10ebec99154bb55",
      "first_name": "john",
      "last_name": "doe"
    },
     "state": "published",
    "read_count": 4,
    "reading_time": "0mins:57secs",
    "tags": [
      "#nodejs"
    ],
    "body": "body content",
    "timestamp": "2022-11-03T14:18:05.747Z",
    
}
]

```

### Get published blog list with not logged in user

- Route: /api/blog/publish'
- Method:GET

- Query params:
  - id
  - firstname
  - lastname
  - timestamp
  - reading_time
  - read_count
 
- Responses

Success

```
[
    
    "article": {
    "_id": "6363cd9d7f752e876317a830",
    "title": "title",
    "description": "description",
    "author": {
      "_id": "636266fea10ebec99154bb55",
      "first_name": "john",
      "last_name": "doe"
    },
     "state": "published",
    "read_count": 4,
    "reading_time": "0mins:57secs",
    "tags": [
      "#nodejs"
    ],
    "body": "body content",
    "timestamp": "2022-11-03T14:18:05.747Z",
    
}
]

```

---

...

## Contributor

- Munir Adavize Abdullahi
