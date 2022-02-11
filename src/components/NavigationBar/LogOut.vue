<template>
    <b-nav-item-dropdown style="margin-right: 10px; margin-top: auto; margin-bottom: auto;" id="v-step-0" :text="test" right>
        <b-dropdown-item @click="logOut()">Log Out</b-dropdown-item>
      
      </b-nav-item-dropdown>
</template>

<script>
export default {
    name: "editmenu",
    computed: {
    },
    mounted(){
       console.log("test")
    },
    methods: {
        load(){
            
        }
    }
}
</script>