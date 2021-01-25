<template>
  <!--
      Idea:
        Showcase given images,
        allow sorting images by dragging,
        emit events when images are sorted,
        allow adding images to the collection and emiting the results
  -->
  <div class="ImageDisplayer">
    <vue-element-loading :active="loading"></vue-element-loading>
    <div class="Images">
      <span class="Image" v-for="(image, index) in images" :key="index">
        <img :src="image.file" alt="">
        <a href='#' @click.prevent="removeProductItemImage(image)" class="Remove">&times;</a>
      </span>
    </div>

    <div class="js-upload uk-placeholder uk-text-center">
        <span uk-icon="icon: cloud-upload"></span>&nbsp;
        <span class="uk-text-middle">Add images by dropping them here or</span>&nbsp;
        <div uk-form-custom>
          <input type="file" id="files" ref="files" multiple @change="handleFileUploads()"/>
          <span class="uk-link">selecting one</span>
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return  {
        loading : false,
        files : []
      }
    },
    props: ['images'],
    methods : {
      removeProductItemImage (file) {
        this.deleteData('inventory_masters/removeProductItemFile', file,'images').then(res => {
          this.$emit('imageRemoved', file)
        })
      },
      handleFileUploads() {
        this.files = this.$refs.files.files;
        this.$emit('submitFiles',this.files)
      }
    }
  };
</script>
