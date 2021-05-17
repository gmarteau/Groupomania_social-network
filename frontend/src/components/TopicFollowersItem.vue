<template>
    <li class="list-group-item"><span class="font-weight-bold">{{ firstName }} {{ lastName }}</span> /{{ username }}</li>
</template>

<script>
export default {
    name: 'TopicFollowersItem',
    props: ['firstName', 'lastName', 'username']
}
</script>

<style lang="scss">

</style>