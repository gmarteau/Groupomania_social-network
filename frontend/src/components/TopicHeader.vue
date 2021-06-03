<template>
    <section class="topicHeader row">
        <div class="topicHeader__bgd col-12"></div>

        <div class="topicHeader__pic col-12 col-lg-2">
            <div class="topicHeader__pic__circle">
                <img class="topicHeader__pic__circle__img" :src="imageUrl" :alt="alt" />
            </div>
        </div>

        <div class="topicHeader__info col-12 col-lg-10 pt-3 mb-5">
            <div class="topicHeader__info__txt">
                <div class="topicHeader__info__txt__hdr">
                    <h1 class="topicHeader__info__txt__hdr__name mb-3">{{ name }}</h1>
                    <b-dropdown class="topicHeader__info__txt__hdr__settings dropdown mx-3 mb-2" toggle-class="text-decoration-none" size="lg" dropright no-caret v-if="currentUser.isAdmin">
                        <template #button-content>
                            <i class="fas fa-cog fa-lg"></i>
                        </template>
                        <b-dropdown-item @click="openConfirmDeleteModal">Supprimer</b-dropdown-item>
                    </b-dropdown>
                </div>

                <b-modal ref="delete-topic-modal" class="topicHeader__modal" title="Admin - Confirmer la suppression du topic" hide-footer>
                    <b-form class="topicHeader__modal__form" @submit.stop.prevent="deleteTopic" novalidate>
                        <b-form-group id="passwordGroup" label="Mot de passe" class="h6" label-for="passwordInput">
                            <b-form-input id="passwordInput" name="passwordInput" v-model="$v.form.password.$model" :state="validateState('password')" aria-describedby="passwordInputFeedback" type="password" placeholder="Mot de passe" required></b-form-input>
                            <b-form-invalid-feedback id="passwordInputFeedback" :state="validateState('password')">Veuillez renseigner le mot de passe administrateur</b-form-invalid-feedback>
                        </b-form-group>

                        <div class="profile__modal__form__submit">
                            <button type="button" class="profile__modal__form__submit__cancel btn py-1 px-3" @click="cancelDeleteTopic">Annuler</button>
                            <button type="submit" class="profile__modal__form__submit__confirm btn py-1 px-3 ml-2">Confirmer</button>
                        </div>
                    </b-form>
                </b-modal>

                <p class="topicHeader__info__description mb-1">{{ description }}</p>
                <p class="topicHeader__info__created">Créé le {{ dateCreation }} par {{ createdBy }}</p>
            </div>
            <button class="topicHeader__info__btn btn mb-2 mb-lg-3 ml-lg-5 mr-lg-3 px-3 py-1 font-weight-bold" v-if="!followed" @click="followTopic"><i class="fas fa-plus mr-1"></i> Suivre</button>
            <button class="topicHeader__info__btn--followed btn mb-2 mb-lg-3 ml-lg-5 mr-lg-3 px-3 py-1 font-weight-bold" v-if="followed" @click="unfollowTopic"><i class="fas fa-check mr-1"></i> Suivi</button>
            <p class="topicHeader__info__followers font-italic">{{ followers }} follower(s)</p>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'TopicHeader',
    mixins: [validationMixin],
    props: ['imageUrl', 'name', 'description', 'createdAt', 'createdBy', 'followed', 'topicId', 'userId', 'followers'],
    data() {
        return {
            form: {
                password: ''
            }
        }
    },
    validations: {
        form: {
            password: {
                required
            }
        }
    },
    computed: {
        alt() {
            return 'Photo du topic ' + this.name;
        },
        dateCreation() {
            return this.createdAt.split('T')[0];
        },
        ...mapGetters(['currentUser'])
    },
    methods: {
        async followTopic() {
            const token = localStorage.getItem('token');
            const reqUrl = '/topics/' + this.topicId + '/follow';
            const response = await axios.post(reqUrl, {
                userId: this.userId,
                follow: 1
            }, {
                headers: {
                'Authorization': 'Bearer ' + token
                }
            });
            console.log(response.data);
            this.$emit('topic-followed');
        },
        async unfollowTopic() {
            const token = localStorage.getItem('token');
            const reqUrl = '/topics/' + this.topicId + '/follow';
            const response = await axios.post(reqUrl, {
                userId: this.userId,
                follow: 0
            }, {
                headers: {
                'Authorization': 'Bearer ' + token
                }
            });
            console.log(response.data);
            this.$emit('topic-unfollowed');
        },
        openConfirmDeleteModal() {
            this.$refs['delete-topic-modal'].show();
        },
        cancelDeleteTopic() {
            this.$refs['delete-topic-modal'].hide();
            this.form.password = '';
        },
        validateState(field) {
            const { $dirty, $error } = this.$v.form[field];
            return $dirty ? !$error : null;
        },
        async deleteTopic() {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            const token = localStorage.getItem('token');
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const topicId = searchUrl.get('id');
            const reqUrl = '/topics/' + topicId;
            const config = {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    password: this.form.password
                }
            };
            const deleteResponse = await axios.delete(reqUrl, config);
            console.log(deleteResponse.data);
            this.$router.push('/');
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
        background-color: #D1515A;
        @media screen and (max-width: 992px) {
            height: 130px;
        }
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
            @media screen and (max-width: 992px) {
                width: 150px;
                height: 150px;
            }
            &__img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    &__info {
        position: relative;
        display: flex;
        align-items: flex-end;
        @media screen and (max-width: 992px) {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        &::after {
            content: '';
            height: 2px;
            width: 75%;
            background-color: #091F43;
            position: absolute;
            bottom: 0;
        }
        &__txt {
            &__hdr {
                display: flex;
                align-items: center;
                @media screen and (max-width: 992px) {
                    justify-content: center;
                }
                &__name {
                    @media screen and (max-width: 576px) {
                        font-size: 2rem;
                    }
                }
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
        &__btn {
            background-color: #D1515A;
            color: #fff;
            &:hover {
                color: #fff;
                background-color: #091F43;
            }
            &--followed {
                color: #fff;
                background-color: #091F43;
                &:hover {
                    color: #fff;
                }
            }
        }
    }
}
</style>