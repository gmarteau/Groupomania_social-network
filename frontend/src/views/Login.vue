<template>
    <div class="login row">
        <div class="login__logo col-6 d-none d-lg-block">
            <img :src="logoVertical.src" :alt="logoVertical.alt" class="login__logo__img" />
        </div>

        <div class="login__form-cont col-12 col-lg-6">
            <h1 class="login__title mt-3 mt-md-0">Se connecter</h1>

            <b-form class="login__form my-4" @submit.stop.prevent="loginSubmit" novalidate>
                <b-form-group id="usernameGroup" label="Username / Email" label-for="usernameInput">
                    <b-form-input id="usernameInput" name="usernameInput" v-model="$v.form.username.$model" :state="validateState('username')" aria-describedby="usernameInputFeedback" type="text" placeholder="Username ou email" required></b-form-input>
                    <b-form-invalid-feedback id="usernameInputFeedback" :state="validateState('username')">Ce champ est requis</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="passwordGroup" label="Mot de passe" label-for="passwordInput">
                    <b-form-input id="passwordInput" name="passwordInput" v-model="$v.form.password.$model" :state="validateState('password')" aria-describedby="passwordInputFeedback" type="password" placeholder="Mot de passe" required></b-form-input>
                    <b-form-invalid-feedback id="passwordInputFeedback" :state="validateState('password')">Ce champ est requis</b-form-invalid-feedback>
                </b-form-group>
                
                <div class="login__form__submit my-3">
                    <button type="submit" class="login__form__submit__btn btn px-3 py-1">Se connecter</button>
                </div>
                
                <p class="login__form__invalid text-center font-weight-bold mb-0 text-danger" v-if="invalidIds">Mauvais identifiants</p>
            </b-form>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'Login',
    mixins: [validationMixin],
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            invalidIds: false,
        }
    },
    validations: {
        form: {
            username: {
                required
            },
            password: {
                required
            }
        }
    },
    computed: {
        ...mapState(['logoVertical'])
    },
    methods: {
        validateState(field) {
            const { $dirty, $error } = this.$v.form[field];
            return $dirty ? !$error : null;
        },
        loginSubmit() {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            axios.post('/users/login', {
                username: this.form.username,
                password: this.form.password
            })
                .then(response => {
                    this.$store.dispatch('storeUserAuthInfo', response.data);
                    this.$store.dispatch('changeLoginState');
                    this.$router.push('/');
                })
                .catch(error => {
                    console.log(error);
                    this.invalidIds = true;
                    this.form.username = '';
                    this.form.password = '';
                })
        }
    }
}
</script>

<style lang="scss">

.login {
    &__logo {
        &__img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }
    &__title {
        @media screen and (max-width: 576px) {
            font-size: 2rem;
        }
    }
    &__form-cont {
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    &__form {
        height: auto;
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        &__field {
            display: flex;
            flex-direction: column;
        }
        &__submit {
            width: 100%;
            display: flex;
            justify-content: center;
            .btn {
                background-color: #D1515A;
                color: #fff;
                font-weight: bold;
            }
        }
        @media screen and (max-width: 576px) {
            width: 100%;
        }
        @media screen and (min-width: 576px) and (max-width: 992px) {
            width: 65%;
        }
    }
}

label {
    font-weight: bold;
}

.form-control {
    &:focus {
        border-color: #FFD7D7;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px #FFD7D7;
    }
}
</style>