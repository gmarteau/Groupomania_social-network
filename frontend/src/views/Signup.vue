<template>
    <div class="signup row">
        <div class="signup__logo col-6">
            <img :src="logoVertical.src" :alt="logoVertical.alt" class="signup__logo__img" />
        </div>

        <div class="signup__form-cont col-6">
            <h1>Créer un compte</h1>

            <form class="signup__form my-4" @submit.prevent="signupSubmit">
                <div class="form-group signup__form__field">
                    <label for="firstName">Prénom*</label>
                    <input class="form-control" type="text" id="firstName" name="firstName" v-model="firstName" placeholder="Marine" required />
                </div>

                <div class="form-group signup__form__field">
                    <label for="lastName">Nom*</label>
                    <input class="form-control" type="text" id="lastName" name="lastName" v-model="lastName" placeholder="Deschamps" required />
                </div>

                <div class="form-group signup__form__field">
                    <label for="bio">Parle-nous de toi!</label>
                    <textarea class="form-control" type="text" id="bio" name="bio" v-model="bio" placeholder="Salut, moi c'est Marine, je travaille dans la section manutention. Hâte de vous rencontrer!"></textarea>
                </div>                   

                <div class="form-group signup__form__field">
                    <label for="username">Username*</label>
                    <input class="form-control" type="text" id="username" name="username" v-model="username" placeholder="mar.desc56" required />
                </div>                        

                <div class="form-group signup__form__field">
                    <label for="email">Email*</label>
                    <input class="form-control" type="email" id="email" name="email" v-model="email" placeholder="marine.deschamps@gmail.com" required />
                </div>

                <div class="form-group signup__form__field">
                    <label for="password">Mot de passe*</label>
                    <input class="form-control" type="password" id="password" name="password" v-model="password" aria-describedby="passwordInstructions" placeholder="ex: g12DfeJs/dj" required />
                    <small id="passwordInstructions" class="form-text text-muted">
                        Le mot de passe doit contenir: <br />
                        <ul>
                            <li>au moins 8 caractères,</li>
                            <li>au moins un caractère en majuscule,</li>
                            <li>au moins un chiffre,</li>
                            <li>au moins un caractère spécial.</li>
                        </ul>
                    </small>
                </div>

                <div class="form-group signup__form__field">
                    <label for="confirmPassword">Confirmer mot de passe*</label>
                    <input class="form-control" type="password" id="confirmPassword" name="confirmPassword" v-model="confirmPassword" placeholder="g12DfeJs/dj" required />
                </div>

                <div class="signup__form__submit my-3">
                    <button type="submit" class="btn">S'inscrire</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'

export default {
    name: 'Signup',
    data() {
        return {
            firstName: '',
            lastName: '',
            bio: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    },
    computed: {
        ...mapState(['logoVertical'])
    },
    methods: {
        async signupSubmit() {
            if (this.password == this.confirmPassword) {
                const response = await axios.post('/users/signup', {
                    username: this.username,
                    password: this.password,
                    email: this.email,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    bio: this.bio
                });
                console.log(response);
                this.$router.push('/login');
            } else {
                window.alert('Les champs \'mot de passe\' doivent être identiques');
            }
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
                width: 30%;
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