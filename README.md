# P7 - Groupomania
Projet fullstack de réseau social d'entreprise. 

## Démarrer le serveur


## API Guide
### User
* **POST** /user/signup  
Crée un nouvel utilisateur et l'ajoute à la table User  
  
**req**: {  
  username: string,  
  password: string,  
  email: string,  
  firstName: string,  
  lastName: string  
}  
*exemple*: {  
  username: 'a.dupont',  
  password: '425SFHjs6/',  
  email: 'a.dupont@mail.com',  
  firstName: 'Alain',  
  lastName: 'Dupont'  
}
  
**res**: **200 OK** {  
  message: 'Utilisateur créé'  
}  
*erreurs possibles*:  
`* 400 Bad Request: utilisateur déjà existant`  
`* 400 Bad Request: utilisation de caractères non autorisés`  
  
* **POST** /user/login  
Va chercher l'utilisateur dans la table User, puis retourne un token de session  
  
**req**: {  
  username || email: string,  
  password: string  
}  
*exemple*: {  
  username: 'a.dupont' || email: 'a.dupont@mail.com',  
  password: '425SFHjs6/'  
}  
  
**res**: **200 OK** {  
  userId: number,  
  token: string  
}  
*erreurs possibles*:  
`* 400 Bad Request: utilisateur inexistant`  
`* 400 Bad Request: mot de passe erroné`  
  
* **PUT** /user/:id  
Met à jour les infos de l'utilisateur dans la table User  
  
**req**: {  
  email: string,  
  firstName: string,  
  lastName: string,  
  profilePicture: string  
}  
*exemple*: {  
  email: 'new.mail@mail.com',  
  firstName: 'Georges',  
  lastName: 'Durand',  
  profilePicture: 'https://host.new-pic.jpeg'  
}  
  
**res**: **200 OK** {  
  message: 'Informations mises à jour'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
  
* **DELETE** /user/delete  
Supprime l'utilisateur de la base de données  
  
**req**: {  
  userId: number,  
  password: string  
}  
*exemple*: {  
  userId: 123,  
  password: '425SFHjs6/'  
}  
  
**res**: **200 OK** {  
  message: 'Utilisateur supprimé'  
}  
*erreurs possibles*:  
`* 400 Bad Request: mot de passe erroné`  
  
### Topic
* **POST** /topic  
Crée un nouveau topic et l'ajoute à la table Topic  
  
**req**: {  
  name: string,  
  description: string  
}  
*exemple*: {  
  name: 'Animaux',  
  description: 'Ce forum concerne les animaux'  
}  
  
**res**: **200 OK** {  
  message: 'Topic créé'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 400 Bad Request: un champ requis n'est pas rempli`  
  
* **DELETE** /topic/:id  
Supprime un topic de la base de données (possible seulement pour le créateur du topic)  
  
**req**: {  
  id: number,  
  userId: number  
}  
*exemple*: {  
  id: 15,  
  userId: 123  
}  
  
**res**: **200 OK** {  
  message: 'Topic supprimé'  
}  
  
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
  * user_id  
  `* FK(User.id)`  
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
  * user_id  
  `* FK(User.id)`  
  * date_publication  
  `* NOT NULL`    
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
    * date_publication  
  `* NOT NULL`      
  * content  
  `* NOT NULL`    
  * likes  
  * dislikes  
  * hasLiked  
  `* []`    
  * hasDisliked  
  `* []`    
  PRIMARY_KEY(id, post_id)  
