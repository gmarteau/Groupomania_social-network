<template>
    <div class="post container px-2 pb-1 my-2">
        <div class="post__header row">
            <div class="post__header__pic col-1">
                <div class="post__header__pic__circle">
                    <img class="post__header__pic__img" :src="imageUrl" alt="Photo de profil de l'utilisateur" />
                </div>
            </div>
            <div class="post__header__txt col p-0">
                <p class="post__header__txt__username font-weight-bold mb-0 mr-3">{{ firstName }} {{ lastName }}</p>
                <p class="post__header__txt__topic mb-0">@{{ topic }}</p>
            </div>
        </div>
        <div class="post__body row m-0">
            <p class="post__body__content col-12 pt-3">
                {{ content }}
            </p>
        </div>
        <div class="row m-0">
            <div class="post__footer col px-0">
                <div class="post__footer__likes mx-2">
                    <button class="post__footer__likes__btn btn px-1"><i class="far fa-thumbs-up"></i></button>
                    <p class="post__footer__likes__number mb-0">{{ numberOfLikes }}</p>
                </div>
                <div class="post__footer__dislikes mx-2">
                    <button class="post__footer__dislikes__btn btn px-1"><i class="far fa-thumbs-down"></i></button>
                    <p class="post__footer__dislikes__number mb-0">{{ numberOfDislikes }}</p>
                </div>
                <p class="post__footer__comments mb-0 ml-3">{{ numberOfComments }} commentaires</p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Post',
    props: ['imageUrl', 'firstName', 'lastName', 'topic', 'content', 'numberOfLikes', 'numberOfDislikes', 'numberOfComments']
}
</script>

<style lang="scss">

.post {
    height: auto;
    border: solid 1px #d3d3d3;
    border-radius: .3rem;
    margin: 0;
    min-width: 100%;
    overflow: hidden;
    &__header {
        height: 50px;
        background-color: #FFD7D7;
        &__pic {
            display: flex;
            justify-content: center;
            align-items: center;
            &__circle {
                border: solid 2px #fff;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                overflow: hidden;
            }
            &__img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        &__txt {
            display: flex;
            align-items: center;
        }
    }
    &__footer {
        height: 50px;
        display: flex;
        align-items: center;
        border-top: solid 1px #d3d3d3;
        &__likes {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        &__dislikes {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

.btn {
    padding: 0;
}
</style>