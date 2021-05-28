<template>
    <header>
        <nav class="navbar navbar-expand-lg" v-if="!loggedIn">
            <router-link to="/" class="navbar-brand"><img class="navbar-brand__img" :src="logo.src" :alt="logo.alt" /></router-link>
            <b-navbar-toggle target="navbarContentNotLogged" class="navbar__toggler" variant="dark"><i class="fas fa-bars"></i></b-navbar-toggle>

            <b-collapse id="navbarContentNotLogged" is-nav>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item mx-3">
                        <router-link to="/login" class="nav-link text-dark font-weight-bold text-right pt-4 pt-lg-2">Se connecter</router-link>
                    </li>
                    <li class="nav-item mx-3">
                        <router-link to="/signup" class="nav-link text-dark font-weight-bold text-right">S'inscrire</router-link>
                    </li>
                </ul>
            </b-collapse> 
        </nav>

        <nav class="navbar navbar-expand-lg" v-if="loggedIn">
            <router-link to="/" class="navbar-brand"><img class="navbar-brand__img" :src="logo.src" :alt="logo.alt" /></router-link>

            <b-dropdown class="dropdown nav__dropdown ml-auto" toggle-class="text-decoration-none" size="lg" dropleft no-caret>
                <template #button-content>
                    <i class="fas fa-user-circle fa-lg"></i>
                </template>
                <b-dropdown-item><a href="javascript:void(0);" class="dropdown__item text-dark" @click="toProfile">Mon profil</a></b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item><a href="javascript:void(0);" class="dropdown__item text-dark" @click="logout">Se déconnecter</a></b-dropdown-item>
            </b-dropdown>
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
            this.$router.push('/');
        },
        toProfile() {
            this.$router.push({ path: '/user', query: { id: this.currentUser.id } });
        }
    }
}
</script>

<style lang="scss">

header {
    box-shadow: 0px 2px 10px #D7FFFF;
    z-index: 100000;
    background-color: #fff;
}

.navbar {
    height: 80px;
    width: 90%;
    margin: auto;
    @media screen and (max-width: 576px) {
        height: 60px;
    }
    &-brand {
        width: 25%;
        height: 100%;
        display: flex;
        align-items: center;
        &__img {
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
            @media screen and (max-width: 576px) {
                width: 100%;
                height: 100%;
            }
        }
        @media screen and (max-width: 576px) {
            width: 35%;
        }
    }
    &-toggler {
        color: #FD3C13;
        &.not-collapsed {
            background-color: #FD3C13;
            color: #fff;
        }
    }
}

i {

    :hover {
        cursor: pointer;
    }
}

.nav__dropdown {
    width: 40px;
    height: 40px;
    .btn {
        background-color: #fff;
        color: #FD3C13;
        border: none;
    }
}
</style>