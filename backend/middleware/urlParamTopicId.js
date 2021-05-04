const seq = require('../sequelize');
const Topic = seq.topic;

module.exports = async (req, res, next, topicId) => {
    const topic = await Topic.findOne({
        where: {
            id: topicId
        }
    });
    if (!topic) {
        return res.status(400).json({ error: 'Aucun topic ne correspond à l\'id donné en URL' });
    } else {
        req.topic = topic;
        next();    
    }
};