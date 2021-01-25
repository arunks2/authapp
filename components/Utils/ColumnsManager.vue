<template>
  <div class="PanelContainer" :class="{Show: show}" @click.prevent="closePanel">
    <div class="Panel" @click.stop='' @keyup.esc='closePanel' tabindex="0" autofocus>
      <a href='#' @click.prevent="closePanel" class="Close">
        <i class="ti-close"></i>
      </a>
      <h3 style="margin-top: 0;">Manage Columns</h3>
      <p class="info">You may drag and drop to reorder columns</p>
      <div class="uk-margin">
        <draggable v-model="columns">
          <div for="" v-for="column in columns" :key="column.field">
            <label><input type="checkbox" v-model="column.show" class="uk-checkbox" /> {{ column.label }}</label>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script>
  import draggable from 'vuedraggable'
  export default {
    props: ['show', 'columns'],
    components: { draggable },
    methods: {
      closePanel() {
        this.$emit('update:show', false)
        this.$emit('update:columns', this.columns)
      }
    }
  };
</script>
