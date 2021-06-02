<template>
    <div class="topicsList row p-3 my-4">
        <router-link :to="href" class="topicsList__title col-12 h2">{{ title }}</router-link>
        <ul class="topicsList__list list-group col-12 px-0">
            <TopicsListItem
                v-for="topic in topics"
                :key="topic.name"
                :topicName="topic.name"
                :topicId="topic.id"
            />
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import TopicsListItem from './TopicsListItem'

export default {
    name: 'TopicsList',
    props: ['listName', 'userId'],
    components: {
        TopicsListItem
    },
    data() {
        return {
            title: '',
            href: {
                path: '/topics',
                query: {
                    order: this.listName
                }
            },
            topics: []
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    async beforeMount() {
        if (this.listName == 'popular') {
            this.title = 'Les + populaires';
            const response = await axios.get('/topics/?order=popular&limit=5', {
                headers: {
                'Authorization': 'Bearer ' + this.currentUser.token
                }
            });
            this.topics = response.data;
        } else if (this.listName == 'recent') {
            this.title = 'Les + récents';
            const response = await axios.get('/topics/?order=recent&limit=5', {
                headers: {
                'Authorization': 'Bearer ' + this.currentUser.token
                }
            });
            this.topics = response.data;
        } else if (this.listName == 'followed') {
            this.title = 'Suivis';
            const config = {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                },
                params: {
                    userId: this.userId
                }
            };
            const response = await axios.get('/topics/?order=followed&limit=5', config);
            this.topics = response.data;
        }
    }
}
</script>

<style lang="scss">

.topicsList {
    background-color: #D1515A;
    color: #fff;
    border-radius: .3rem;
    &__title {
        text-decoration: none;
        color: #fff;
        &:hover {
            text-decoration: none;
            color: #fff;
        }
    }
}
</style>