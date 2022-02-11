
<template>
    <b-navbar toggleable="lg" type="dark" style="background-color:#161719;user-select:none;" id="navbar nav-main">
        <b-navbar-brand>
            <img src="scratch.png" width="40" draggable="false">
            Scratch For Discord
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <CodeModal></CodeModal>
                <FileMenu></FileMenu>
                <EditMenu></EditMenu>
                <ToolboxModal></ToolboxModal>
                <LanguageMenu></LanguageMenu>
                <ExamplesMenu></ExamplesMenu>
                <preBuilds></preBuilds>
                <TokenModal></TokenModal>
                <b-nav-item href="https://androz2091.gitbook.io/scratch-for-discord/" target="_blank">{{ $t('help') }}</b-nav-item> 
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                    <img id="discordPfp" src="" width="40" draggable="true" style="margin-right: 5px; border-radius: 50%;">
                    <logOut></logOut>
            <b-button id="loggedInData" style="color: white; margin-right: 5px; margin-top: auto; margin-bottom: auto;"><img id="discordPfp" src=" " style=""/>Currently not logged in</b-button> <!-- :O  u need need to center urself css does it for u x)-->
                <b-button style="margin-right: 4px;border-radius: 0em; border-top-left-radius: 0.25em; border-bottom-left-radius: 0.25em" href="https://discord.com/api/oauth2/authorize?client_id=938552684942880869&redirect_uri=https%3A%2F%2Fs4d-xl83.netlify.app%2F&response_type=token&scope=identify">
                <b-icon-discord></b-icon-discord>
                </b-button>
                <b-button style="border-right-color: #161719; border-radius: 0em; border-top-left-radius: 0.25em; border-bottom-left-radius: 0.25em">
                <span contenteditable="true" id="docName" style="">{{ $t("untitled") }}</span>
                </b-button>
                <b-button id="v-step-2" :disabled="!configurationValidated" style="border-radius: 0em; border-top-right-radius: 0.25em; border-bottom-right-radius: 0.25em" @click="exportToCode">
                    <b-icon-download></b-icon-download>
                </b-button>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import Blockly from "blockly";
import JSZip from "jszip";
import TokenModal from "./TokenModal.vue";
import FileMenu from "./FileMenu.vue";
import EditMenu from "./EditMenu.vue";
import LanguageMenu from "./LanguageMenu.vue";
import ExamplesMenu from "./ExamplesMenu.vue";
import CodeModal from "./CodeModal.vue";
import preBuilds from "./preBuilds.vue";
import ToolboxModal from "./ToolboxModal.vue";
import localforage from 'localforage';
import logOut from './LogIn.vue'
import r from "./requires"


export default {
    name: "navbar",
    components: {
        FileMenu,
        EditMenu,
        LanguageMenu,
        ExamplesMenu,
        CodeModal,
        TokenModal,
        preBuilds,
        logOut,
        ToolboxModal
    },
    computed: {
        configurationValidated: function () {
            return  this.$store.state.workspace &&
                    this.$store.state.workspace.getAllBlocks().some((block) => block.type === "s4d_login") &&
                    this.$store.state.workspace.getAllBlocks().every((block) => !block.disabled && !block.warning);
        }
    },
    mounted(){
        var checkpfp = setInterval(() => {
            if (!localStorage.getItem("usernameTag")) {
                return
            } else {
                var pfpHash = localStorage.getItem("avatarHash")
                var UserId = localStorage.getItem("id") 
                var username = localStorage.getItem("usernameTag")
                document.getElementById("loggedInData").innerHTML = '<img id="discordPfp" style="border-radius: 50%;" src="'+"https://cdn.discordapp.com/avatars/" + UserId + "/" + pfpHash + ".png?size=40"+ '"/>ㅤ' + String(username)
                clearInterval(checkpfp)
            }
        }, 1000);
        document.getElementById("docName").addEventListener("input", function() {
            document.title = `Scratch For Discord - ${document.querySelector("#docName").textContent}`;
        }, false);
        const element = document.querySelector("#docName");
        element.spellcheck = false;
        element.focus(); 
        element.blur();
    },
    methods: {
        exportToCode(){
            const wrapper = document.createElement('div');
            wrapper.innerHTML = `<h6>${this.$t('download.content.title')}</h6><ul><li style='text-align:left'>${this.$t('download.content.unzipFile')}</li><li style='text-align:left'>${this.$t('download.content.node')}</li><li style='text-align:left'>${this.$t('download.content.start')}</li><li style='text-align:left'>${this.$t('download.content.done')}</li></ul>`;
            this.$swal({
                title: this.$t('download.title'),
                content: wrapper,
                buttons: {
                    cancel: this.$t('download.cancel'),
                    confirm: this.$t('download.confirm')
                },
            }).then(async result => {
                let requires = [`"discord.js": "^13.1.0",`,`"process":"^0.11.10",`,`"easy-json-database": "^1.5.0",`]
                let oldrequires = await localforage.getItem("requires")
                r(requires,oldrequires)
                if(result){
                    const zip = new JSZip();
                    const xmlContent = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(this.$store.state.workspace));
                    const fileName = `${encodeURIComponent(document.querySelector("#docName").textContent).replace(/%20/g, " ")}.zip`;
                    zip.file("blocks.xml", xmlContent);
                    const javascriptContent = this.getWorkspaceCode();

                const jsondb = await localStorage.getItem('easyjsondatabase')
                    zip.file("bot.js", javascriptContent);
                    zip.file(".replit", 'run = "npm start"\nentrypoint="bot.js"');
                  zip.file("db.json", jsondb);
                    zip.file("package.json", `{\n
                        "name": "scratch-for-discord-bot",\n
                        "version": "1.0.0",\n
                        "main": "bot.js",\n
                        "scripts": {\n
                            "start": "node .",\n
                            "node-update": "npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH",\n
                            "node-clean": "rm -rf node_modules && rm package-lock.json && npm cache clear --force && npm cache clean --force && npm i"\n
                        },\n
                        "dependencies": {\n
                             "djs-games": "^2.1.10",\n
                            "lyrics-finder": "^21.7.0",\n
                            ${requires.join("\n")}\n
                            
                        },\n
                        "devDependencies": {\n
                            "node": "^16.10.0"\n
                        }\n
                    }`)
                    zip.generateAsync({
                        type: "blob"
                    })
                    .then((blob) => {
                        const a = document.createElement("a");
                        a.style = "display: none";
                        document.body.appendChild(a);
                        const url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    });
                }
            });
        }
    }
}
</script>
