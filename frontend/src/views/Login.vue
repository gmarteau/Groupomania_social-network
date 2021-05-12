<template>
    <div class="login row">
        <div class="login__logo col-6">
            <img :src="logoVertical.src" :alt="logoVertical.alt" class="login__logo__img" />
        </div>

        <div class="login__form-cont col-6">
            <h1>Se connecter</h1>

            <form class="login__form my-4" @submit.prevent="loginSubmit">
                <div class="form-group login__form__field">
                    <label for="username">Username / Email</label>
                    <input class="form-control" type="text" id="username" name="username" v-model="username" placeholder="Username ou email" required />
                </div>                        

                <div class="form-group login__form__field">
                    <label for="password">Mot de passe</label>
                    <input class="form-control" type="password" id="password" name="password" v-model="password" placeholder="Mot de passe" required />
                </div>

                <div class="login__form__submit my-3">
                    <button type="submit" class="btn">Se connecter</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'

export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: ''
        }
    },
    computed: {
        ...mapState(['logoVertical'])
    },
    methods: {
        async loginSubmit() {
            const response = await axios.post('/users/login', {
                username: this.username,
                password: this.password
            });
            this.$store.dispatch('storeUserAuthInfo', response.data);
            this.$store.dispatch('changeLoginState');
            this.$router.push('/');
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
                background-color: #FD370D;
                color: #fff;
                width: 30%;
            }
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