# P7 - Groupomania
Projet fullstack de réseau social d'entreprise. 

## Démarrer le serveur


## API Guide
### User
* POST /user/signup  
_req_: {  
  username: string,  
  password: string,  
  email: string,  
  firstName: string,  
  lastName: string  
}  
exemple: {  
  username: a.dupont,  
  password: 425SFHjs6/,  
  email: a.dupont@mail.com,  
  firstName: Alain,  
  lastName: Dupont  
}
  
_res_: _200 OK_ {  
  message: 'Utilisateur créé'  
}  
erreurs possibles:  
`* 400 Bad Request: utilisateur déjà existant`  
`* 400 Bad Request: utilisation de caractères non autorisés`  
  
* POST /user/login  
_req_: {  
  username || email: string,  
  password: string  
}  
exemple: {  
  username: a.dupont || email: a.dupont@mail.com,  
  password: 425SFHjs6/  
}  
  
_res_: _200 OK_ {  
  token: string  
}  
erreurs possibles:  
`* 400 Bad Request: utilisateur inexistant`  
`* 400 Bad Request: mot de passe erroné`  

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
  `* NOT NULL`  
  * lastName  
  `* IND`   
  `* NOT NULL`  
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
