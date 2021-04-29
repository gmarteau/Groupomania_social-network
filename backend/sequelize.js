const Sequelize = require('sequelize');
require('dotenv').config();
const UserModel = require('./models/User');
const TopicModel = require('./models/Topic');
const PostModel = require('./models/Post');
const CommentModel = require('./models/Comment');

const sequelize = new Sequelize('groupomania', process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
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

sequelize.sync({ force: true })
    .then(() => console.log('Tables créées à l\'intérieur de la base de données'))
    .catch(error => console.log(error))
;

module.exports = User;
module.exports = Topic;
module.exports = Post;
module.exports = Comment;