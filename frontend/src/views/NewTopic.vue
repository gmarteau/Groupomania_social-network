<template>
    <div class="newTopic row">
        <div class="col-4">
            <h1 class="mb-5">Créer un nouveau topic</h1>

            <form class="newTopic__form" @submit.prevent="createNewTopic">
                <div class="form-group mb-4">
                    <label for="name" class="h4 mb-3">Nom du topic</label>
                    <input type="text" class="form-control" name="name" id="name" v-model="name" placeholder="Un nom court résumant votre topic" required />
                </div>

                <div class="form-group mb-4">
                    <label for="description" class="h4 mb-3">Description</label>
                    <textarea class="form-control newTopic__form__description" type="text" id="description" name="description" v-model="description" placeholder="Décrivez plus en détail le sujet de votre topic" required></textarea>
                </div>

                <div class="form-group mb-4">
                    <label for="image" class="h4 mb-3">Ajoutez une image</label>
                    <input type="file" id="image" name="image" accept="image/png, image/jpg, image/jpeg" @change="getUserImage" />
                </div>

                <div class="newTopic__form__submit my-5 text-center">
                    <button type="submit" class="newTopic__form__submit__btn btn py-1 px-3">Créer</button>
                </div>
            </form>
        </div>                  
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
    name: 'NewTopic',
    data() {
        return {
            name: '',
            description: '',
            image: ''
        }
    },
    computed: {
        ...mapGetters(['currentUser'])
    },
    methods: {
        getUserImage() {
            this.image = document.getElementById('image').files[0];
        },
        async createNewTopic() {
            const formData = new FormData();
            formData.append('userId', this.currentUser.id);
            formData.append('name', this.name);
            formData.append('description', this.description);
            formData.append('image', this.image);
            const response = await axios.post('/topics', formData);
            const newTopicUrl = '/topic?id=' + response.data.topicId;
            this.$router.push(newTopicUrl);
        }
    }
}
</script>

<style lang="scss">

.newTopic {
    display: flex;
    justify-content: center;
    &__form {
        width: 75%;
        &__description {
            min-height: 100px;
        }
        &__submit {
            &__btn {
                background-color: #FD3C13;
                color: #fff;
                font-weight: bold;
                &:hover {
                    background-color: #FFD7D7;
                    color: #FD3C13;
                }
            }
        }
    }
}
</style>