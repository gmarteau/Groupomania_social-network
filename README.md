# P7 - Groupomania
Projet fullstack de réseau social d'entreprise. 

## Démarrer le serveur

## API Guide
<details>

### User
* **POST** /users/signup  
Crée un nouvel utilisateur et l'ajoute à la table Users    
  
**req**: {  
  username: string,  
  password: string,  
  email: string,  
  firstName: string,  
  lastName: string,  
  bio: string  
}  
*exemple*: {  
  username: 'a.dupont',  
  password: '425SFHjs6/',  
  email: 'a.dupont@mail.com',  
  firstName: 'Alain',  
  lastName: 'Dupont',  
  bio: 'Moi c'est Alain, responsable de la manutention chez Groupomania!'  
}
  
**res**: **200 OK** {  
  message: 'Utilisateur créé'  
}  
*erreurs possibles*:  
`* 400 Bad Request: utilisateur déjà existant`  
`* 400 Bad Request: utilisation de caractères non autorisés`  
  
* **POST** /users/login  
Va chercher l'utilisateur dans la table Users, puis retourne un token de session  
  
**req**: {  
  username: string,  
  password: string  
}  
*exemple*: {  
  username: 'a.dupont' || 'a.dupont@mail.com',  
  password: '425SFHjs6/'  
}  
  
**res**: **200 OK** {  
  userId: number,  
  token: string  
}  
*erreurs possibles*:  
`* 401 Unauthorized: utilisateur inexistant`  
`* 401 Unauthorized: mot de passe erroné`  
  
* **GET** /users/:id  
Récupère les informations de l'utilisateur correspondant à l'id donné  
  
**req**: -  
  
**res**: **200 OK** {  
  id: number,  
  username: string,  
  firstName: string,  
  lastName: string,  
  bio: string,  
  profilePicture: string  
}  
*erreurs possibles*:  
`* 404 Not Found: aucun utilisateur ne correspondant à cet identifiant`  
   
* **PUT** /users/:id  
Met à jour les infos de l'utilisateur dans la table Users  
  
**req**: {  
  userId: number,  
  firstName: string,  
  lastName: string,  
  bio: string,  
  profilePicture: string  
}  
*exemple*: {  
  userId: 123,  
  firstName: 'Georges',  
  lastName: 'Durand',  
  bio: 'Je m'appelle Georges, je travaille dans le département RH.',  
  profilePicture: 'https://host.new-pic.jpeg'  
}  
  
**res**: **200 OK** {  
  message: 'Informations mises à jour'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
  
* **DELETE** /users/:id  
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
`* 401 Unauthorized: mot de passe erroné`  
  
### Topic
* **GET** /topics  
Récupère la liste de tous les objets Topic de la base de données  
  
**req**: -  
  
**res**: **200 OK** [  
  {topic1},  
  {topic2},  
  ...  
]   
  
* **GET** /topics/:id  
Récupère l'objet Topic correspondant à l'id passé en paramètre  
  
**req**: -  
  
**res**: **200 OK** {  
  id: number,  
  name: string,  
  description: string,  
  UserId: number,  
  User: Object    
}  
  
* **POST** /topics  
Crée un nouveau topic et l'ajoute à la table Topics  
  
**req**: {  
  userId: number,  
  name: string,  
  description: string  
}  
*exemple*: {  
  userId: 123,  
  name: 'Animaux',  
  description: 'Ce forum concerne les animaux'  
}  
  
**res**: **200 OK** {  
  message: 'Topic créé'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 400 Bad Request: un champ requis n'est pas rempli`  
  
* **DELETE** /topics/:id  
Supprime un topic de la base de données (possible seulement pour le créateur du topic)  
  
**req**: {  
  userId: number  
}  
*exemple*: {  
  userId: 123  
}  
  
**res**: **200 OK** {  
  message: 'Topic supprimé'  
}  
*erreurs possibles*:  
`* 401 Unauthorized: vous n'avez pas les droits nécessaires à la suppression de ce topic`  
  
### Post
* **POST** /topics/:topicId/posts  
Crée un nouveau post et l'ajoute à la table Posts  
  
**req**: {  
  userId: number,  
  topicId: number,  
  content: string  
}  
*exemple*: {  
  userId: 123,  
  topicId: 15,  
  content: "J'adore mon chien"  
}  
  
**res**: **200 OK** {  
  message: 'Post créé'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 400 Bad Request: un champ requis n'est pas rempli`  
  
* **GET** /topics/:topicId/posts  
Récupère la liste de tous les objets post (contenant toutes les infos nécessaires à l'affichage des posts) pour le topic donné  
  
**req**: -  
  
**res**: **200 OK** [  
  {post1},  
  {post2},  
  ...  
]  
  
* **GET** /topics/:topicId/posts/:id  
Retourne le post (avec les infos liées nécessaires au bon affichage du post récupérées d'autres tables) correspondant à l'id donné pour un topic donné  
  
**req**: -  
  
**res**: **200 OK** {  
  id: number,  
  date_publication: string,  
  content: string,  
  likes: number,  
  dislikes: number,  
  hasLiked: array,  
  hasDisliked: array,  
  numberOfComments: number,   
  UserId: number,  
  TopicId: number,  
  User: Object,  
  Topic: Object  
}  
*erreurs possibles*:  
`* 404 Not Found: la ressource demandée n'existe pas`  
    
* **PUT** /topics/:topicId/posts/:id  
Met à jour le post donné dans la base de données (possible seulement pour le créateur du post)  
  
**req**: {  
  userId: number,  
  content: string  
}  
*exemple*: {  
  userId: 123,  
  content: "J'adore vraiment mon chien"  
}  
  
**res**: **200 OK** {  
  message: 'Post mis à jour'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 401 Unauthorized: vous n'avez pas l'autorisation requise pour effectuer cette opération`  
  
* **DELETE** /topics/:topicId/posts/:id  
Supprime le post de la base de données (possible seulement pour le créateur du post)  
  
**req**: {  
  userId: number,  
}  
*exemple*: {  
  userId: 123  
}  
  
**res**: **200 OK** {  
  message: 'Post supprimé'  
}
*erreurs possibles*:  
`* 404 Not Found: la ressource demandée n'existe pas`  
`* 401 Unauthorized: vous n'avez pas l'autorisation requise pour effectuer cette opération`  
  
* **POST** /topics/:topicId/posts/:id/like  
Met à jour les informations concernant les likes du post donné dans la base de données  
*Le paramètre like prend 3 valeurs possibles: -1 (dislike), 0 (neutre), 1 (like)*  
  
**req**: {  
  userId: number,  
  like: number  
}  
*exemple*: {  
  userId: 175,  
  like: 1  
}  
  
**res**: **200 OK** {  
  message: 'Post mis à jour avec la nouvelle réaction'  
}  
  
### Comment
* **POST** /topics/:topicId/posts/:postId/comments  
Crée un nouveau commentaire pour le post et l'ajoute à la table Comments  
  
**req**: {  
  userId: number,  
  content: string  
}  
*exemple*: {  
  userId: 175,  
  content: "Comment s'appelle ton chien?"  
}  
  
**res**: **200 OK** {  
  message: 'Commentaire créé'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 400 Bad Request: un champ requis n'est pas rempli`  
  
* **GET** /topics/:topicId/posts/:postId/comments  
Récupère la liste de tous les objets comment pour le post donné  
  
**req**: -  
  
**res**: **200 OK** [  
  {comment1},  
  {comment2},  
  ...  
]  
  
* **GET** /topics/:topicId/posts/:postId/comments/:id  
Retourne le commentaire correspondant à l'id donné pour un post donné  
  
**req**: -  
  
**res**: **200 OK** {  
  id: number,  
  date_publication: string,  
  content: string,  
  likes: number,  
  dislikes: number,  
  hasLiked: array,  
  hasDisliked: array,  
  UserId: number,  
  PostId: number,  
  User: Object,  
  Post: Object,  
}  
*erreurs possibles*:  
`* 404 Not Found: la ressource demandée n'existe pas`  
    
* **PUT** /topics/:topicId/posts/:postId/comments/:id    
Met à jour le commentaire donné dans la base de données (possible seulement pour le créateur du commentaire)  
  
**req**: {  
  userId: number,  
  content: string  
}  
*exemple*: {  
  userId: 175,  
  content: "Comment s'appelle ce joli chien?"  
}  
  
**res**: **200 OK** {  
  message: 'Commentaire mis à jour'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 401 Unauthorized: vous n'avez pas l'autorisation requise pour effectuer cette opération`  
  
* **DELETE** /topics/:topicId/posts/:postId/comments/:id   
Supprime le commentaire de la base de données (possible seulement pour le créateur du post)  
  
**req**: {  
  userId: number,  
}  
*exemple*: {  
  userId: 175  
}  
  
**res**: **200 OK** {  
  message: 'Commentaire supprimé'  
}
*erreurs possibles*:  
`* 404 Not Found: la ressource demandée n'existe pas`  
`* 401 Unauthorized: vous n'avez pas l'autorisation requise pour effectuer cette opération`  
  
* **POST** /topics/:topicId/posts/:postId/comments/:id/like    
Met à jour les informations concernant les likes du commentaire donné dans la base de données  
*Le paramètre like prend 3 valeurs possibles: -1 (dislike), 0 (neutre), 1 (like)*  
  
**req**: {  
  userId: number,  
  like: number  
}  
*exemple*: {  
  userId: 250,  
  like: 1  
}  
  
**res**: **200 OK** {  
  message: 'Commentaire mis à jour avec la nouvelle réaction'  
}  
  
</details>

## DB Guide
<details>

### User  
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
  `* NOT NULL`  
  * lastName  
  `* NOT NULL`  
  * bio  
  * profilePicture  
  INDEX(firstName, lastName)  
  
### Topic  
  * id  
  `* PRIMARY_KEY`   
  `* AUTO_INCREMENT`  
  * name  
  `* UNIQUE`  
  `* IND`  
  `* NOT NULL`    
  * description  
  `* NOT NULL`    
  * UserId  
  `* FK(User.id)`  
  
### Post
  * id  
  `* PRIMARY_KEY`   
  `* AUTO_INCREMENT`    
  * datePublication  
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
  * TopicId  
  `* FK(Topic.id)`    
  * UserId  
  `* FK(User.id)`  
  INDEX(likes, numberOfComments)  
  
### Comment
  * id     
  `* PRIMARY_KEY`   
  `* AUTO_INCREMENT`  
  * datePublication  
  `* NOT NULL`      
  * content  
  `* NOT NULL`    
  * likes  
  * dislikes  
  * hasLiked  
  `* []`    
  * hasDisliked  
  `* []`   
  * PostId  
  `* FK(Post.id)`    
  * UserId  
  `* FK(User.id)`   
  
</details>