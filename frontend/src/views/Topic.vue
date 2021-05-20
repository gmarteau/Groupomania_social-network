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
                <div class="topic__body__feed__publish pb-3 pr-5 mb-2">
                    <form id="publishNewPostForm" @submit.prevent="publishNewPost">
                        <div class="form-group mb-2">
                            <label for="newPost" class="h3">Exprimez-vous!</label>
                            <textarea class="topic__body__feed__publish__content form-control" type="text" id="newPost" name="newPost" v-model="newPost" placeholder="Publiez quelque chose..."></textarea>
                        </div>
                        <div class="topic__body__feed__publish__submit">
                            <button type="submit" class="topic__body__feed__publish__submit__btn btn px-3 py-1">
                                Publier
                            </button>
                        </div>
                    </form>
                </div>

                <div class="topic__body__feed__posts row">
                    <p class="topic__body__feed__posts__empty col text-center h5 mt-5" v-if="noPosts">
                        Soyez le premier à publier quelque chose à propos de ce sujet!
                    </p>
                    
                    <Post 
                        v-for="post in posts"
                        :key="post.id"
                        :id="post.id"
                        :authorId="post.UserId"
                        :imageUrl="post.User.profilePicture"
                        :firstName="post.User.firstName"
                        :lastName="post.User.lastName"
                        :username="post.User.username"
                        :topicId="post.TopicId"
                        :content="post.content"
                        :numberOfLikes="post.likes"
                        :numberOfDislikes="post.dislikes"
                        :numberOfComments="post.numberOfComments"
                        @post-deleted="refreshPosts"
                        @post-updated="refreshPosts"
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
            followed: false,
            newPost: ''
        }
    },
    computed: {
        ...mapGetters(['currentUser']),
    },
    methods: {
        async publishNewPost() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('id');
            const reqUrlPost = '/topics/' + topicId + '/posts';
            const createPost = await axios.post(reqUrlPost, {
                userId: this.currentUser.id,
                content: this.newPost
            });
            console.log(createPost.data);
            const reqUrlGet = reqUrlPost + '/?order=recent' 
            const postsRefreshed = await axios.get(reqUrlGet);
            this.posts = postsRefreshed.data;
            document.getElementById('newPost').value = '';
            this.newPost = '';
            if (this.noPosts) {
                this.noPosts = false;
            }
        },
        async refreshPosts() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('id');
            const reqUrl = '/topics/' + topicId + '/posts/?order=recent';
            const postsRefreshed = await axios.get(reqUrl);
            if (postsRefreshed.data.length == 0) {
                this.noPosts = true;
            } else {
                this.posts = postsRefreshed.data;
            }
        }
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
            &__publish {
                position: relative;
                &::after {
                    content: '';
                    height: 2px;
                    background-color: #FFD7D7;
                    position: absolute;
                    bottom: 0;
                    width: 95%;
                }
                &__content {
                    min-height: 100px;
                }
                &__submit {
                    display: flex;
                    justify-content: flex-end;
                    &__btn {
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
        }
    }
}
</style>