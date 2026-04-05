const router = require('express').Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a post
router.post('/', auth, async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, userId: req.user.id });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
    } else {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ userId: req.user.id, text: req.body.text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;