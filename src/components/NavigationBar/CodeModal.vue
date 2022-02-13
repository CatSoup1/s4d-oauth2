<template>
    <b-modal id="code-modal" :title="$t('code_modal.title')" ok-only>
        <textarea disabled :value="content" id="code">
        </textarea>
  </b-modal>
</template>

<script>
import beautify from "js-beautify";

export default {
    name: "editmenu",
    computed: {
        content: function(){
            return beautify.js(this.getWorkspaceCode(), {
                indent_size: 4,
                space_in_empty_paren: true
            });
        }
    }
}
</script>
 <style>
 .close {
  font-size: 200% !important;
  color: #eb4034 !important;
  opacity: 0.8 !important;
}

.close:hover {
  font-size: 210% !important;
  opacitiy: 1 !important;
}

#code {
  min-width: 100%;
  min-height: 100%;
  border: 5px solid #70788C;
  border-radius: 0.5em;
  color: white !important;
  font-weight: bold !important;
  padding: 1em;
  background-color: #3d445a;
}
  
#code-modal .modal-dialog {
  max-width: 100%;
  margin: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  position: fixed;
  z-index: 100000;
}

.modal-header {
  border-bottom: 0px solid !important;
}

.modal-title {
  color: white;
  font-family: 'lato', serif;
  font-size: 150%;
  text-align: center;
  text-shadow: 2px 2px 10px #121212;
}

.modal-content {
	background-color: #1d2332 !important;
}

.modal-footer {
  border-top: 0px solid !important;
}
</style>
