<template>
    <div class="topicsList row p-3 my-4">
        <h2 class="topicsList__title col-12">{{ title }}</h2>
        <ul class="topicsList__list list-group col-12 px-0">
            <TopicsListItem
                v-for="topic in topics"
                :key="topic.name"
                :topicName="topic.name"
            />
        </ul>
    </div>
</template>

<script>

import axios from 'axios'
import TopicsListItem from './TopicsListItem'
import { mapGetters } from 'vuex'

export default {
    name: 'TopicsList',
    props: ['listName'],
    components: {
        TopicsListItem
    },
    data() {
        return {
            title: '',
            topics: []
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    async beforeMount() {
        if (this.listName == 'popular') {
            this.title = 'Les + populaires';
            const response = await axios.get('/topics/?order=popular&limit=5');
            this.topics = response.data;
        } else if (this.listName == 'recent') {
            this.title = 'Les + récents';
            const response = await axios.get('/topics/?order=recent&limit=5');
            this.topics = response.data;
        } else if (this.listName == 'followed') {
            this.title = 'Suivis';
            const response = await axios.get('/topics/?order=followed&limit=5', {
                params: {
                    userId: this.currentUser.id
                }
            });
            this.topics = response.data;
        }
    }
}
</script>

<style lang="scss">

.topicsList {
    background-color: #FD3C13;
    color: #fff;
    border-radius: .3rem;
}
</style>