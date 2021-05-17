<template>
    <section class="topicHeader row">
        <div class="topicHeader__bgd col-12"></div>

        <div class="topicHeader__pic col-2">
            <div class="topicHeader__pic__circle">
                <img class="topicHeader__pic__circle__img" :src="imageUrl" :alt="alt" />
            </div>
        </div>

        <div class="topicHeader__info col-10 pt-3 mb-5">
            <div class="topicHeader__info__txt">
                <h1 class="topicHeader__info__name mb-3">{{ name }}</h1>
                <p class="topicHeader__info__description mb-1">{{ description }}</p>
                <p class="topicHeader__info__created">Créé le {{ dateCreation }} par {{ createdBy }}</p>
            </div>
            <button class="topicHeader__info__btn btn mb-3 ml-5 mr-3 px-3 py-1 font-weight-bold" v-if="!followed" @click="followTopic"><i class="fas fa-plus mr-1"></i> Suivre</button>
            <button class="topicHeader__info__btn--followed btn mb-3 ml-5 mr-3 px-3 py-1 font-weight-bold" v-if="followed" @click="unfollowTopic"><i class="fas fa-check mr-1"></i> Suivi</button>
            <p class="topicHeader__info__followers font-italic">{{ followers }} follower(s)</p>
        </div>
    </section>
</template>

<script>

import axios from 'axios'

export default {
    name: 'TopicHeader',
    props: ['imageUrl', 'name', 'description', 'createdAt', 'createdBy', 'followed', 'topicId', 'userId', 'followers'],
    computed: {
        alt() {
            return 'Photo du topic ' + this.name;
        },
        dateCreation() {
            return this.createdAt.split('T')[0];
        }
    },
    methods: {
        async followTopic() {
            const reqUrl = '/topics/' + this.topicId + '/follow';
            const response = await axios.post(reqUrl, {
                userId: this.userId,
                follow: 1
            });
            console.log(response.data);
            this.followed = true;
        },
        async unfollowTopic() {
            const reqUrl = '/topics/' + this.topicId + '/follow';
            const response = await axios.post(reqUrl, {
                userId: this.userId,
                follow: 0
            });
            console.log(response.data);
            this.followed = false;
        }
    }
}
</script>

<style lang="scss">

.topicHeader {
    &__bgd {
        height: 200px;
        margin-top: -50px;
        z-index: -1000;
        background-color: #FFD7D7;
    }
    &__pic {
        display: flex;
        justify-content: center;
        &__circle {
            width: 190px;
            height: 190px;
            border: solid 5px #fff;
            border-radius: 50%;
            overflow: hidden;
            background-color: #d3d3d3;
            margin-top: -55px;
        }
    }
    &__info {
        position: relative;
        display: flex;
        align-items: flex-end;
        &::after {
            content: '';
            height: 2px;
            width: 75%;
            background-color: #FD3C13;
            position: absolute;
            bottom: 0;
        }
        &__btn {
            background-color: #FD3C13;
            color: #fff;
            &:hover {
                color: #FD3C13;
                background-color: #FFD7D7;
            }
            &--followed {
                color: #FD3C13;
                background-color: #FFD7D7;
            }
        }
    }
}
</style>