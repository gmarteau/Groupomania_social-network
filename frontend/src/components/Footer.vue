<template>
    <footer class="footer">
        <div class="container">
            <div class="row">
                <p class="col m-0 text-center"><i class="far fa-copyright"></i>Groupomania</p>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style lang="scss">

.footer {
    height: 130px;
    background-color: #091F43;
    color: #fff;
    display: flex;
    align-items: center;
    @media screen and (max-width: 576px) {
        height: 100px;
    }
}
</style>