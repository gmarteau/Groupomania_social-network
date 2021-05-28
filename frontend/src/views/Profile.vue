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
                    <h1 class="profile__info__header__name mr-md-3"><span class="font-weight-bold">{{ user.firstName }} {{ user.lastName }}</span> /{{ user.username }}</h1>
                    <b-dropdown class="profile__info__header__settings dropdown" toggle-class="text-decoration-none" size="lg" dropright no-caret v-if="(userId == currentUser.id) && !currentUser.isAdmin">
                        <template #button-content>
                            <i class="fas fa-cog fa-lg"></i>
                        </template>
                        <b-dropdown-item @click="startUpdatingProfile">Modifier mes informations</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item @click="openConfirmDeleteModal">Supprimer mon compte</b-dropdown-item>
                    </b-dropdown>
                </div>

                <b-modal ref="delete-profile-modal" class="profile__modal" title="Confirmer la suppression du compte" hide-footer>
                    <b-form class="profile__modal__form" @submit.stop.prevent="deleteProfile" novalidate>
                        <b-form-group id="passwordGroup" label="Mot de passe" class="h6" label-for="passwordInput">
                            <b-form-input id="passwordInput" name="passwordInput" v-model="$v.deleteForm.password.$model" :state="validateStateDelete('password')" aria-describedby="passwordInputFeedback" type="password" placeholder="Mot de passe" required></b-form-input>
                            <b-form-invalid-feedback id="passwordInputFeedback" :state="validateStateDelete('password')">Veuillez renseigner votre mot de passe</b-form-invalid-feedback>
                        </b-form-group>

                        <div class="profile__modal__form__submit">
                            <button type="button" class="profile__modal__form__submit__cancel btn py-1 px-3" @click="cancelDeleteProfile">Annuler</button>
                            <button type="submit" class="profile__modal__form__submit__confirm btn py-1 px-3 ml-2">Confirmer</button>
                        </div>
                    </b-form>
                </b-modal>

                <p class="profile__info__date text-center">Membre depuis le {{ dateCreation }}</p>
                <p class="profile__info__bio text-center h4 mt-lg-5">{{ user.bio }}</p>
            </section>

            <aside class="profile__followed mt-3 mt-lg-5">
                <TopicsList listName="followed" :userId="userId" class="profile__followed__list" />
            </aside>
        </div>

        <div class="profile__updating col-12" v-if="updating">
            <h1 class="profile__updating__title text-center my-5">Modifier mes informations</h1>

            <b-form class="profile__updating__form" @submit.stop.prevent="updateUserProfile" novalidate>
                <b-form-group id="imageGroup" label="Changer la photo de profil" class="h4" label-for="imageInput">
                    <b-form-file id="imageInput" name="imageInput" class="h6" v-model="$v.updateForm.image.$model" :state="validateState('image')" @change="changeProfilePicture" aria-describedby="imageInputFeedback" type="file" accept="image/png, image/jpg, image/jpeg" placeholder="Choisir une image ou la glisser ici..." drop-placeholder="Faire glisser l'image ici..."></b-form-file>
                    <b-form-invalid-feedback id="imageInputFeedback" :state="validateState('image')">L'ajout d'une image est requis</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="firstNameGroup" label="Prénom" class="h4" label-for="firstNameInput">
                    <b-form-input id="firstNameInput" name="firstNameInput" v-model="$v.updateForm.firstName.$model" :state="validateState('firstName')" aria-describedby="firstNameInputFeedback" type="text" required></b-form-input>
                    <b-form-invalid-feedback id="firstNameInputFeedback" :state="validateState('firstName')">Ce champ est requis et ne doit contenir aucun chiffre ou caractère spécial</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="lastNameGroup" label="Nom" class="h4" label-for="lastNameInput">
                    <b-form-input id="lastNameInput" name="lastNameInput" v-model="$v.updateForm.lastName.$model" :state="validateState('lastName')" aria-describedby="lastNameInputFeedback" type="text" required></b-form-input>
                    <b-form-invalid-feedback id="lastNameInputFeedback" :state="validateState('lastName')">Ce champ est requis et ne doit contenir aucun chiffre ou caractère spécial</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="usernameGroup" label="Username" class="h4" label-for="usernameInput">
                    <b-form-input id="usernameInput" name="usernameInput" v-model="username" :state="true" type="text" disabled></b-form-input>
                </b-form-group>

                <b-form-group id="emailGroup" label="Email" class="h4" label-for="emailInput">
                    <b-form-input id="emailInput" name="emailInput" v-model="email" :state="true" type="email" disabled></b-form-input>
                </b-form-group>

                <b-form-group id="bioGroup" label="Bio" class="h4" label-for="bioInput">
                    <b-form-textarea id="bioInput" name="bioInput" v-model="updateForm.bio" type="text"></b-form-textarea>
                </b-form-group>

                <div class="profile__updating__form__submit">
                    <div class="profile__updating__form__submit__cancel my-3 my-lg-5 mx-3 text-center">
                        <button type="submit" class="profile__updating__form__submit__cancel__btn btn py-1 px-3" @click="cancelUpdate">Annuler</button>
                    </div>

                    <div class="profile__updating__form__submit__save my-3 my-lg-5 mx-3 text-center">
                        <button type="submit" class="profile__updating__form__submit__save__btn btn py-1 px-3">Enregistrer</button>
                    </div>
                </div>
            </b-form>
        </div>
    </div>
</template>

<script>
import TopicsList from '../components/TopicsList'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, alpha } from 'vuelidate/lib/validators'

export default {
    name: 'Profile',
    mixins: [validationMixin],
    components: {
        TopicsList
    },
    data() {
        return {
            userId: 0,
            user: '',
            updating: false,
            username: '',
            email: '',
            changePicture: false,
            updateForm: {
                firstName: '',
                lastName: '',
                bio: '',
                image: '',
            },
            deleteForm: {
                password: ''
            }
        }
    },
    validations: {
        updateForm: {
            firstName: {
                required,
                alpha
            },
            lastName: {
                required,
                alpha
            },
            image: {
                required
            }
        },
        deleteForm: {
            password: {
                required
            }
        }
    },
    computed: {
        alt() {
            return 'Photo de profil de ' + this.user.firstName + ' ' + this.user.lastName
        },
        dateCreation() {
            return this.user.createdAt.split('T')[0];
        },
        ...mapGetters(['currentUser', 'loggedIn'])
    },
    methods: {
        startUpdatingProfile() {
            this.updating = true;
        },
        changeProfilePicture() {
            this.changePicture = true;
        },
        cancelUpdate() {
            this.updating = false;
        },
        validateState(field) {
            const { $dirty, $error } = this.$v.updateForm[field];
            return $dirty ? !$error : null;
        },
        validateStateDelete(field) {
            const { $dirty, $error } = this.$v.deleteForm[field];
            return $dirty ? !$error : null;
        },
        async updateUserProfile() {
            this.$v.updateForm.$touch();
            if (this.$v.updateForm.$anyError) {
                return;
            }
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const userId = searchUrl.get('id');
            const reqUrl = '/users/' + userId;
            if (this.changePicture) {
                console.log('leasd');
                const formData = new FormData();
                formData.append('firstName', this.updateForm.firstName);
                formData.append('lastName', this.updateForm.lastName);
                formData.append('bio', this.updateForm.bio);
                formData.append('image', this.updateForm.image);
                const putResponse = await axios.put(reqUrl, formData, {
                    headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                    }
                });
                console.log(putResponse.data);
            } else {
                const putResponse = await axios.put(reqUrl, {
                    firstName: this.updateForm.firstName,
                    lastName: this.updateForm.lastName,
                    bio: this.updateForm.bio
                }, {
                    headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                    }
                });
                console.log(putResponse.data);
            }
            const profileRefreshed = await axios.get(reqUrl, {
                headers: {
                'Authorization': 'Bearer ' + this.currentUser.token
                }
            });
            this.user = profileRefreshed.data;
            this.updating = false;
        },
        openConfirmDeleteModal() {
            this.$refs['delete-profile-modal'].show();
        },
        cancelDeleteProfile() {
            this.$refs['delete-profile-modal'].hide();
            this.deleteForm.password = '';
        },
        async deleteProfile() {
            this.$v.deleteForm.$touch();
            if (this.$v.deleteForm.$anyError) {
                return;
            }
            const url = window.location.search;
            const searchUrl = new URLSearchParams(url);
            const userId = searchUrl.get('id');
            const reqUrl = '/users/' + userId;
            const config = {
                headers: {
                    'Authorization': 'Bearer ' + this.currentUser.token
                },
                data: {
                    password: this.deleteForm.password
                }
            };
            const deleteResponse = await axios.delete(reqUrl, config);
            console.log(deleteResponse.data);
            this.currentUser.id = 0;
            this.currentUser.token = '';
            this.$store.dispatch('changeLoginState');
            this.$router.push('/');
        }
    },
    async beforeMount() {
        if (!this.loggedIn) {
            this.$router.push('/');
        }
        const url = window.location.search;
        const searchUrl = new URLSearchParams(url);
        const userId = searchUrl.get('id');
        this.userId = parseInt(userId);
        const reqUrl = '/users/' + userId;
        const response = await axios.get(reqUrl, {
            headers: {
            'Authorization': 'Bearer ' + this.currentUser.token
            }
        });
        this.user = response.data;
        this.updateForm.firstName = this.user.firstName;
        this.updateForm.lastName = this.user.lastName;
        this.username = this.user.username;
        this.email = this.user.email;
        this.updateForm.bio = this.user.bio;
        this.updateForm.image = this.user.profilePicture;
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
        @media screen and (max-width: 992px) {
            height: 130px;
        }
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
        &__header {
            display: flex;
            justify-content: center;
            align-items: center;
            @media screen and (max-width: 576px) {
                flex-direction: column;
                text-align: center;
            }
            &__name {
                @media screen and (max-width: 992px) {
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
        &__bio {
            @media screen and (max-width: 992px) {
                font-size: 1.25rem;
            }
        }
    }
    &__followed {
        display: flex;
        justify-content: center;
        &__list {
            width: 50%;
            @media screen and (max-width: 576px) {
                width: 100%;
            }
            @media screen and (min-width: 576px) and (max-width: 992px) {
                width: 75%;
            }
        }
    }
    &__updating {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &__title {
            @media screen and (max-width: 992px) {
                font-size: 2rem;
            }
        }
        &__form {
            width: 50%;
            @media screen and (max-width: 576px) {
                width: 100%;
            }
            @media screen and (min-width: 576px) and (max-width: 992px) {
                width: 75%;
            }
            label {
                @media screen and (max-width: 992px) {
                    font-size: 1.25rem;
                }
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