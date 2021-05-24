<template>
    <div class="signup row">
        <div class="signup__logo col-6">
            <img :src="logoVertical.src" :alt="logoVertical.alt" class="signup__logo__img" />
        </div>

        <div class="signup__form-cont col-6">
            <h1>Créer un compte</h1>

            <b-form class="signup__form my-4" @submit.stop.prevent="signupSubmit" novalidate>
                <b-form-group id="firstNameGroup" label="Prénom*" label-for="firstNameInput">
                    <b-form-input id="firstNameInput" name="firstNameInput" v-model="$v.form.firstName.$model" :state="validateState('firstName')" aria-describedby="firstNameInputFeedback" type="text" placeholder="Marine" required></b-form-input>
                    <b-form-invalid-feedback id="firstNameInputFeedback" :state="validateState('firstName')">Ce champ est requis et ne doit contenir aucun chiffre ou caractère spécial</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="lastNameGroup" label="Nom*" label-for="lastNameInput">
                    <b-form-input id="lastNameInput" name="lastNameInput" v-model="$v.form.lastName.$model" :state="validateState('lastName')" aria-describedby="lastNameInputFeedback" type="text" placeholder="Deschamps" required></b-form-input>
                    <b-form-invalid-feedback id="lastNameInputFeedback" :state="validateState('lastName')">Ce champ est requis et ne doit contenir aucun chiffre ou caractère spécial</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="bioGroup" label="Parle-nous de toi!" label-for="bioInput">
                    <b-form-textarea id="bioInput" name="bioInput" v-model="form.bio" type="text" placeholder="Salut, moi c'est Marine, je travaille dans la section manutention. Hâte de vous rencontrer!"></b-form-textarea>
                </b-form-group>

                <b-form-group id="usernameGroup" label="Username*" label-for="usernameInput">
                    <b-form-input id="usernameInput" name="usernameInput" v-model="$v.form.username.$model" :state="validateState('username')" aria-describedby="usernameInputFeedback" type="text" placeholder="mar.desc56" required></b-form-input>
                    <b-form-invalid-feedback id="usernameInputFeedback" :state="validateState('username')">Ce champ est requis</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="emailGroup" label="Email*" label-for="emailInput">
                    <b-form-input id="emailInput" name="emailInput" v-model="$v.form.email.$model" :state="validateState('email')" aria-describedby="emailInputFeedback" type="email" placeholder="marine.deschamps@gmail.com" required></b-form-input>
                    <b-form-invalid-feedback id="emailInputFeedback" :state="validateState('email')">Ce champ est requis et doit respecter le format email (*****@****.**)</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="passwordGroup" label="Mot de passe*" label-for="passwordInput">
                    <b-form-input id="passwordInput" name="passwordInput" v-model="$v.form.password.$model" :state="validateState('password')" aria-describedby="passwordInstructions" type="password" placeholder="ex: g12DfeJs/dj" required></b-form-input>
                    <b-form-invalid-feedback id="passwordInputFeedback" :state="validateState('password')">Ce champ est requis et doit respecter les instructions ci-dessous</b-form-invalid-feedback>
                    <small id="passwordInstructions" class="form-text text-muted">
                        Le mot de passe doit contenir: <br />
                        <ul>
                            <li>au moins 8 caractères,</li>
                            <li>au moins un caractère en majuscule,</li>
                            <li>au moins un chiffre,</li>
                            <li>au moins un caractère spécial.</li>
                        </ul>
                    </small>
                </b-form-group>

                <b-form-group id="confirmPasswordGroup" label="Confirmer le mot de passe*" label-for="confirmPasswordInput">
                    <b-form-input id="confirmPasswordInput" name="confirmPasswordInput" v-model="$v.form.confirmPassword.$model" :state="validateState('confirmPassword')" aria-describedby="confirmPasswordInputFeedback" type="password" placeholder="g12DfeJs/dj" required></b-form-input>
                    <b-form-invalid-feedback id="confirmPasswordInputFeedback" :state="validateState('confirmPassword')">Ce champ est requis et doit être identique au champ 'Mot de passe' précédent</b-form-invalid-feedback>
                </b-form-group>

                <div class="signup__form__submit my-3">
                    <button type="submit" class="btn px-3 py-1">S'inscrire</button>
                </div>
            </b-form>
        </div>
    </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, alpha, email, minLength, sameAs } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
import axios from 'axios'
const respectRegExp = (password) => {
    if (/[A-Z]/.test(password)) {
        if (/[0-9]/.test(password)) {
            if(/[@#\\$&?!/]/.test(password)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export default {
    name: 'Signup',
    mixins: [validationMixin],
    data() {
        return {
            form: {
                firstName: '',
                lastName: '',
                bio: '',
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            }
        }
    },
    validations: {
        form: {
            firstName: {
                required,
                alpha
            },
            lastName: {
                required,
                alpha
            },
            username: {
                required
            },
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(8),
                respectRegExp
            },
            confirmPassword: {
                sameAsPassword: sameAs('password')
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
        signupSubmit() {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            axios.post('/users/signup', {
                username: this.form.username,
                password: this.form.password,
                email: this.form.email,
                firstName: this.form.firstName,
                lastName: this.form.lastName,
                bio: this.form.bio
            })
                .then(response => {
                    console.log(response);
                    this.$router.push('/login');
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }
}
</script>

<style lang="scss">

.signup {
    &__logo {
        &__img {
            max-height: 100%;
            max-width: 100%;
            object-fit: cover;
        }
    }
    &__form-cont {
        height: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
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
                background-color: #FD370D;
                color: #fff;
                font-weight: bold;
            }
        }
    }
}

textarea {
    resize: none;
    height: 100px;
}

label {
    font-weight: bold;
}
</style>