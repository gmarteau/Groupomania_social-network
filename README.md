# P7 - Groupomania
Projet fullstack de réseau social d'entreprise.

## Démarrer le serveur


## API Guide


## DB Guide
User:  
  * id  
  `* PRIMARY_KEY`   
  `* AUTO_INCREMENT`  
  * username  
  `* UNIQUE`  
  `* NOT NULL`    
  * password  
  `* NOT NULL`    
  * email  
  `* UNIQUE`  
  `* NOT NULL`    
  * firstName  
  `* IND`     
  * lastName  
  `* IND`   
  * profilePicture  
  
Topic:  
  * id  
  `* PRIMARY_KEY`   
  `* AUTO_INCREMENT`  
  * name  
  `* UNIQUE`  
  `* IND`  
  `* NOT NULL`    
  * description  
  `* NOT NULL`    
  
Post:  
  * id  
  `* PRIMARY_KEY`   
  `* AUTO_INCREMENT`    
  * topic_id  
  `* FK(Topic.id)`    
  * creator_id  
  `* FK(User.id)`    
  * content  
  `* NOT NULL`   
  * likes  
  * dislikes  
  * hasLiked  
  `* []`    
  * hasDisliked  
  `* []`    
  * numberOfComments  
  
Comment:  
  * id     
  `* AUTO_INCREMENT`  
  * post_id  
  `* FK(Post.id)`    
  * user_id  
  `* FK(User.id)`    
  * content  
  `* NOT NULL`    
  * likes  
  * dislikes  
  * hasLiked  
  `* []`    
  * hasDisliked  
  `* []`    
  PRIMARY_KEY(id, post_id)  
