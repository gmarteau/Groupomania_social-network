const Sequelize = require('sequelize');
require('dotenv').config();
const UserModel = require('./models/User');
const TopicModel = require('./models/Topic');
const PostModel = require('./models/Post');
const CommentModel = require('./models/Comment');

const sequelize = new Sequelize('groupomania', process.env.USER, process.env.PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
});

async function testConnectionToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection réussie');
    } catch (error) {
        console.error('Connexion à la base de données impossible:', error);
    }
};

// testConnectionToDatabase();
// sequelize.close();

const User = UserModel(sequelize, Sequelize);
const Topic = TopicModel(sequelize, Sequelize);
const Post = PostModel(sequelize, Sequelize);
const Comment = CommentModel(sequelize, Sequelize);

User.hasMany(Topic);
Topic.belongsTo(User);
User.hasMany(Post, {
    onDelete: 'cascade'
});
Post.belongsTo(User);
User.hasMany(Comment, {
    onDelete: 'cascade'
});
Comment.belongsTo(User);

Topic.hasMany(Post, {
    onDelete: 'cascade'
});
Post.belongsTo(Topic);

Post.hasMany(Comment, {
    onDelete: 'cascade'
});
Comment.belongsTo(Post);

sequelize.sync()
    .then(() => console.log('Data synced'))
    .catch(error => console.log(error))
;

exports.user = User;
exports.topic = Topic;
exports.post = Post;
exports.comment = Comment;