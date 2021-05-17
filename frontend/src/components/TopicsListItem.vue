<template>
    <li class="topicsList__list__item list-group-item">
        <router-link :to="href" class="topicsList__list__item__link font-weight-bold">
            {{ topicName }}
        </router-link>
    </li>
</template>

<script>
export default {
    name: 'TopicsListItem',
    props: ['topicName', 'topicId'],
    data() {
        return {
            href: {
                path: '/topic',
                query: {
                    id: this.topicId
                }
            }
        }
    }
}
</script>

<style lang="scss">

.topicsList__list__item {
    &__link {
        color: #000;
        &:hover {
            text-decoration: none;
            color: #d3d3d3;
        }
    }
}
</style>