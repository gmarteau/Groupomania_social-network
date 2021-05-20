<template>
    <div class="comment container mx-0 py-3">
        <div class="comment__body row mb-2">
            <div class="comment__body__pic col-1">
                <div class="comment__body__pic__circle">
                    <img class="comment__body__pic__circle__img" :src="imageUrl" alt="Photo de profil de l'utilisateur" />
                </div>
            </div>
            <div class="comment__body__txt col-10 p-0">
                <p class="comment__body__txt__user mb-0 mr-4"><span class="font-weight-bold">{{ firstName }} {{ lastName }}</span> /{{ username }} :</p>
                <p class="comment__body__txt__content mb-0" v-if="!updating">
                    {{ content }}
                </p>

                <form id="updateComment" class="comment__body__txt__update col-9 py-0" @submit.prevent="updateComment" v-if="updating">
                    <textarea class="comment__body__txt__update__content form-control mr-3" type="text" id="updatedComment" name="updatedComment" v-model="content"></textarea>
                    <div class="comment__body__txt__update__submit">
                        <button type="submit" class="comment__body__txt__update__submit__btn btn px-3 py-1">
                            Publier
                        </button>
                    </div>
                </form>
            </div>
            <div class="comment__body__modify col-1" v-if="currentUser.id == authorId">
                <b-dropdown class="comment__body__modify__button dropdown" toggle-class="text-decoration-none" dropleft no-caret>
                    <template #button-content>
                        <i class="fas fa-ellipsis-h"></i>
                    </template>
                    <b-dropdown-item @click="startUpdatingComment">Modifier</b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item @click="deleteComment">Supprimer</b-dropdown-item>
                </b-dropdown>
            </div>
        </div>

        <div class="row m-0">
            <div class="comment__footer col">
                <div class="comment__footer__likes mx-2">
                    <button class="comment__footer__likes__btn btn px-1"><i class="far fa-thumbs-up"></i></button>
                    <p class="comment__footer__likes__number mb-0">{{ numberOfLikes }}</p>
                </div>
                <div class="comment__footer__dislikes mx-2">
                    <button class="comment__footer__dislikes__btn btn px-1"><i class="far fa-thumbs-down"></i></button>
                    <p class="comment__footer__dislikes__number mb-0">{{ numberOfDislikes }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
    name: 'Comment',
    props: ['id', 'authorId', 'imageUrl', 'firstName', 'lastName', 'username', 'content', 'numberOfLikes', 'numberOfDislikes'],
    data() {
        return {
            updating: false
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    methods: {
        async deleteComment() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('topic');
            const postId = searchUrl.get('id');
            const reqUrl = '/topics/' + topicId + '/posts/' + postId + '/comments/' + this.id;
            const response = await axios.delete(reqUrl, {
                data: {
                    userId: this.authorId
                }
            });
            console.log(response.data);
            this.$emit('comment-deleted');
        },
        startUpdatingComment() {
            this.updating = true;
        },
        async updateComment() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('topic');
            const postId = searchUrl.get('id');
            const reqUrl = '/topics/' + topicId + '/posts/' + postId + '/comments/' + this.id;
            const response = await axios.put(reqUrl, {
                userId: this.authorId,
                content: this.content
            });
            console.log(response.data);
            this.updating = false;
            this.$emit('comment-updated');
        }
    }
}
</script>

<style lang="scss">

.comment {
    border-bottom: solid 2px #d3d3d3;
    min-width: 100%;
    &__body {
        &__pic {
            display: flex;
            align-items: center;
            justify-content: center;
            &__circle {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                overflow: hidden;
                &__img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
        &__txt {
            display: flex;
            align-items: center;
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
        &__modify {
            display: flex;
            justify-content: center;
            align-items: center;
            &__button {
                width: 25px;
                height: 25px;
                .btn {
                    background-color: #fff;
                    color: #d3d3d3;
                    border: none;
                }
            }
        }
    }
    &__footer {
        display: flex;
        align-items: center;
        &__likes {
            display: flex;
            align-items: center;
        }
        &__dislikes {
            display: flex;
            align-items: center;
        }
    }
}
</style>