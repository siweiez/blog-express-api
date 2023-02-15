const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

// add a new post
router.post("/", async (request, res) => {
  const newPost = new Post(request.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a post
router.put("/:id", async (request, res) => {
  try {
    const post = await Post.findById(request.params.id);
    if (post.username === request.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          request.params.id,
          {
            $set: request.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You have no permission");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post
router.delete("/:id", async (request, res) => {
  try {
    const post = await Post.findById(request.params.id);
    if (post.username === request.body.username) {
      try {
        await post.delete();
        res.status(200).json("Post is succesfully deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You have no permission");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a post
router.get("/:id", async (request, res) => {
  try {
    const post = await Post.findById(request.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get posts
router.get("/", async (request, res) => {
  const username = request.query.user;
  const category = request.query.category;
  const search = request.query.search;
  try {
    let posts;
    if (username) {
      // find posts by user
      posts = await Post.find({ username });
    } else if (category) {
      // find posts by category
      posts = await Post.find({
        categories: {
          $in: [{ name: category }]
        }
      });
    } else if (search) {
      // find posts by title or category
      posts = await Post.find(
        {
          $or: [
            {
              title: {
                $regex: new RegExp(search),
                $options: "i"
              }
            },
            {
              categories: {
                $in: [{ name: search }]
              }
            }
          ]
        });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;