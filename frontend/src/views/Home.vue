<template>
  <div class="home">
    <div class="home--notLogged row" v-if="!loggedIn">
      <div class="home--notLogged__logo">
        <img :src="logoVertical.src" :alt="logoVertical.alt" />
      </div>

      <h1 class="h3 text-center pt-md-5 pt-lg-0">Bienvenue chez Groupomania, <router-link to="/login" class="home--notLogged__link">connectez-vous</router-link> ou bien <router-link to="/signup" class="home--notLogged__link">inscrivez-vous</router-link>!</h1>
    </div>

    <div class="home--loggedIn row" v-if="loggedIn">
      <section class="home--loggedIn__feed col-12 col-lg-9 mt-1 mt-lg-0 pr-lg-5">
        <div class="feed row">          
          <h1 class="home--loggedIn__feed__title col-12 mb-2 mb-lg-4 pl-0 pl-lg-3">Fil d'actualité</h1>
          <p class="noPosts col-12 text-center h4 my-5 py-5" v-if="noPosts">Rien à afficher...</p>

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
            :hasLiked="post.hasLiked"
            :hasDisliked="post.hasDisliked"
            :numberOfComments="post.numberOfComments"
            @post-deleted="refreshPosts"
            @post-updated="refreshPosts"
            @post-liked="refreshPosts"
            @post-disliked="refreshPosts"
          />
        </div>
      </section>

      <aside class="aside home--loggedIn__aside col-12 col-lg-3 mt-3 mt-md-0">
        <div class="aside__header mb-2 mb-md-3">
          <h2 class="aside__header__title mr-3">Topics</h2>
          <router-link to="/newtopic" class="aside__header__newTopic btn px-3 py-1"><i class="fas fa-plus mr-1"></i> Créer un topic</router-link>
        </div>

        <div class="searchbar mb-3 mb-md-4">
            <input type="search" class="searchbar__bar form-control" id="searchbar" aria-label="Search topics" placeholder="Rechercher" v-model="search" />
            <button type="submit" class="searchbar__btn btn" @click="makeResearch"><i class="fas fa-search fa-lg"></i></button>
        </div>

        <div class="aside__icons d-lg-none mb-4">
          <router-link :to="toPopular" class="aside__icons__icon py-2 px-3"><i class="fas fa-fire fa-sm fa-md-lg"></i><span class="d-none d-md-inline ml-2"> Populaires</span></router-link>
          <router-link :to="toRecent" class="aside__icons__icon py-2 px-3 mx-3"><i class="fas fa-clock fa-sm fa-md-lg"></i><span class="d-none d-md-inline ml-2"> Récents</span></router-link>
          <router-link :to="toFollowed" class="aside__icons__icon py-2 px-3"><i class="fas fa-user-check fa-sm fa-md-lg"></i><span class="d-none d-md-inline ml-2"> Suivis</span></router-link>
        </div>

        <div class="d-none d-lg-block">
          <TopicsList listName="popular" />
          <TopicsList listName="recent" />
          <TopicsList listName="followed" :userId="currentUser.id" />
        </div>
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
      search: '',
      noPosts: false,
      toPopular: {
          path: '/topics',
          query: {
              order: 'popular'
          }
      },
      toRecent: {
          path: '/topics',
          query: {
              order: 'recent'
          }
      },
      toFollowed: {
          path: '/topics',
          query: {
              order: 'followed'
          }
      },
    }
  },
  computed: {
    ...mapState(['logoVertical']),
    ...mapGetters(['loggedIn', 'currentUser'])
  },
  methods: {
    makeResearch() {
      this.$router.push({ path: '/topics', query: { name: this.search } });
    },
    async refreshPosts() {
      const response = await axios.get('/posts/?order=recent', {
        headers: {
          'Authorization': 'Bearer ' + this.currentUser.token
        }
      });
      this.posts = response.data;
    }
  },
  async beforeMount() {
    if (this.loggedIn) {
      const response = await axios.get('/posts/?order=recent', {
        headers: {
          'Authorization': 'Bearer ' + this.currentUser.token
        }
      });
      this.posts = response.data;
      if (this.posts.length == 0) {
        this.noPosts = true;
      }
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
        max-width: 100%;
        object-fit: cover;
      }
      @media screen and (max-width: 992px) {
        width: 100%;
        height: 300px;
      }
    }
    &__link {
      color: #FD3C13;
      &:hover {
        color: #FFD7D7;
        text-decoration: none;
      }
    }
  }
  &--loggedIn {
    display: flex;
    &__feed {
      @media screen and (max-width: 992px) {
        order: 2;
      }
      &__title {
        @media screen and (max-width: 576px) {
          font-size: 2rem;
        }
      }
    }
    &__aside {
      @media screen and (max-width: 992px) {
        order: 1;
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
    &__title {
      @media screen and (max-width: 576px) {
        font-size: 1.5rem;;
      }
    }
    &__newTopic {
      height: min-content;
      background-color: #FD3C13;
      color: #fff;
      font-weight: bold;
      @media screen and (max-width: 576px) {
        font-size: .9rem;
      }
      &:hover {
        background-color: #FFD7D7;
        color: #FD3C13;
      }
    }
  }
  &__icons {
    &__icon {
      background-color: #FD3C13;
      color: #fff;
      font-weight: bold;
      border-radius: .75rem;
      // @media screen and (max-width: 576px) {
      //   border-radius: 50%;
      // }
    }
  }
}
</style>