<template>
    <div class="followers p-3 my-4">
        <h2 class="followers__title mb-3">Suivi par</h2>
        <p class="followers__none p-3 m-0" v-if="numberOfFollowers == 0">Soyez le premier à suivre ce topic!</p>
        <ul class="followers__list list-group" v-if="numberOfFollowers > 0">
            <TopicFollowersItem
                v-for="follower in followers"
                :key="follower.username"
                :username="follower.username"
                :firstName="follower.firstName"
                :lastName="follower.lastName"
            />
        </ul>
        <p class="followers__more mb-0 mt-3 text-center" v-if="numberOfFollowers > 10">...et bien d'autres encore!</p>
    </div>
</template>

<script>
import axios from 'axios'
import TopicFollowersItem from './TopicFollowersItem'
import { mapGetters } from 'vuex'

export default {
    name: 'TopicFollowers',
    props: ['hasFollowed', 'numberOfFollowers'],
    components: {
        TopicFollowersItem
    },
    data() {
        return {
            followers: []
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    async beforeMount() {
        console.log(this.hasFollowed);
        const response = await axios.get('/users/?limit=10', {
            params: {
                followers: this.hasFollowed,
            }
        }, {
            headers: {
            'Authorization': 'Bearer ' + this.currentUser.token
            }
        });
        this.followers = response.data;
    }
}
</script>

<style lang="scss">

.followers {
    background-color: #FD3C13;
    border-radius: .3rem;
    &__title {
        color: #fff;
    }
    &__none {
        background-color: #fff;
        border-radius: .3rem;
    }
}
</style>