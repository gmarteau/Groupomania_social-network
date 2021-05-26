<template>
    <div class="topics row pl-5 ml-5">
        <p class="topics__noresults" v-if="noResults">Désolé, aucun résultat ne correspond à votre recherche...</p>

        <TopicCard
            v-for="topic in topics"
            :key="topic.name"
            :imageUrl="topic.imageUrl"
            :name="topic.name"
            :description="topic.description"
            :id="topic.id"
            :followers="topic.numberOfFollowers"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import TopicCard from '../components/TopicCard'

export default {
    name: 'TopicsResults',
    components: {
        TopicCard
    },
    data() {
        return {
            topics: [],
            noResults: false
        }
    },
    computed: {
        ...mapGetters(['currentUser', 'loggedIn'])
    },
    async beforeMount() {
        if (!this.loggedIn) {
            this.$router.push('/');
        }
        const url = window.location.search;
        const searchUrl = new URLSearchParams(url);
        if (searchUrl.has('order')) {
            const urlQuery = searchUrl.get('order');
            if (urlQuery == 'popular') {
                const response = await axios.get('/topics/?order=popular', {
                    headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                    }
                });
                this.topics = response.data;
            } else if (urlQuery == 'recent') {
                const response = await axios.get('/topics/?order=recent', {
                    headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                    }
                });
                this.topics = response.data;                
            } else if (urlQuery == 'followed') {
                const response = await axios.get('/topics/?order=followed', {
                    params: {
                        userId: this.currentUser.id
                    }
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                    }
                });
                this.topics = response.data;
            }
        }
        if (searchUrl.has('name')) {
            const urlQuery = searchUrl.get('name');
            const requestUrl = '/topics/?name=' + urlQuery;
            const response = await axios.get(requestUrl, {
                headers: {
                'Authorization': 'Bearer ' + this.currentUser.token
                }
            });
            if (response.data.length == 0) {
                this.noResults = true;
            } else {
                this.topics = response.data;
            }
        }
    }
}
</script>

<style lang="scss">

</style>