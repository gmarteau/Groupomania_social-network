<template>
    <header>
        <nav class="navbar navbar-expand-lg">
            <router-link to="/" class="navbar-brand"><img :src="logo.src" :alt="logo.alt" /></router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/login" class="nav-link">Se connecter</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/signup" class="nav-link">S'inscrire</router-link>
                    </li>
                </ul>
            </div> 
        </nav>
    </header>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'HeaderNav',
    computed: {
        ...mapState(['logo'])
    }
}
</script>