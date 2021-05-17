<template>
    
    <router-link :to="href" class="topicCard col-3 mx-5 px-2 py-3">
        <div class="topicCard__pic mx-3">
            <div class="topicCard__pic__circle">
                <img class="topicCard__pic__circle__img" :src="imageUrl" :alt="alt" />
            </div>
        </div>
        <div class="topicCard__txt">
            <p class="topicCard__txt__name font-weight-bold m-0 pb-1">{{ name }}</p>
            <p class="topicCard__txt__description m-0">{{ description }}</p>
            <p class="topicCard__txt__followers m-0">{{ numberOfFollowers }}</p>
        </div>
    </router-link>
</template>

<script>
export default {
    name: 'TopicCard',
    props: ['imageUrl', 'name', 'description', 'id', 'followers'],
    data() {
        return {
            alt: 'Photo du topic ' + this.name,
            href: {
                path: '/topic',
                query: {
                    id: this.id
                }
            }
        }
    },
    computed: {
        numberOfFollowers() {
            if (this.followers == 0) {
                return '';
            } else if (this.followers == 1) {
                return '1 personne suit ce topic';
            } else {
                return this.followers + ' personnes suivent ce topic';
            }
        }
    }
}
</script>

<style lang="scss">

.topicCard {
    border: solid 1px #d3d3d3;
    border-radius: .3rem;
    box-shadow: 1px 1px 6px #FFD7D7;
    text-decoration: none;
    color: #000;
    display: flex;
    &:hover {
        text-decoration: none;
        color: #000;
        box-shadow: 3px 3px 3px #FFD7D7;
    }
    &__pic {
        width: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
        &__circle {
            width: 100px;
            height: 100px;
            border: solid 2px #FFD7D7;
            border-radius: 50%;
            overflow: hidden;
        }
    }
    &__txt {
        width: 75%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        &__followers {
            font-style: italic;
        }
    }
}
</style>