<template>
    <div class="newTopic row">
        <div class="newTopic__container col-12 col-lg-5">
            <h1 class="newTopic__title mt-3 mb-4 mt-md-0 mb-md-5 text-center">Créer un nouveau topic</h1>

            <b-form class="newTopic__form" @submit.stop.prevent="createNewTopic" novalidate>
                <b-form-group id="nameGroup" label="Nom du topic" class="h4 mb-1" label-for="nameInput">
                    <b-form-input id="nameInput" name="nameInput" v-model="$v.form.name.$model" :state="validateState('name')" aria-describedby="nameInputFeedback" type="text" placeholder="Un nom court résumant votre topic" required></b-form-input>
                    <b-form-invalid-feedback id="nameInputFeedback" :state="validateState('name')">Ce champ est requis</b-form-invalid-feedback>
                </b-form-group>

                <p class="text-center font-weight-bold mb-0 text-danger" v-if="nameAlreadyExists">Un topic porte déjà ce nom</p>

                <b-form-group id="descriptionGroup" label="Description" class="h4 my-4" label-for="descriptionInput">
                    <b-form-textarea id="descriptionInput" name="descriptionInput" v-model="$v.form.description.$model" :state="validateState('description')" aria-describedby="descriptionInputFeedback" type="text" placeholder="Décrivez plus en détail le sujet de votre topic" rows="3" required></b-form-textarea>
                    <b-form-invalid-feedback id="descriptionInputFeedback" :state="validateState('description')">Ce champ est requis</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="imageGroup" class="newTopic__form__image h4 mb-4" label-for="imageInput">
                    <p class="mb-1">Ajoutez une image</p>
                    <b-form-file id="imageInput" name="imageInput" class="h6" v-model="$v.form.image.$model" :state="validateState('image')" aria-describedby="imageInputFeedback" aria-hidden="true" type="file" accept="image/png, image/jpg, image/jpeg" placeholder="Choisir une image ou la glisser ici..." drop-placeholder="Faire glisser l'image ici..." required></b-form-file>
                    <b-form-invalid-feedback id="imageInputFeedback" :state="validateState('image')">L'ajout d'une image est requis</b-form-invalid-feedback>
                </b-form-group>

                <div class="newTopic__form__submit my-5 text-center">
                    <button type="submit" class="newTopic__form__submit__btn btn py-1 px-3">Créer</button>
                </div>
            </b-form>
        </div>                  
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'NewTopic',
    mixins: [validationMixin],
    data() {
        return {
            form: {
                name: '',
                description: '',
                image: ''
            },
            nameAlreadyExists: false
        }
    },
    validations: {
        form: {
            name: {
                required
            },
            description: {
                required
            },
            image: {
                required
            }
        }
    },
    computed: {
        ...mapGetters(['currentUser', 'loggedIn'])
    },
    methods: {
        getUserImage() {
            this.image = document.getElementById('image').files[0];
        },
        validateState(field) {
            const { $dirty, $error } = this.$v.form[field];
            return $dirty ? !$error : null;
        },
        createNewTopic() {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            const formData = new FormData();
            formData.append('userId', this.currentUser.id);
            formData.append('name', this.form.name);
            formData.append('description', this.form.description);
            formData.append('image', this.form.image);
            const token = localStorage.getItem('token');
            axios.post('/topics', formData, {
                headers: {
                'Authorization': 'Bearer ' + token
                }
            })
                .then(response => {
                    const newTopicUrl = '/topic?id=' + response.data.topicId;
                    this.$router.push(newTopicUrl);
                })
                .catch(error => {
                    console.log(error);
                    this.nameAlreadyExists = true;
                    document.getElementById('nameInput').classList.replace('is-valid', 'is-invalid');
                })
        }
    },
    beforeMount() {
        if (!localStorage.getItem('token')) {
            this.$store.dispatch('changeLoginState', false);
        } else {
            this.$store.dispatch('changeLoginState', true);
            this.$store.dispatch('storeUserId', parseInt(localStorage.getItem('userId')));
            const isAdmin = (localStorage.getItem('admin') === 'true') ? true : false;
            this.$store.dispatch('storeIsAdmin', isAdmin);
        }
    }
}
</script>

<style lang="scss">

.newTopic {
    display: flex;
    justify-content: center;
    &__container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    &__title {
        @media screen and (max-width: 992px) {
            font-size: 2rem;
        }
    }
    &__form {
        width: 100%;
        @media screen and (min-width: 576px) and (max-width: 992px) {
            width: 75%;
        }
        label {
            @media screen and (max-width: 992px) {
                font-size: 1.25rem;
            }
        }
        &__image {
            .custom-file-label {
                &:hover {
                    cursor: pointer;
                }
            }
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
</style>