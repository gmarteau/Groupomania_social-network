<template>
    <div class="profile row">
        <div class="profile__top col-12"></div>

        <div class="profile__static col-12" v-if="!updating">
            <section class="profile__info">
                <div class="profile__info__pic">
                    <div class="profile__info__pic__circle">
                        <img class="profile__info__pic__circle__img" :src="user.profilePicture" :alt="alt" />
                    </div>
                </div>
                <div class="profile__info__header my-3">
                    <h1 class="profile__info__header__name mr-3"><span class="font-weight-bold">{{ user.firstName }} {{ user.lastName }}</span> /{{ user.username }}</h1>
                    <b-dropdown class="profile__info__header__settings dropdown" toggle-class="text-decoration-none" size="lg" dropright no-caret v-if="userId == currentUser.id">
                        <template #button-content>
                            <i class="fas fa-cog fa-lg"></i>
                        </template>
                        <b-dropdown-item @click="startUpdatingProfile">Modifier mes informations</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item @click="deleteProfile">Supprimer mon compte</b-dropdown-item>
                    </b-dropdown>
                </div>
                <p class="profile__info__date text-center">Membre depuis le {{ dateCreation }}</p>
                <p class="profile__info__bio text-center h4 mt-5">{{ user.bio }}</p>
            </section>

            <aside class="profile__followed mt-5">
                <TopicsList listName="followed" :userId="userId" class="profile__followed__list" />
            </aside>
        </div>

        <div class="profile__updating col-12" v-if="updating">
            <h1 class="profile__updating__title">Modifier mes informations</h1>
        </div>
    </div>
</template>

<script>
import TopicsList from '../components/TopicsList'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
    name: 'Profile',
    components: {
        TopicsList
    },
    data() {
        return {
            userId: 0,
            user: '',
            updating: false
        }
    },
    computed: {
        alt() {
            return 'Photo de profil de ' + this.user.firstName + ' ' + this.user.lastName
        },
        dateCreation() {
            return this.user.createdAt.split('T')[0];
        },
        ...mapGetters(['currentUser'])
    },
    methods: {
        startUpdatingProfile() {
            this.updating = true;
        }
    },
    async beforeMount() {
        const url = window.location.search;
        const searchUrl = new URLSearchParams(url);
        const userId = searchUrl.get('id');
        this.userId = parseInt(userId);
        const reqUrl = '/users/' + userId;
        const response = await axios.get(reqUrl);
        this.user = response.data;
    }
}
</script>

<style lang="scss">

.profile {
    &__top {
        height: 200px;
        margin-top: -50px;
        z-index: -1000;
        background-color: #FFD7D7;
    }
    &__info {
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
                &__img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
        &__header {
            display: flex;
            justify-content: center;
            align-items: center;
            &__settings {
                width: 35px;
                height: 35px;
                .btn {
                    background-color: #fff;
                    color: #d3d3d3;
                    border: none;
                }
            }
        }
    }
    &__followed {
        display: flex;
        justify-content: center;
        &__list {
            width: 50%;
        }
    }
}
</style>