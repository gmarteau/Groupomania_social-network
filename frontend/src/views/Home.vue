<template>
  <div class="home">
    <div class="home--notLogged row" v-if="!loggedIn">
      <div class="home--notLogged__logo">
        <img :src="logoVertical.src" :alt="logoVertical.alt" />
      </div>

      <h1>Bienvenue chez Groupomania, <router-link to="/login">connectez-vous</router-link> ou bien <router-link to="/signup">inscrivez-vous</router-link>!</h1>
    </div>

    <div class="home--loggedIn row" v-if="loggedIn">
      <section class="col-9 pr-5">
        <div class="feed row">
          <!-- <div class="searchbar col-12 mb-3">
            <input type="search" class="searchbar__bar form-control" id="searchbar" aria-label="Search topics" placeholder="Rechercher" v-model="search" />
            <button type="submit" class="searchbar__btn btn" @click="makeResearch"><i class="fas fa-search fa-lg"></i></button>
          </div> -->
          
          <h1 class="col-12 mb-4">Fil d'actualité</h1>
          <Post
            v-for="post in posts"
            :key="post.id"
            :id="post.id"
            :authorId="post.UserId"
            :imageUrl="post.User.profilePicture"
            :firstName="post.User.firstName"
            :lastName="post.User.lastName"
            :username="post.User.username"
            :topic="post.Topic.name"
            :topicId="post.TopicId"
            :content="post.content"
            :numberOfLikes="post.likes"
            :numberOfDislikes="post.dislikes"
            :numberOfComments="post.numberOfComments"
            @post-deleted="refreshPosts"
          />
        </div>
      </section>

      <aside class="aside col-3">
        <div class="aside__header mb-3">
          <h2 class="aside__header__title mr-3">Topics</h2>
          <router-link to="/newtopic" class="aside__header__newTopic btn px-3 py-1"><i class="fas fa-plus mr-1"></i> Créer un topic</router-link>
        </div>

        <div class="searchbar mb-4">
            <input type="search" class="searchbar__bar form-control" id="searchbar" aria-label="Search topics" placeholder="Rechercher" v-model="search" />
            <button type="submit" class="searchbar__btn btn" @click="makeResearch"><i class="fas fa-search fa-lg"></i></button>
        </div>

        <TopicsList listName="popular" />
        <TopicsList listName="recent" />
        <TopicsList listName="followed" />
      </aside>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import Post from '../components/Post'
import TopicsList from '../components/TopicsList'

export default {
  name: 'Home',
  data() {
    return {
      posts: [],
      popularTopics: [],
      recentTopics: [],
      followedTopics: [],
      search: ''
    }
  },
  computed: {
    ...mapState(['logoVertical']),
    ...mapGetters(['loggedIn'])
  },
  methods: {
    makeResearch() {
      this.$router.push({ path: '/topics', query: { name: this.search } });
    },
    async refreshPosts() {
      const response = await axios.get('/posts/?order=recent');
      this.posts = response.data;
    }
  },
  async beforeMount() {
    if (this.loggedIn) {
      const response = await axios.get('/posts/?order=recent');
      this.posts = response.data;
    }
  },
  components: {
    Post,
    TopicsList
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
    flex: 5;
  }
  &__btn {
    flex: 1;
    color: #fff;
    background-color: #FD3C13;
    &:hover {
      background-color: #FFD7D7;
      color: #FD3C13;
    }
  }
}

.feed {
  padding: inherit;
}

.aside {
  &__header {
    display: flex;
    align-items: center;
    &__newTopic {
      height: min-content;
      background-color: #FD3C13;
      color: #fff;
      font-weight: bold;
      &:hover {
        background-color: #FFD7D7;
        color: #FD3C13;
      }
    }
  }
}
</style>