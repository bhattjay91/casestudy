<template>
	<div>
    <p class="lead">Do you want to import physicians?</p>
    <hr class="my-4">
		<h5>Just click the button below to Import Data via OpenPaymentsData.com </h5>
		<button type="button" class="btn btn-primary" @click="getImportData" :disabled="showLoading">IMPORT<span v-show="showLoading" >ING... <i class="fa fa-circle-o-notch fa-spin" style="font-size:16px"></i></span></button>

		<br/>	<br/>
    <h5>Or You can import data manually. Here are some rules to import</h5>
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
            uploadFile:'',
						showLoading: false,
						pagingLimit:'',
						pagingOffset:''

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
				getPaging: function(){
					let self = this;
					axios.get('http://46.101.56.165:8001/paging')
					.then(function(response){
						let settings = response.data;
						return self.getPaymentData(settings);
					}).catch(error=>{
						self.showError("something went wrong on fetching paging settings")
					})
				},
				getImportData: function(e){
					e.preventDefault();
					let self = this;
					self.showLoading = true;
					self.$Progress.start();
					this.getPaging();
				},
				getPaymentData: function(settings){
					let self = this;
					//let urlOpenPaymentData = 	`https://openpaymentsdata.cms.gov/resource/qh6m-nw4f.json?$select=physician_profile_id&$limit=5000&$order=payment_publication_date DESC&$offset=0`
				 	let urlOpenPaymentData = 'https://openpaymentsdata.cms.gov/resource/qh6m-nw4f.json?$limit='+settings.limits+'&$offset='+settings.offsets;

					axios({
							url: urlOpenPaymentData,
							type: "GET",
					}).then(function(response) {
							return self.doImport(response.data);
					}).catch(error=>{});
				},
				doImport: function(data){
					let self = this;
					axios.post('http://46.101.56.165:8001/upload/all',{"data":data})
					.then(function(response){
						self.showLoading = false;
						self.$Progress.finish();
						self.showSuccess(response.data.message)
						return self.updatePaging();
					}).catch(error=>{
						self.showLoading = false;
						self.showError(error.response.data.message)
					})
				},
				updatePaging: function(){
					let self = this;
					axios.post('http://46.101.56.165:8001/paging/update')
					.then(function(response){
							console.log("paging was updated")
					}).catch(error=>{
						self.showError("something went wrong on updating paging settings")
					})
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
