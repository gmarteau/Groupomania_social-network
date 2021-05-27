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

                <b-form id="updateCommentForm" class="comment__body__txt__update col-9 py-0" @submit.stop.prevent="updateComment" v-if="updating" novalidate>
                    <b-form-group id="updateCommentGroup">
                        <b-form-textarea id="updateCommentInput" name="updateCommentInput" v-model="$v.content.$model" :state="validateState()" aria-describedby="updateCommentInputFeedback" type="text" required></b-form-textarea>
                        <b-form-invalid-feedback id="updateCommentInputFeedback" :state="validateState()">Votre commentaire ne peut pas être vide</b-form-invalid-feedback>
                    </b-form-group>
                    <div class="comment__body__txt__update__submit">
                        <button type="submit" class="comment__body__txt__update__submit__btn btn px-3 py-1 ml-3">
                            Publier
                        </button>
                    </div>
                </b-form>
            </div>
            <div class="comment__body__modify col-1" v-if="(currentUser.id == authorId) || currentUser.isAdmin">
                <b-dropdown class="comment__body__modify__button dropdown" toggle-class="text-decoration-none" dropleft no-caret>
                    <template #button-content>
                        <i class="fas fa-ellipsis-h"></i>
                    </template>
                    <b-dropdown-item @click="startUpdatingComment" v-if="currentUser.id == authorId">Modifier</b-dropdown-item>
                    <b-dropdown-divider v-if="currentUser.id == authorId"></b-dropdown-divider>
                    <b-dropdown-item @click="deleteComment" v-if="(currentUser.id == authorId) || currentUser.isAdmin">Supprimer</b-dropdown-item>
                </b-dropdown>
            </div>
        </div>

        <div class="row m-0">
            <div class="comment__footer col">
                <div class="comment__footer__likes mx-2">
                    <button class="comment__footer__likes__btn btn px-1" @click="likeComment">
                        <i class="far fa-thumbs-up comment__footer__likes__btn--null" v-if="!userHasLiked"></i>
                        <i class="far fa-thumbs-up comment__footer__likes__btn--active" v-if="userHasLiked"></i>
                    </button>
                    <p class="comment__footer__likes__number mb-0">{{ numberOfLikes }}</p>
                </div>
                <div class="comment__footer__dislikes mx-2">
                    <button class="comment__footer__dislikes__btn btn px-1" @click="dislikeComment">
                        <i class="far fa-thumbs-down comment__footer__dislikes__btn--null" v-if="!userHasDisliked"></i>
                        <i class="far fa-thumbs-down comment__footer__dislikes__btn--active" v-if="userHasDisliked"></i>
                    </button>
                    <p class="comment__footer__dislikes__number mb-0">{{ numberOfDislikes }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'Comment',
    mixins: [validationMixin],
    props: ['id', 'authorId', 'imageUrl', 'firstName', 'lastName', 'username', 'content', 'numberOfLikes', 'numberOfDislikes', 'hasLiked', 'hasDisliked'],
    data() {
        return {
            updating: false,
            userHasLiked: false,
            userHasDisliked: false
        }
    },
    validations: {
        content: {
            required
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    methods: {
        validateState() {
            const { $dirty, $error } = this.$v.content;
            return $dirty ? !$error : null;
        },
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
            }, {
                headers: {
                'Authorization': 'Bearer ' + this.currentUser.token
                }
            });
            console.log(response.data);
            this.$emit('comment-deleted');
        },
        startUpdatingComment() {
            this.updating = true;
        },
        async updateComment() {
            this.$v.$touch();
            if (this.$v.$anyError) {
                return;
            }
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('topic');
            const postId = searchUrl.get('id');
            const reqUrl = '/topics/' + topicId + '/posts/' + postId + '/comments/' + this.id;
            const response = await axios.put(reqUrl, {
                userId: this.authorId,
                content: this.content
            }, {
                headers: {
                'Authorization': 'Bearer ' + this.currentUser.token
                }
            });
            console.log(response.data);
            this.updating = false;
            this.$emit('comment-updated');
        },
        async likeComment() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('topic');
            const postId = searchUrl.get('id');
            const reqUrl = '/topics/' + topicId + '/posts/' + postId + '/comments/' + this.id + '/like';
            if (this.userHasLiked) {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: 0
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                    }
                });
                console.log(response.data);
                this.userHasLiked = false;
                this.numberOfLikes--;
            } else {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: 1
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                    }
                });
                console.log(response.data);
                this.userHasLiked = true;
                this.numberOfLikes++;
                if (this.userHasDisliked) {
                    this.userHasDisliked = false;
                }
            }
            this.$emit('comment-liked');
        },
        async dislikeComment() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('topic');
            const postId = searchUrl.get('id');
            const reqUrl = '/topics/' + topicId + '/posts/' + postId + '/comments/' + this.id + '/like';
            if (this.userHasDisliked) {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: 0
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                    }
                });
                console.log(response.data);
                this.userHasDisliked = false;
                this.numberOfDislikes--;
            } else {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: -1
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                    }
                });
                console.log(response.data);
                this.userHasDisliked = true;
                this.numberOfDislikes++;
                if (this.userHasLiked) {
                    this.userHasLiked = false;
                }
            }
            this.$emit('comment-disliked');
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
                .form-group {
                    margin: 0;
                    width: 90%;
                }
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
</style>