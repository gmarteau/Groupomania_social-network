<template>
    <div class="post container px-2 pb-1">
        <router-link :to="postDetails" class="post__header row">
            <div class="post__header__pic col-3 col-md-2 col-lg-1">
                <div class="post__header__pic__circle">
                    <img class="post__header__pic__img" :src="imageUrl" alt="Photo de profil de l'utilisateur" />
                </div>
            </div>
            <div class="post__header__txt col-7 col-md-8 col-lg-10 py-2 py-md-0 px-0">
                <router-link :to="userProfile" class="post__header__txt__username font-weight-bold mb-0 mr-3">{{ firstName }} {{ lastName }} <span class="font-weight-normal">/{{ username }}</span></router-link>
                <p class="post__header__txt__topic mb-0" v-if="topic">@<router-link :to="href" class="text-white">{{ topic }}</router-link></p>
            </div>
            <div class="post__header__modify col-2 col-lg-1" v-if="(currentUser.id == authorId) || currentUser.isAdmin">
                <b-dropdown class="post__header__modify__button dropdown" toggle-class="text-decoration-none" size="lg" dropleft no-caret aria-label="Modifier ou supprimer">
                    <template #button-content>
                        <i class="fas fa-ellipsis-h" aria-label="Modifier ou supprimer"></i>
                    </template>
                    <b-dropdown-item @click="startUpdatingPost" v-if="currentUser.id == authorId">Modifier</b-dropdown-item>
                    <b-dropdown-divider v-if="currentUser.id == authorId"></b-dropdown-divider>
                    <b-dropdown-item @click="deletePost" v-if="(currentUser.id == authorId) || currentUser.isAdmin">Supprimer</b-dropdown-item>
                </b-dropdown>
            </div>
        </router-link>
        <div class="post__body row m-0">
            <p class="post__body__content col-12 pt-3" v-if="!updating">
                {{ content }}
            </p>

            <b-form id="updatePostForm" class="post__body__update col-12 py-3" @submit.stop.prevent="updatePost" v-if="updating" novalidate>
                <b-form-group id="updatePostGroup">
                    <b-form-textarea id="updatePostInput" name="updatePostInput" v-model="$v.content.$model" :state="validateState()" aria-describedby="updatePostInputFeedback" aria-label="Modifier le post" type="text" required></b-form-textarea>
                    <b-form-invalid-feedback id="updatePostInputFeedback" :state="validateState()">Écrivez du contenu pour pouvoir le publier</b-form-invalid-feedback>
                </b-form-group>
                <div class="post__body__update__submit">
                    <button type="submit" class="post__body__update__submit__btn btn px-3 py-1 ml-3 d-none d-lg-block">
                        Publier
                    </button>
                    <button type="submit" class="post__body__update__submit__btn btn px-2 py-1 ml-3 d-lg-none" aria-label="Publier">
                        <i class="fas fa-check fa-xs"></i>
                    </button>
                </div>
            </b-form>
        </div>
        <div class="row m-0">
            <div class="post__footer col px-0">
                <div class="post__footer__likes mx-2">
                    <button class="post__footer__likes__btn btn px-1" @click="likePost" aria-label="Like">
                        <i class="far fa-thumbs-up post__footer__likes__btn--null" v-if="!userHasLiked"></i>
                        <i class="far fa-thumbs-up post__footer__likes__btn--active" v-if="userHasLiked"></i>
                    </button>
                    <p class="post__footer__likes__number mb-0">{{ numberOfLikes }}</p>
                </div>
                <div class="post__footer__dislikes mx-2">
                    <button class="post__footer__dislikes__btn btn px-1" @click="dislikePost" aria-label="Dislike">
                        <i class="far fa-thumbs-down post__footer__dislikes__btn--null" v-if="!userHasDisliked"></i>
                        <i class="far fa-thumbs-down post__footer__dislikes__btn--active" v-if="userHasDisliked"></i>
                    </button>
                    <p class="post__footer__dislikes__number mb-0">{{ numberOfDislikes }}</p>
                </div>
                <router-link :to="postDetails" class="post__footer__comments mb-0 ml-3">{{ numberOfComments }} commentaires</router-link>
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
    name: 'Post',
    mixins: [validationMixin],
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
        async deletePost() {
            const token = localStorage.getItem('token');
            const reqUrl = '/topics/' + this.topicId + '/posts/' + this.id;
            const config = {
                headers: {
                'Authorization': 'Bearer ' + token
                },
                data: {
                    userId: this.authorId
                }
            };
            const response = await axios.delete(reqUrl, config);
            console.log(response.data);
            this.$emit('post-deleted');
        },
        startUpdatingPost() {
            this.updating = true;
        },
        async updatePost() {
            this.$v.$touch();
            if (this.$v.$anyError) {
                return;
            }
            const token = localStorage.getItem('token');
            const reqUrl = '/topics/' + this.topicId + '/posts/' + this.id;
            const response = await axios.put(reqUrl, {
                userId: this.authorId,
                content: this.content  
            }, {
                headers: {
                'Authorization': 'Bearer ' + token
                }
            });
            console.log(response.data);
            this.updating = false;
            this.$emit('post-updated');
        },
        async likePost() {
            const token = localStorage.getItem('token');
            const reqUrl = '/topics/' + this.topicId + '/posts/' + this.id + '/like';
            if (this.userHasLiked) {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: 0
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + token
                    }
                });
                console.log(response.data);
            } else {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: 1
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + token
                    }
                });
                console.log(response.data);
            }
            this.$emit('post-liked');
        },
        async dislikePost() {
            const token = localStorage.getItem('token');
            const reqUrl = '/topics/' + this.topicId + '/posts/' + this.id + '/like';
            if (this.userHasDisliked) {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: 0
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + token
                    }
                });
                console.log(response.data);
            } else {
                const response = await axios.post(reqUrl, {
                    userId: this.currentUser.id,
                    like: -1
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + token
                    }
                });
                console.log(response.data);
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
    @media screen and (max-width: 576px) {
        font-size: .9rem;;
    }
    &__header {
        height: 50px;
        background-color: #091F43;
        color: #fff;
        position: relative;
        @media screen and (max-width: 992px) {
            height: auto;
            min-height: 50px;
        }
        &:hover {
            color: #fff;
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
                color: #fff;
                @media screen and (max-width: 576px) {
                    display: flex;
                    flex-direction: column;
                }
                &:hover {
                    color: #fff;
                }
            }
            &__topic {
                @media screen and (max-width: 576px) {
                    position: absolute;
                    bottom: 5px;
                    right: -30px;
                }
            }
        }
        &__modify {
            display: flex;
            justify-content: center;
            align-items: center;
            @media screen and (max-width: 576px) {
                position: absolute;
                right: 0;
            }
            &__button {
                width: 30px;
                height: 30px;
                .btn {
                    background-color: #091F43;
                    color: #fff;
                    border: none;
                }
            }
        }
    }
    &__body {
        &__update {
            min-width: 100%;
            display: flex;
            align-items: center;
            .form-group {
                margin: 0;
                width: 90%;
            }
            &__submit {
                &__btn {
                    background-color: #091F43;
                    color: #fff;
                    font-weight: bold;
                    &:hover {
                        background-color: #D1515A;
                        color: #fff;
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
                    color: #091F43;
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
                    color: #D1515A;
                }
            }
        }
        &__comments {
            color: #000;
            &:hover {
                color: #000;
            }
        }
    }
}

.btn {
    padding: 0;
}
</style>