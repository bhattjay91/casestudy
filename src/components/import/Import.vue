<template>
	<div>
    <p class="lead">Do you want to import physicians?</p>
    <hr class="my-4">
    <h5>Here are some rules to import</h5>
    <ul>
      <li>Import must be CSV</li>
      <li>That's it. <small> Don't worry, you will be notify for any danger! error.</small></li>
    </ul>
    <div class="form-group">

    <div class="form-group">
      <div class="input-group mb-3">

        <input type="file" ref="fileform" id="file-upload" v-on:change="handleFileUpload()" class="form-control">
        <div class="input-group-append">
          <span class="input-group-text">
          <button type="button" class="btn btn-primary" @click="upload">Submit</button>
          </span>
        </div>
      </div>
    </div>
    </div>
    <span v-show="processloader">
      Importing....<small>Please wait</small>
    </span>
	</div>
</template>

<script>
import axios from 'axios';

	export default {

	    /* eslint-disable */
	    name: 'Import',

	    data() {
	        return {
            processloader: false,
            uploadFile:''
	        }
	    },
      created: function(){
        this.$notify('text')
      },
      methods:{
        showError: function(error){
          this.$notify({
            group: 'foo',
            type: 'error',
            title: 'Error',
            text: error,
            duration: 50000,
            speed: 1000
          })
        },
        showSuccess: function(success){
          this.$notify({
            group: 'foo',
            type: 'success',
            title: 'Successfully',
            text: success,
            duration: 50000,
            speed: 1000
          })
        },
        handleFileUpload(){
          this.uploadFile = this.$refs.fileform.files[0];
        },
        upload: function(e){

          let self = this;
          let targetfile = e.target.files

          let formData = new FormData();
          formData.append('import',this.uploadFile);
          self.$data.processloader = true
          self.$Progress.start();
          axios.post(`http://46.101.56.165:8001/upload`,
          formData,
          {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          }
          ).then(function(response){
              self.$data.resonse = response.data.documentCount
              self.$data.processloader = false
              self.$Progress.finish();
              self.showSuccess(response.data.message)
          })
          .catch(error => {
              self.$Progress.fail();
              this.showError(error.response.data.message)
              self.$refs.fileform.value = '';
              self.$data.processloader = false

          });

        }
      }



	}
</script>
