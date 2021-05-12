<template>
  <div class="home">
    <div class="home--notLogged row" v-if="!loggedIn">
      <div class="home--notLogged__logo">
        <img :src="logoVertical.src" :alt="logoVertical.alt" />
      </div>

      <h1>Bienvenue chez Groupomania, <router-link to="/login">connectez-vous</router-link> ou bien <router-link to="/signup">inscrivez-vous</router-link>!</h1>
    </div>

    <div class="home--loggedIn row" v-if="loggedIn">
      <section class="col-8">
        <div class="feed row">
          <div class="searchbar col-12">
            <input type="search" class="searchbar__bar form-control" id="searchbar" aria-label="Search topics" placeholder="Rechercher" />
            <button type="submit" class="searchbar__btn btn"><i class="fas fa-search"></i></button>
          </div>
          
          <h1 class="col-12">Fil d'actualité</h1>
          <Post
            v-for="post in posts"
            :key="post.id"
            :imageUrl="post.User.profilePicture"
            :firstName="post.User.firstName"
            :lastName="post.User.lastName"
            :topic="post.Topic.name"
            :content="post.content"
            :numberOfLikes="post.likes"
            :numberOfDislikes="post.dislikes"
            :numberOfComments="post.numberOfComments"
          />
        </div>
      </section>

      <aside class="aside col-4">

      </aside>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import Post from '../components/Post'

export default {
  name: 'Home',
  data() {
    return {
      posts: [],
    }
  },
  computed: {
    ...mapState(['logoVertical']),
    ...mapGetters(['loggedIn'])
  },
  async beforeCreate() {
    const response = await axios.get('/posts/?order=recent');
    console.log(response.data);
    this.posts = response.data;
  },
  components: {
    Post
  }
}
</script>

<style lang="scss">

.home {
  &--notLogged {
    width: 90%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &__logo {
      width: 50%;
      height: 500px;
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
  }
}

.searchbar {
  display: flex;
  &__bar {
    flex: 15;
  }
  &__btn {
    flex: 1;
  }
}

.feed {
  padding: inherit;
}
</style>