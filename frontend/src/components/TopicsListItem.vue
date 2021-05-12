<template>
    <li class="topicsList__list__item list-group-item text-dark font-weight-bold">
        {{ topicName }}
    </li>
</template>

<script>
export default {
    name: 'TopicsListItem',
    props: ['topicName']
}
</script>