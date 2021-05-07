<template>
    <header>
        <nav class="navbar navbar-expand-lg" v-if="!loggedIn">
            <router-link to="/" class="navbar-brand"><img class="navbar-brand__img" :src="logo.src" :alt="logo.alt" /></router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContentNotLogged" aria-controls="navbarContentNotLogged" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarContentNotLogged">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item mx-3">
                        <router-link to="/login" class="nav-link text-dark font-weight-bold">Se connecter</router-link>
                    </li>
                    <li class="nav-item mx-3">
                        <router-link to="/signup" class="nav-link text-dark font-weight-bold">S'inscrire</router-link>
                    </li>
                </ul>
            </div> 
        </nav>

        <nav class="navbar navbar-expand-lg" v-if="loggedIn">
            <router-link to="/" class="navbar-brand"><img class="navbar-brand__img" :src="logo.src" :alt="logo.alt" /></router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContentLoggedIn" aria-controls="navbarContentLoggedIn" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarContentLoggedIn">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item mx-3">
                        <a href="javascript:void(0);" class="nav-link text-dark font-weight-bold" @click="logout">Se déconnecter</a>
                    </li>
                </ul>
            </div> 
        </nav>
    </header>
</template>

<script>

import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
    name: 'HeaderNav',
    computed: {
        ...mapState(['logo']),
        ...mapGetters(['loggedIn', 'currentUser'])
    },
    methods: {
        logout() {
            this.currentUser.id = 0;
            this.currentUser.token = '';
            this.$store.dispatch('changeLoginState');
            // this.$router.push('/');
        }
    }
}
</script>

<style lang="scss">

header {
    box-shadow: 0px 2px 10px #D7FFFF;
}

.navbar {
    height: 80px;
    width: 90%;
    margin: auto;
    &-brand {
        width: 25%;
        height: 100%;
        &__img {
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
        }
    }
}

i {

    :hover {
        cursor: pointer;
    }
}

</style>