<template>
    <div class="post container px-2 pb-1">
        <router-link :to="postDetails" class="post__header row">
            <div class="post__header__pic col-1">
                <div class="post__header__pic__circle">
                    <img class="post__header__pic__img" :src="imageUrl" alt="Photo de profil de l'utilisateur" />
                </div>
            </div>
            <div class="post__header__txt col-10 p-0">
                <router-link :to="userProfile" class="post__header__txt__username font-weight-bold mb-0 mr-3">{{ firstName }} {{ lastName }} <span class="font-weight-normal">/{{ username }}</span></router-link>
                <p class="post__header__txt__topic mb-0" v-if="topic">@<router-link :to="href" class="text-dark">{{ topic }}</router-link></p>
            </div>
            <div class="post__header__modify col-1" v-if="currentUser.id == authorId">
                <b-dropdown class="post__header__modify__button dropdown" toggle-class="text-decoration-none" size="lg" dropleft no-caret>
                    <template #button-content>
                        <i class="fas fa-ellipsis-h"></i>
                    </template>
                    <b-dropdown-item @click="startUpdatingPost">Modifier</b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item @click="deletePost">Supprimer</b-dropdown-item>
                </b-dropdown>
            </div>
        </router-link>
        <div class="post__body row m-0">
            <p class="post__body__content col-12 pt-3" v-if="!updating">
                {{ content }}
            </p>

            <form id="updatePost" class="post__body__update col-12 py-3" @submit.prevent="updatePost" v-if="updating">
                <textarea class="post__body__update__content form-control" type="text" id="updatedPost" name="updatedPost" v-model="content"></textarea>
                <div class="post__body__update__submit">
                    <button type="submit" class="post__body__update__submit__btn btn px-3 py-1 ml-3">
                        Publier
                    </button>
                </div>
            </form>
        </div>
        <div class="row m-0">
            <div class="post__footer col px-0">
                <div class="post__footer__likes mx-2">
                    <button class="post__footer__likes__btn btn px-1" @click="likePost">
                        <i class="far fa-thumbs-up post__footer__likes__btn--null" v-if="!userHasLiked"></i>
                        <i class="far fa-thumbs-up post__footer__likes__btn--active" v-if="userHasLiked"></i>
                    </button>
                    <p class="post__footer__likes__number mb-0">{{ numberOfLikes }}</p>
                </div>
                <div class="post__footer__dislikes mx-2">
                    <button class="post__footer__dislikes__btn btn px-1" @click="dislikePost">
                        <i class="far fa-thumbs-down post__footer__dislikes__btn--null" v-if="!userHasDisliked"></i>
                        <i class="far fa-thumbs-down post__footer__dislikes__btn--active" v-if="userHasDisliked"></i>
                    </button>
                    <p class="post__footer__dislikes__number mb-0">{{ numberOfDislikes }}</p>
                </div>
                <p class="post__footer__comments mb-0 ml-3">{{ numberOfComments }} commentaires</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
    name: 'Post',
    props: ['id', 'authorId', 'imageUrl', 'firstName', 'lastName', 'username', 'topic', 'topicId', 'content', 'numberOfLikes', 'numberOfDislikes', 'hasLiked', 'hasDisliked', 'numberOfComments'],
    data() {
        return {
            href: {
                path: '/topic',
                query: {
                    id: this.topicId
                }
            },
            postDetails: {
                path: '/post',
                query: {
                    topic: this.topicId,
                    id: this.id
                }
            },
            userProfile: {
                path: '/user',
                query: {
                    id: this.authorId
                }
            },
            updating: false,
            userHasLiked: false,
            userHasDisliked: false
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    methods: {
        async deletePost() {
            const reqUrl = '/topics/' + this.topicId + '/posts/' + this.id;
            const response = await axios.delete(reqUrl, {
                data: {
                    userId: this.authorId
                }
            });
            console.log(response.data);
            this.$emit('post-deleted');
        },
        startUpdatingPost() {
            this.updating = true;
        },
        async updatePost() {
            const reqUrl = '/topics/' + this.topicId + '/posts/' + this.id;
            const response = await axios.put(reqUrl, {
                userId: this.authorId,
                content: this.content  
            });
            console.log(response.data);
            this.updating = false;
            this.$emit('post-updated');
        },
        async likePost() {
            const reqUrl = '/topics/' + this.topicId + '/posts/' + this.id + '/like';
            if (this.userHasLiked) {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: 0
                });
                console.log(response.data);
                this.userHasLiked = false;
                this.numberOfLikes--;
            } else {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: 1
                });
                console.log(response.data);
                this.userHasLiked = true;
                this.numberOfLikes++;
                if (this.userHasDisliked) {
                    this.userHasDisliked = false;
                }
            }
            this.$emit('post-liked');
        },
        async dislikePost() {
            const reqUrl = '/topics/' + this.topicId + '/posts/' + this.id + '/like';
            if (this.userHasDisliked) {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: 0
                });
                console.log(response.data);
                this.userHasDisliked = false;
                this.numberOfDislikes--;
            } else {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: -1
                });
                console.log(response.data);
                this.userHasDisliked = true;
                this.numberOfDislikes++;
                if (this.userHasLiked) {
                    this.userHasLiked = false;
                }
            }
            this.$emit('post-disliked');
        }
    },
    beforeMount() {
        const hasLikedArray = Array.from(this.hasLiked).filter(char => char !== ',');
        const hasDislikedArray = Array.from(this.hasDisliked).filter(char => char !== ',');
        if (hasLikedArray.includes(this.currentUser.id.toString())) {
            this.userHasLiked = true;
        } else if (hasDislikedArray.includes(this.currentUser.id.toString())) {
            this.userHasDisliked = true;
        }
    }
}
</script>

<style lang="scss">

.post {
    height: auto;
    border: solid 1px #d3d3d3;
    border-radius: .3rem;
    margin: 0;
    min-width: 100%;
    overflow: hidden;
    margin-top: 15px;
    margin-bottom: 15px;
    &__header {
        height: 50px;
        background-color: #FFD7D7;
        color: #000;
        &:hover {
            color: #000;
            text-decoration: none;
        }
        &__pic {
            display: flex;
            justify-content: center;
            align-items: center;
            &__circle {
                border: solid 2px #fff;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                overflow: hidden;
            }
            &__img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        &__txt {
            display: flex;
            align-items: center;
            &__username {
                color: #000;
                &:hover {
                    color: #000;
                }
            }
        }
        &__modify {
            display: flex;
            justify-content: center;
            align-items: center;
            &__button {
                width: 30px;
                height: 30px;
                .btn {
                    background-color: #FFD7D7;
                    color: #fff;
                    border: none;
                }
            }
        }
    }
    &__body {
        &__update {
            display: flex;
            align-items: center;
            &__submit {
                &__btn {
                    background-color: #FD3C13;
                    color: #fff;
                    font-weight: bold;
                    &:hover {
                        background-color: #FFD7D7;
                        color: #FD3C13;
                    }
                }
            }
        }
    }
    &__footer {
        height: 50px;
        display: flex;
        align-items: center;
        border-top: solid 1px #d3d3d3;
        &__likes {
            display: flex;
            justify-content: center;
            align-items: center;
            &__btn {
                &--null {
                    color: #000;
                }
                &--active {
                    color: #FFD7D7;
                }
            }
        }
        &__dislikes {
            display: flex;
            justify-content: center;
            align-items: center;
            &__btn {
                &--null {
                    color: #000;
                }
                &--active {
                    color: #FD3C13;
                }
            }
        }
    }
}

.btn {
    padding: 0;
}
</style>