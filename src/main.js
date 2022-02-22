import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from './App.vue';
import store from './store';
import VueSwal from 'vue-swal';
import Vuei18n from 'vue-i18n';
import Blockly from "blockly";
import VueToast from 'vue-toast-notification';
import VueTour from 'vue-tour';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import savenload from './save-load';
import clientSEC from "./key.js"
import Swal from "sweetalert2"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-toast-notification/dist/theme-default.css';
import 'vue-tour/dist/vue-tour.css';
document.querySelector("html").classList.add("light-them");
var Theme = Blockly.Theme.defineTheme('blue', {
    'base': Blockly.Themes.Classic,
    'componentStyles': {
      'workspaceBackgroundColour': '#3f4456',
      'toolboxBackgroundColour': '#383c4a',
      'toolboxForegroundColour': '#22252e',
      'flyoutBackgroundColour': '#252526',
      'flyoutForegroundColour': '#ccc',
      'flyoutOpacity': 1,
      'scrollbarColour': '#797979',
      'insertionMarkerColour': '#fff',
      'insertionMarkerOpacity': 0.3,
      'scrollbarOpacity': 0.4,
      'cursorColour': '#d0d0d0',
      'blackBackground': '#333',
    },
  });

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueTour);
Vue.use(VueToast);
Vue.use(Vuei18n);
Vue.use(VueSwal);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;
Vue.config.ignoredElements = ["field", "block", "category", "xml", "mutation", "value", "sep"];

import r from "./require";

import blocklyLocaleEN from "blockly/msg/en";
import blocklyLocaleFR from "blockly/msg/fr";
import blocklyLocalePT from "blockly/msg/pt";

import customLocaleEN from './locales/en';
import customLocaleFR from './locales/fr';
import customLocalePT from './locales/pt';
import localforage from "localforage";
const messages = {
    en: customLocaleEN.websiteMessages,
    fr: customLocaleFR.websiteMessages,
    pt: customLocalePT.websiteMessages
};
const i18n = new Vuei18n({
    locale: (messages[navigator.language.split("-")[0]] ? navigator.language.split("-")[0] : "en"),
    messages: messages
});

import toolbox from "./toolbox";

Vue.mixin({
    methods: {
        async reloadWorkspace() {
            let val = await localforage.getItem("fav") === null ? null : await localforage.getItem("fav")
                // Get current workspace
            let workspace = this.$store.state.workspace;
            // Convert it to a dom string
            const dom = Blockly.Xml.workspaceToDom(workspace);
            // Delete the current workspace
            workspace.dispose();
            // Create a new workspace (with the good language)
            const newWorkspace = Blockly.inject(document.getElementById("blocklyDiv"), {
                grid: {
                    spacing: 25,
                    length: 3,
                    colour: "#ccc",
                },
                renderer: "zelos",
                theme: Theme,
                zoom: {
                    controls: true,
                    startScale: 0.9,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2
                },
                move: {
                    scrollbars: {
                        horizontal: true,
                        vertical: true
                    },
                    drag: true,
                    wheel: true
                },
                toolbox: toolbox(Blockly, val)
            });

            Blockly.Xml.domToWorkspace(dom, newWorkspace);
            // Update the workspace in the vuex store
            this.$store.commit("setWorkspace", {
                workspace: newWorkspace
            });

            // Return the workspace
            return workspace;
        },
        setLanguage(locale) {
            switch (locale) {
                case "en":
                    // Change Blockly language for default blocks
                    Blockly.setLocale(blocklyLocaleEN);
                    // Change Blockly language for custom blocks
                    customLocaleEN.applyBlocklyLocale();
                    // Change website languages (navbar, etc...)
                    this.$root.$i18n.locale = "en";
                    break;
                case "fr":
                    // Change Blockly language for default blocks
                    Blockly.setLocale(blocklyLocaleFR);
                    // Change Blockly language for custom blocks
                    customLocaleFR.applyBlocklyLocale();
                    // Change website languages (navbar, etc...)
                    this.$root.$i18n.locale = "fr";
                    break;
                case "pt":
                    // Change Blockly language for default blocks
                    Blockly.setLocale(blocklyLocalePT);
                    // Change Blockly language for custom blocks
                    customLocalePT.applyBlocklyLocale();
                    // Change website languages (navbar, etc...)
                    this.$root.$i18n.locale = "pt";
                    break;
                default:
                    break;
            }
        },
        getWorkspaceCode() {
            if (!this.$store.state.workspace) return "";
            let requires = [
                `let Discord = require("discord.js")`,
                `let Database  = require("easy-json-database")`,
                `let { MessageEmbed, MessageButton, MessageActionRow, Intents, Permissions, MessageSelectMenu }= require("discord.js")`,
                `let logs = require("discord-logs")`,
                `let dootabase = new Database("./database.json")`
            ]
            let requiresjscode = [`logs(s4d.client);`]
            r(requires, requiresjscode, Blockly.JavaScript.workspaceToCode(this.$store.state.workspace))
            setTimeout(async() => {
                await localforage.setItem("requires", requires)
            }, 1000)
            return `
                (async()=>{
                    //must take all the files out of folder dont forget
                let process = require('process');
                process.on('uncaughtException', function (err) {
                    console.log(\`𝕖𝕣𝕣𝕠𝕣❕\`);
                    console.log(err);
                  });
                  ${requires.join("\n")}
                    require('events').EventEmitter.defaultMaxListeners = 50;
let fs = require('fs');
                    const devMode = typeof __E_IS_DEV !== "undefined" && __E_IS_DEV;
                    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                    const s4d = {
                        Discord,
                        database: new Database(\`\${devMode ? S4D_NATIVE_GET_PATH : "."}/database.json\`),
fire:null,
                        joiningMember:null,
                        reply:null,
                        tokenInvalid:false,
                        tokenError: null,
                        player:null,
                        manager:null,
                        Inviter:null,
                        message:null,
                        notifer:null,
                        checkMessageExists() {
                            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
                            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
                        }
                    };
                    s4d.client = new s4d.Discord.Client({
                    intents: [Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)],
                    partials: ["REACTION", "CHANNEL"]
                    });
                    s4d.client.on('ready', () => {
                        console.log(s4d.client.user.tag + " is alive!")
                    })
                    ${requiresjscode.join("\n")}         
                    ${Blockly.JavaScript.workspaceToCode(this.$store.state.workspace)}
                    return s4d
                    })();
                    `;
        }
    }
});
let params = new URLSearchParams(location.search);
const urlCode = params.get('code')
const clientID = "938552684942880869"
if (urlCode) {     
    getAccessCode()  
}
async function getAccessCode() {
    await fetch('https://discord.com/api/oauth2/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                    client_id: clientID,
                    client_secret: clientSEC,
                    code: String(urlCode),
                    grant_type: 'authorization_code',
                    redirect_uri: `https://s4d-xl83.onrender.com`,
                    scope: 'identify',
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        },
                }).then(result => result.json()).then(response => {
                    fetch('https://discord.com/api/users/@me', {
                        headers: {
                            authorization: `${response.token_type} ${response.access_token}`,
                        },
                    }).then(result => result.json())
                        .then(response => {
                            localStorage.setItem('usernameTag', String(response.username) + "#" + String(response.discriminator)); //that would work x)
                            localStorage.setItem('id', String(response.id))
                            localStorage.setItem('avatarHash', String(response.avatar))
                            localStorage.setItem('loggedIn', true)
                             Swal.fire({
                position: 'center',
                icon: 'success',
                html: ' <p>Logged in as ' + String(response.username) + '#' + String(response.discriminator) + '</p> <img style="border-radius: 50%;"src=https://cdn.discordapp.com/avatars/' + response.id + '/' + response.avatar + '.png?size=100/>',
                title: 'Successfully Logged In',
                showConfirmButton: true
            })
            var changeUrl = new URL(document.location.href);
            changeUrl.searchParams.delete('code');
            window.history.replaceState({}, document.title, changeUrl);
                        })
                })
}


const ws = new WebSocket('ws://ws-server.xl83yt.repl.co');

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
new Vue({
    store,
    render: h => h(App),
    i18n,
    mounted() {
        savenload(this);
    },
}).$mount("#app");
