<template>
    <div class="comment container mx-0 py-3">
        <div class="comment__body row mb-2">
            <div class="comment__body__pic col-1">
                <div class="comment__body__pic__circle">
                    <img class="comment__body__pic__circle__img" :src="imageUrl" alt="Photo de profil de l'utilisateur" />
                </div>
            </div>
            <div class="comment__body__txt col p-0">
                <p class="comment__body__txt__user mb-0 mr-4"><span class="font-weight-bold">{{ firstName }} {{ lastName }}</span> /{{ username }} :</p>
                <p class="comment__body__txt__content mb-0">
                    {{ content }}
                </p>
            </div>
        </div>

        <div class="row m-0">
            <div class="comment__footer col">
                <div class="comment__footer__likes mx-2">
                    <button class="comment__footer__likes__btn btn px-1"><i class="far fa-thumbs-up"></i></button>
                    <p class="comment__footer__likes__number mb-0">{{ numberOfLikes }}</p>
                </div>
                <div class="comment__footer__dislikes mx-2">
                    <button class="comment__footer__dislikes__btn btn px-1"><i class="far fa-thumbs-down"></i></button>
                    <p class="comment__footer__dislikes__number mb-0">{{ numberOfDislikes }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Comment',
    props: ['imageUrl', 'firstName', 'lastName', 'username', 'content', 'numberOfLikes', 'numberOfDislikes']
}
</script>

<style lang="scss">

.comment {
    border-bottom: solid 2px #d3d3d3;
    min-width: 100%;
    &__body {
        &__pic {
            display: flex;
            align-items: center;
            justify-content: center;
            &__circle {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                overflow: hidden;
                &__img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
        &__txt {
            display: flex;
            align-items: center;
        }
    }
    &__footer {
        display: flex;
        align-items: center;
        &__likes {
            display: flex;
            align-items: center;
        }
        &__dislikes {
            display: flex;
            align-items: center;
        }
    }
}
</style>