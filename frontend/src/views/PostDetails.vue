<template>
    <div class="postDetails row">
        <Post 
            :id="post.id"
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
        />
    </div>
</template>

<script>
import axios from 'axios'
import Post from '../components/Post'

export default {
    name: 'PostDetails',
    components: {
        Post
    },
    data() {
        return {
            post: ''
        }
    },
    async beforeMount() {
        const url = window.location.search;
        const searchUrl = new URLSearchParams(url);
        const topicId = searchUrl.get('topic');
        const postId = searchUrl.get('id');
        const reqUrlPost = '/topics/' + topicId + '/posts/' + postId;
        const post = await axios.get(reqUrlPost);
        console.log(post.data);
        this.post = post.data;

    }
}
</script>

<style lang="scss">

.postDetails {
    width: 75%;
    margin: auto;
}
</style>