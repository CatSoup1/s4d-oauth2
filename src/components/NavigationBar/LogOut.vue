 <template>
    <b-nav-item-dropdown id="v-step-0" :text="test" right>
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