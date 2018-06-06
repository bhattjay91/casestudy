<template>
	<div>

    <p class="lead">Do you want to search for physicians that accept payments?</p>
    <hr class="my-4">

      <div class="form-group">
      <label class="control-label">Search Physicians</label>
      <div class="form-group">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fa fa-user-md" aria-hidden="true"></i></span>
          </div>
          <input type="text" class="form-control" v-model="searchtext">
          <div class="input-group-append">
            <span class="input-group-text"><i class="fa fa-search"></i></span>
          </div>
        </div>
      </div>
      </div>

    <div class="lists">
      <ul class="list-group" v-for="result in searchResult">
        <li class="list-group-item d-flex justify-content-between align-items-center">


         <a href="#" style="cursor:pointer;" @click="doExport(result.physician_profile_id)">  {{result.physician_first_name}} {{result.physician_middle_name}} {{result.physician_last_name}}   </a>

          <span class="badge ">

            <span class="badge-pill badge-info">{{result.physician_specialty}}</span>
            <span class="badge-pill badge-primary">{{result.physician_primary_type}}</span>
            <span class="badge-pill badge-warning">{{result.physician_license_state_code1}}</span>
          </span>



        </li>
      </ul>
    </div>

	</div>
</template>

<script>
import axios from 'axios';

	export default {

	    /* eslint-disable */
	    name: 'Search',
	    data() {
	        return {
            searchtext: '',
            searchResult: {},
            showExcel: false,
            showLoading: false,
	        }
	    },


	    methods: {
        doSearch: function(){
            axios.post(`http://46.101.56.165:8001/search`, {"search":this.searchtext})
           .then(response => {
             // JSON responses are automatically parsed.
             this.searchResult = response.data
             this.showExcel = false;
             if(response.data.length >= 1){
               this.showExcel = true;
             }
           })
           .catch(e => {
             this.errors.push(e)
           })

        },
        doExport: function(id){

          let self = this;
          self.$Progress.start();
          axios.get(`http://46.101.56.165:8001/export/${id}`
          ).then(function(response){


              //I.E Download is annyoying!!!sorry. I love chrome.
              let blob = new Blob([response.data],  {type: "text/plain"});
             if (typeof window.navigator.msSaveBlob !== 'undefined') {
               window.navigator.msSaveBlob(blob, "physician-"+id+".csv");
             } else {
               const url = window.URL.createObjectURL(blob);
               const link = document.createElement('a');
               link.href = url;
               link.setAttribute('download', "physician-"+id+".csv");
               document.body.appendChild(link);
               link.click();
             }

            self.$Progress.finish();



          })
          .catch(error => {

              self.$Progress.fail();


          });
        }


	    },
      watch:{
        searchtext: function(){
          this.doSearch();
        }
      }

	}
</script>
<style scoped>
.card {display:inline-block; margin: 10px;}
.exportIcon{

  padding-bottom: 10px;
}
.lists{
  max-height: 600px;
  overflow-y:auto;
}
</style>
