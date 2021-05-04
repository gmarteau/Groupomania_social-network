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
  first_name: string,  
  last_name: string,  
  bio: string  
}  
*exemple*: {  
  username: 'a.dupont',  
  password: '425SFHjs6/',  
  email: 'a.dupont@mail.com',  
  first_name: 'Alain',  
  last_name: 'Dupont',  
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
  user_id: number,  
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
  first_name: string,  
  last_name: string,  
  bio: string,  
  profile_picture: string  
}  
*erreurs possibles*:  
`* 404 Not Found: aucun utilisateur ne correspondant à cet identifiant`  
   
* **PUT** /users/:id  
Met à jour les infos de l'utilisateur dans la table Users  
  
**req**: {  
  user_id: number,  
  first_name: string,  
  last_name: string,  
  bio: string,  
  profile_picture: string  
}  
*exemple*: {  
  user_id: 123,  
  first_name: 'Georges',  
  last_name: 'Durand',  
  bio: 'Je m'appelle Georges, je travaille dans le département RH.',  
  profile_picture: 'https://host.new-pic.jpeg'  
}  
  
**res**: **200 OK** {  
  message: 'Informations mises à jour'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
  
* **DELETE** /users/:id  
Supprime l'utilisateur de la base de données  
  
**req**: {  
  user_id: number,  
  password: string  
}  
*exemple*: {  
  user_id: 123,  
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
  author_id: number,  
  name: string,  
  description: string  
}  
  
* **POST** /topics  
Crée un nouveau topic et l'ajoute à la table Topics  
  
**req**: {  
  author_id: number,  
  name: string,  
  description: string  
}  
*exemple*: {  
  author_id: 123,  
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
  id: number,  
  user_id: number  
}  
*exemple*: {  
  id: 15,  
  user_id: 123  
}  
  
**res**: **200 OK** {  
  message: 'Topic supprimé'  
}  
*erreurs possibles*:  
`* 401 Unauthorized: vous n'avez pas les droits nécessaires à la suppression de ce topic`  
  
### Post
* **POST** /topics/:id/posts  
Crée un nouveau post et l'ajoute à la table Posts  
  
**req**: {  
  author_id: number,  
  topic_id: number,  
  content: string  
}  
*exemple*: {  
  author_id: 123,  
  topic_id: 15,  
  content: "J'adore mon chien"  
}  
  
**res**: **200 OK** {  
  message: 'Post créé'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 400 Bad Request: un champ requis n'est pas rempli`  
  
* **GET** /topics/:id/posts  
Récupère la liste de tous les objets post (contenant toutes les infos nécessaires à l'affichage des posts) pour le topic donné  
  
**req**: -  
  
**res**: **200 OK** [  
  {post1},  
  {post2},  
  ...  
]  
  
* **GET** /topics/:id/posts/:id  
Retourne le post (avec les infos liées nécessaires au bon affichage du post récupérées d'autres tables) correspondant à l'id donné pour un topic donné  
  
**req**: -  
  
**res**: **200 OK** {  
  id: number,  
  topic_id: number,  
  author_id: number,  
  author_username: string,  
  author_firstName: string,  
  author_lastName: string,  
  date_publication: string,  
  content: string,  
  likes: number,  
  dislikes: number,  
  has_liked: array,  
  has_disliked: array,  
  number_of_comments: number  
}  
*erreurs possibles*:  
`* 404 Not Found: la ressource demandée n'existe pas`  
    
* **PUT** /topics/:id/posts/:id  
Met à jour le post donné dans la base de données (possible seulement pour le créateur du post)  
  
**req**: {  
  id: number,  
  topic_id: number,  
  user_id: number,  
  content: string  
}  
*exemple*: {  
  id: 456,  
  topic_id: 15,  
  user_id: 123,  
  content: "J'adore vraiment mon chien"  
}  
  
**res**: **200 OK** {  
  message: 'Post mis à jour'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 401 Unauthorized: vous n'avez pas l'autorisation requise pour effectuer cette opération`  
  
* **DELETE** /topics/:id/posts/:id  
Supprime le post de la base de données (possible seulement pour le créateur du post)  
  
**req**: {  
  id: number,  
  topic_id: number,  
  user_id: number,  
}  
*exemple*: {  
  id: 456,  
  topic_id: 15,  
  user_id: 123  
}  
  
**res**: **200 OK** {  
  message: 'Post supprimé'  
}
*erreurs possibles*:  
`* 404 Not Found: la ressource demandée n'existe pas`  
`* 401 Unauthorized: vous n'avez pas l'autorisation requise pour effectuer cette opération`  
  
* **POST** /topics/:id/posts/:id/like  
Met à jour les informations concernant les likes du post donné dans la base de données  
*Le paramètre like prend 3 valeurs possibles: -1 (dislike), 0 (neutre), 1 (like)*  
  
**req**: {  
  id: number,  
  topic_id: number,  
  user_id: number,  
  like: number  
}  
*exemple*: {  
  id: 456,  
  topic_id: 15,  
  user_id: 175,  
  like: 1  
}  
  
**res**: **200 OK** {  
  message: 'Post mis à jour avec la nouvelle réaction'  
}  
  
### Comment
* **POST** /topics/:id/posts/:id/comments  
Crée un nouveau commentaire pour le post et l'ajoute à la table Comments  
  
**req**: {  
  author_id: number,  
  post_id: number,  
  content: string  
}  
*exemple*: {  
  author_id: 175,  
  post_id: 456,  
  content: "Comment s'appelle ton chien?"  
}  
  
**res**: **200 OK** {  
  message: 'Commentaire créé'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 400 Bad Request: un champ requis n'est pas rempli`  
  
* **GET** /topics/:id/posts/:id/comments  
Récupère la liste de tous les objets comment pour le post donné  
  
**req**: -  
  
**res**: **200 OK** [  
  {comment1},  
  {comment2},  
  ...  
]  
  
* **GET** /topics/:id/posts/:id/comments/:id  
Retourne le commentaire correspondant à l'id donné pour un post donné  
  
**req**: -  
  
**res**: **200 OK** {  
  id: number,  
  post_id: number,  
  author_id: number,  
  author_username: string,  
  author_firstName: string,  
  author_lastName: string,  
  date_publication: string,  
  content: string,  
  likes: number,  
  dislikes: number,  
  has_liked: array,  
  has_disliked: array,  
}  
*erreurs possibles*:  
`* 404 Not Found: la ressource demandée n'existe pas`  
    
* **PUT** /topics/:id/posts/:id/comments/:id    
Met à jour le commentaire donné dans la base de données (possible seulement pour le créateur du commentaire)  
  
**req**: {  
  id: number,  
  post_id: number,  
  user_id: number,  
  content: string  
}  
*exemple*: {  
  id: 3,  
  post_id: 456,  
  user_id: 175,  
  content: "Comment s'appelle ce joli chien?"  
}  
  
**res**: **200 OK** {  
  message: 'Commentaire mis à jour'  
}  
*erreurs possibles*:  
`* 400 Bad Request: un champ contient des caractères non autorisés`  
`* 401 Unauthorized: vous n'avez pas l'autorisation requise pour effectuer cette opération`  
  
* **DELETE** /topics/:id/posts/:id/comments/:id   
Supprime le commentaire de la base de données (possible seulement pour le créateur du post)  
  
**req**: {  
  id: number,  
  post_id: number,  
  user_id: number,  
}  
*exemple*: {  
  id: 3,  
  post_id: 456,  
  user_id: 175  
}  
  
**res**: **200 OK** {  
  message: 'Commentaire supprimé'  
}
*erreurs possibles*:  
`* 404 Not Found: la ressource demandée n'existe pas`  
`* 401 Unauthorized: vous n'avez pas l'autorisation requise pour effectuer cette opération`  
  
* **POST** /topics/:id/posts/:id/comments/:id/like    
Met à jour les informations concernant les likes du commentaire donné dans la base de données  
*Le paramètre like prend 3 valeurs possibles: -1 (dislike), 0 (neutre), 1 (like)*  
  
**req**: {  
  id: number,  
  post_id: number,  
  user_id: number,  
  like: number  
}  
*exemple*: {  
  id: 3,  
  post_id: 456,  
  user_id: 250,  
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
  * first_name  
  `* NOT NULL`  
  * last_name  
  `* NOT NULL`  
  * bio  
  * profilePicture  
  INDEX(first_name, last_name)  
  
### Topic  
  * id  
  `* PRIMARY_KEY`   
  `* AUTO_INCREMENT`  
  * author_id  
  `* FK(User.id)`  
  * name  
  `* UNIQUE`  
  `* IND`  
  `* NOT NULL`    
  * description  
  `* NOT NULL`    
  
### Post
  * id  
  `* PRIMARY_KEY`   
  `* AUTO_INCREMENT`    
  * topic_id  
  `* FK(Topic.id)`    
  * author_id  
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
  * number_of_comments  
  INDEX(topic_id, id)  
  INDEX(likes, number_of_comments)  
  
### Comment
  * id     
  `* PRIMARY_KEY`   
  `* AUTO_INCREMENT`  
  * post_id  
  `* FK(Post.id)`    
  * author_id  
  `* FK(User.id)`  
  * date_publication  
  `* NOT NULL`      
  * content  
  `* NOT NULL`    
  * likes  
  * dislikes  
  * has_liked  
  `* []`    
  * has_disliked  
  `* []`    
  INDEX(post_id, id)  
  
</details>