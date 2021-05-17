<template>
    <div class="topic">
        <TopicHeader
            :imageUrl="topic.imageUrl"
            :name="topic.name"
            :description="topic.description"
            :createdAt="topic.dateCreation"
            :createdBy="topic.User.username"
            :topicId="topic.id"
            :userId="currentUser.id"
            :followed="followed"
            :followers="topic.numberOfFollowers"
        />

        <div class="topic__body row">
            <section class="topic__body__feed col-9 pr-5">
                <div class="topic__body__feed__publish">

                </div>

                <div class="topic__body__feed__posts">
                    <p class="topic__body__feed__posts__empty text-center h5 mt-5" v-if="noPosts">
                        Soyez le premier à publier quelque chose à propos de ce sujet!
                    </p>
                    
                    <Post 
                        v-for="post in posts"
                        :key="post.id"
                        :imageUrl="post.User.profilePicture"
                        :firstName="post.User.firstName"
                        :lastName="post.User.lastName"
                        :username="post.User.username"
                        :topicId="post.TopicId"
                        :content="post.content"
                        :numberOfLikes="post.likes"
                        :numberOfDislikes="post.dislikes"
                        :numberOfComments="post.numberOfComments"
                    />
                </div>
            </section>

            <aside class="topic__body__followers col-3">
                <TopicFollowers 
                    :hasFollowed="topic.hasFollowed"
                    :numberOfFollowers="topic.numberOfFollowers"
                />
            </aside>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import TopicHeader from '../components/TopicHeader'
import Post from '../components/Post'
import { mapGetters } from 'vuex'
import TopicFollowers from '../components/TopicFollowers'

export default {
    name: 'Topic',
    components: {
        TopicHeader,
        Post,
        TopicFollowers
    },
    data() {
        return {
            topic: '',
            posts: [],
            noPosts: false,
            followed: false
        }
    },
    computed: {
        ...mapGetters(['currentUser']),
    },
    async beforeMount() {
        const url = window.location.search;
        const searchUrl = new URLSearchParams(url);
        const topicId = searchUrl.get('id');
        const reqUrlInfo = '/topics/' + topicId;
        const topicInfo = await axios.get(reqUrlInfo);
        this.topic = topicInfo.data;
        this.topic.hasFollowed = Array.from(this.topic.hasFollowed).filter(char => char !== ',');
        if (this.topic.hasFollowed.includes(this.currentUser.id.toString())) {
            this.followed = true;
        }
        const reqUrlPosts = reqUrlInfo + '/posts/?order=recent';
        const topicPosts = await axios.get(reqUrlPosts);
        if (topicPosts.data.length == 0) {
            this.noPosts = true;
        } else {
            this.posts = topicPosts.data;
        }
    }
}
</script>

<style lang="scss">

.topic {
    &__body {
        &__feed {
            &__posts {
                padding: inherit;
            }
        }
    }
}
</style>