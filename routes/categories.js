const router = require("express").Router();
const Category = require("../models/Category");

// add a new category
router.post("/", async (request, res) => {
  const newCategory = new Category(request.body);
  try {
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get categories
router.get("/", async (request, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;