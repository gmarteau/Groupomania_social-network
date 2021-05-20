<template>
    <div class="postDetails">
        <section class="postDetails__post row">
            <Post 
                :id="post.id"
                :authorId="post.UserId"
                :imageUrl="post.User.profilePicture"
                :firstName="post.User.firstName"
                :lastName="post.User.lastName"
                :username="post.User.username"
                :topicId="post.TopicId"
                :topic="post.Topic.name"
                :content="post.content"
                :numberOfLikes="post.likes"
                :numberOfDislikes="post.dislikes"
                :numberOfComments="post.numberOfComments"
                @post-deleted="redirectToTopicPage"
                @post-updated="refreshPost"
            />
        </section>

        <section class="postDetails__comments">
            <h1 class="postDetails__comments__title h4">Commentaires</h1>

            <div class="postDetails__comments__body row">
                <div class="postDetails__comments__publish container py-3">
                    <form id="publishNewCommentForm" class="row" @submit.prevent="publishNewComment">
                        <div class="form-group col-10 mb-0">
                            <textarea class="postDetails__comments__publish__content form-control" type="text" id="newComment" name="newComment" v-model="newComment" placeholder="Ecrivez un commentaire..."></textarea>
                        </div>
                        <div class="postDetails__comments__publish__submit col-2">
                            <button type="submit" class="postDetails__comments__publish__submit__btn btn px-3 py-1">
                                Commenter
                            </button>
                        </div>
                    </form>
                </div>

                <Comment
                    v-for="comment in comments"
                    :key="comment.id"
                    :id="comment.id"
                    :authorId="comment.UserId"
                    :imageUrl="comment.User.profilePicture"
                    :firstName="comment.User.firstName"
                    :lastName="comment.User.lastName"
                    :username="comment.User.username"
                    :content="comment.content"
                    :numberOfLikes="comment.likes"
                    :numberOfDislikes="comment.dislikes"
                    @comment-deleted="refreshComments"
                    @comment-updated="refreshComments"
                />
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios'
import Post from '../components/Post'
import Comment from '../components/Comment'
import { mapGetters } from 'vuex'

export default {
    name: 'PostDetails',
    components: {
        Post,
        Comment
    },
    data() {
        return {
            post: '',
            comments: [],
            newComment: ''
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    methods: {
        async publishNewComment() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('topic');
            const postId = searchUrl.get('id');
            const reqUrlPost = '/topics/' + topicId + '/posts/' + postId + '/comments';
            const createComment = await axios.post(reqUrlPost, {
                userId: this.currentUser.id,
                content: this.newComment
            });
            console.log(createComment.data);
            const reqUrlGet = reqUrlPost + '/?order=recent';
            const commentsRefreshed = await axios.get(reqUrlGet);
            this.comments = commentsRefreshed.data;
            document.getElementById('newComment').value = '';
            this.newComment = '';
        },
        redirectToTopicPage() {
            this.$router.push({ path: '/topic', query: { id: this.post.TopicId } });
        },
        async refreshComments() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('topic');
            const postId = searchUrl.get('id');
            const reqUrl = '/topics/' + topicId + '/posts/' + postId + '/comments/?order=recent';
            const commentsRefreshed = await axios.get(reqUrl);
            this.comments = commentsRefreshed.data;
        },
        async refreshPost() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('topic');
            const postId = searchUrl.get('id');
            const reqUrl = '/topics/' + topicId + '/posts/' + postId;
            const postRefreshed = await axios.get(reqUrl);
            this.post = postRefreshed.data;
        }
    },
    async beforeMount() {
        const url = window.location.search;
        const searchUrl = new URLSearchParams(url);
        const topicId = searchUrl.get('topic');
        const postId = searchUrl.get('id');
        const reqUrlPost = '/topics/' + topicId + '/posts/' + postId;
        const post = await axios.get(reqUrlPost);
        this.post = post.data;
        const reqUrlComments = reqUrlPost + '/comments/?order=recent';
        const comments = await axios.get(reqUrlComments);
        this.comments = comments.data;
    }
}
</script>

<style lang="scss">

.postDetails {
    width: 75%;
    margin: auto;
    &__comments {
        &__body {
            border: solid 1px #d3d3d3;
            border-radius: .3rem;
        }
        &__publish {
            min-width: 100%;
            background-color: #FFD7D7;
            &__submit {
                display: flex;
                justify-content: center;
                align-items: center;
                &__btn {
                    background-color: #FD3C13;
                    color: #fff;
                    font-weight: bold;
                    &:hover {
                        background-color: #fff;
                        color: #FD3C13;
                        border: solid 2px #FD3C13;
                    }
                }
            }
        }
    }
}
</style>