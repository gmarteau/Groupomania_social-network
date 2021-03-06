const express = require('express');
const helmet = require('helmet');
const xXssProtection = require('x-xss-protection');
const path = require('path');
const urlParamTopicId = require('./middleware/urlParamTopicId');
const urlParamPostId = require('./middleware/urlParamPostId');

const userRoutes = require('./routes/user');
const topicRoutes = require('./routes/topic');
const allPostsRoutes = require('./routes/allPosts');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());
app.use(helmet());
app.use(xXssProtection());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.param('topicId', urlParamTopicId);
app.param('postId', urlParamPostId);

app.use('/api/users', userRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/posts', allPostsRoutes);
app.use('/api/topics/:topicId/posts', postRoutes);
app.use('/api/topics/:topicId/posts/:postId/comments', commentRoutes);

module.exports = app;