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
                        <b-dropdown-item @click="openConfirmDeleteModal">Supprimer mon compte</b-dropdown-item>
                    </b-dropdown>
                </div>

                <b-modal ref="delete-profile-modal" class="profile__modal" title="Confirmer la suppression du compte" hide-footer>
                    <form class="profile__modal__form" @submit.prevent="deleteProfile">
                        <div class="form-group profile__modal__form__password">
                            <label for="password" class="font-weight-bold mb-1">Mot de passe</label>
                            <input class="form-control" type="password" id="password" name="password" v-model="password" placeholder="Mot de passe" required />
                        </div>

                        <div class="profile__modal__form__submit">
                            <button type="button" class="profile__modal__form__submit__cancel btn py-1 px-3" @click="cancelDeleteProfile">Annuler</button>
                            <button type="submit" class="profile__modal__form__submit__confirm btn py-1 px-3 ml-2">Confirmer</button>
                        </div>
                    </form>
                </b-modal>

                <p class="profile__info__date text-center">Membre depuis le {{ dateCreation }}</p>
                <p class="profile__info__bio text-center h4 mt-5">{{ user.bio }}</p>
            </section>

            <aside class="profile__followed mt-5">
                <TopicsList listName="followed" :userId="userId" class="profile__followed__list" />
            </aside>
        </div>

        <div class="profile__updating col-12" v-if="updating">
            <h1 class="profile__updating__title text-center my-5">Modifier mes informations</h1>

            <form class="profile__updating__form" @submit.prevent="updateUserProfile">
                <div class="profile__updating__form__pic form-group mb-4">
                    <label for="image" class="h4 mb-3">Changer la photo de profil</label>
                    <input type="file" id="image" name="image" accept="image/png, image/jpg, image/jpeg" @change="changeProfilePicture" />
                </div>

                <div class="form-group mb-4">
                    <label for="firstName" class="h4 mb-3">Prénom</label>
                    <input type="text" class="form-control" name="firstName" id="firstName" v-model="firstName" required />
                </div>

                <div class="form-group mb-4">
                    <label for="lastName" class="h4 mb-3">Nom</label>
                    <input class="form-control" type="text" id="lastName" name="lastName" v-model="lastName" required />
                </div>

                <div class="form-group mb-4">
                    <label for="username" class="h4 mb-3">Username</label>
                    <input class="form-control" type="text" id="username" name="username" v-model="username" disabled />
                </div>

                <div class="form-group mb-4">
                    <label for="bio" class="h4 mb-3">Bio</label>
                    <textarea class="form-control" type="text" id="bio" name="bio" v-model="bio" required></textarea>
                </div>

                <div class="profile__updating__form__submit">
                    <div class="profile__updating__form__submit__cancel my-5 mx-3 text-center">
                        <button type="submit" class="profile__updating__form__submit__cancel__btn btn py-1 px-3" @click="cancelUpdate">Annuler</button>
                    </div>

                    <div class="profile__updating__form__submit__save my-5 mx-3 text-center">
                        <button type="submit" class="profile__updating__form__submit__save__btn btn py-1 px-3">Enregistrer</button>
                    </div>
                </div>
            </form>
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
            updating: false,
            firstName: '',
            lastName: '',
            username: '',
            bio: '',
            image: '',
            changePicture: false,
            password: ''
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
        },
        changeProfilePicture() {
            this.changePicture = true;
            this.image = document.getElementById('image').files[0];
        },
        cancelUpdate() {
            this.updating = false;
        },
        async updateUserProfile() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const userId = searchUrl.get('id');
            const reqUrl = '/users/' + userId;
            if (this.changePicture) {
                const formData = new FormData();
                formData.append('firstName', this.firstName);
                formData.append('lastName', this.lastName);
                formData.append('bio', this.bio);
                formData.append('image', this.image);
                const putResponse = await axios.put(reqUrl, formData);
                console.log(putResponse.data);
            } else {
                const putResponse = await axios.put(reqUrl, {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    bio: this.bio
                });
                console.log(putResponse.data);
            }
            console.log('la');
            const profileRefreshed = await axios.get(reqUrl);
            this.user = profileRefreshed.data;
            this.updating = false;
        },
        openConfirmDeleteModal() {
            this.$refs['delete-profile-modal'].show();
        },
        cancelDeleteProfile() {
            this.$refs['delete-profile-modal'].hide();
            this.password = '';
        },
        async deleteProfile() {
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const userId = searchUrl.get('id');
            const reqUrl = '/users/' + userId;
            const deleteResponse = await axios.delete(reqUrl, {
                data: {
                    password: this.password
                }
            });
            console.log(deleteResponse.data);
            this.currentUser.id = 0;
            this.currentUser.token = '';
            this.$store.dispatch('changeLoginState');
            this.$router.push('/');
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
        this.firstName = this.user.firstName;
        this.lastName = this.user.lastName;
        this.username = this.user.username;
        this.bio = this.user.bio;
        this.image = this.user.profilePicture;
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
    &__updating {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &__form {
            width: 50%;
            &__pic {
                display: flex;
                flex-direction: column;
            }
            &__submit {
                display: flex;
                justify-content: center;
                &__save {
                    &__btn {
                        background-color: #FD3C13;
                        border: solid 2px #FD3C13;
                        color: #fff;
                        font-weight: bold;
                        &:hover {
                            background-color: #FFD7D7;
                            color: #FD3C13;
                            border: solid 2px #FFD7D7;
                        }
                    }
                }
                &__cancel {
                    &__btn {
                        border: solid 2px #FD3C13;
                        color: #FD3C13;
                        font-weight: bold;
                        &:hover {
                            background-color: #FD3C13;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
    &__modal {
        &__form {
            &__submit {
                display: flex;
                justify-content: flex-end;
                &__cancel {
                    border: solid 2px #FD3C13;
                    color: #FD3C13;
                    font-weight: bold;
                    &:hover {
                        background-color: #FD3C13;
                        color: #fff;
                    }
                }
                &__confirm {
                    background-color: #FD3C13;
                    border: solid 2px #FD3C13;
                    color: #fff;
                    font-weight: bold;
                    &:hover {
                        background-color: #FFD7D7;
                        color: #FD3C13;
                        border: solid 2px #FFD7D7;
                    }                   
                }
            }
        }
    }
}
</style>