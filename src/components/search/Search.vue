<template>
	<div>

    <p class="lead">Do you want to search for physicians that accept payments?</p>

    <hr class="my-4">

      <div class="form-group col-lg-12 col-md-12 col-sm-12">
      <div v-show="showExcel" class="pull-right" style="margin-bottom: 6px;" v-on:click="doAllExport()">
					<button type="button" class="btn btn-success" :disabled="showLoading"><i :title="exportTip" v-tippy class="fa fa-info-circle"></i> Export<span v-show="showLoading">ing...<i  class="fa fa-circle-o-notch fa-spin" style="font-size:14px"></i></span></button>
			</div>

      <label class="control-label">Search Physicians</label>
      <div class="form-group">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">
							<span v-if="showLoading">

									<i  class="fa fa-circle-o-notch fa-spin" style="font-size:16px"></i>
							</span>
							<span v-else>
										<i class="fa fa-user-md" aria-hidden="true"></i>
							</span>

						</span>
          </div>
          <input type="text" class="form-control" ref='search' v-model="searchtext" >
          <div class="input-group-append">
            <span class="input-group-text"><i class="fa fa-search"></i></span>
          </div>
        </div>
      </div>
      </div>
			<div  class="col-lg-12 col-md-12 col-sm-12" >
				Total record(s): {{this.searchCounter}}  <span v-if="searchCounter == '100'"><small>or more </small></span>
				<span class="pull-right"><i :title="searchFilter" v-tippy class="fa fa-info-circle"></i> Search on: {{this.searchTexted}}</span>
			</div>
    <div class="lists col-lg-12 col-md-12 col-sm-12">
      <ul class="list-group" v-for="result in searchResult" >
        <li class="list-group-item d-flex justify-content-between align-items-center">

					<div id="template-3">
					    <div class="max-w-md w-full py-4 px-8">
					  	<button type="button" class="btn btn-primary" @click="doOnlineExport(result.physician_profile_id)">Export from Online</button><br/><br/>
							<button type="button" class="btn btn-warning" @click="doExport(result.physician_profile_id)">Export from Local</button>

					    </div>
					</div>

         <a v-tippy="{ html: '#template-3', reactive : true,trigger: 'click',placement: 'right',
        		interactive : true, theme : 'light bordered' ,arrow: true,animateFill : false }"
				 	href="#">
					 {{result.physician_first_name}} {{result.physician_middle_name}} {{result.physician_last_name}}
				 </a>

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
import _ from 'lodash'

	export default {

	    /* eslint-disable */
	    name: 'Search',
	    data() {
	        return {
						exportTip: 'Tip: Try to export small number of records. I have low memory! 😞',
						searchFilter: 'Full Text Search on First Name, Middle Name or Last Name. 👀',
            searchtext: '',
						searchTexted:'',
            searchResult: {},
						searchCounter:'',
            showExcel: false,
            showLoading: false,
	        }
	    },


	    methods: {
				onChange: function(){
							if(this.searchtext != ''){
								  this.doSearch();
							} else{
								this.searchResult = '';
								this.searchCounter = '';
								this.showExcel = false;
							}

				},
        doSearch(){
						this.showExcel = false;
						this.showLoading = true;
            axios.post(`http://46.101.56.165:8001/search`, {"search":this.searchtext})
           .then(response => {
             // JSON responses are automatically parsed.
             this.searchResult = response.data.searchResult
						 this.searchCounter = response.data.counter;
						 this.searchTexted = response.data.searchOn;
             if(response.data.counter >= 1){
               this.showExcel = true;
             }
						 this.showLoading = false;
           })
           .catch(e => {
						  this.showLoading = false;
             this.errors.push(e)

           })

        },
				convertArrayOfObjectsToCSV: function(args) {
					//used google for this function!!!
		        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

		        data = args.data || null;
		        if (data == null || !data.length) {
		            return null;
		        }

		        columnDelimiter = args.columnDelimiter || ',';
		        lineDelimiter = args.lineDelimiter || '\n';

		        keys = Object.keys(data[0]);

		        result = '';
		        result += keys.join(columnDelimiter);
		        result += lineDelimiter;

		        data.forEach(function(item) {
		            ctr = 0;
		            keys.forEach(function(key) {
		                if (ctr > 0) result += columnDelimiter;

		                result += item[key];
		                ctr++;
		            });
		            result += lineDelimiter;
		        });

		        return result;
		    },
				doOnlineExport: function(id){
					let self = this;
					self.showLoading = true;
					self.$Progress.start();
					let urlOpenPaymentData = 'https://openpaymentsdata.cms.gov/resource/qh6m-nw4f.json?physician_profile_id='+id;

					axios.get(urlOpenPaymentData).then(function(response){
						//the download may not work in firefox or IE sorry.
						var data, filename, link;
						let jsonResponse = response.data;
						var csv = self.convertArrayOfObjectsToCSV({data: jsonResponse});

						if (csv == null) return;

						filename = "OnlinePhysician-"+id+".csv"

						if (!csv.match(/^data:text\/csv/i)) {
								csv = 'data:text/csv;charset=utf-8,' + csv;
						}
						data = encodeURI(csv);

						link = document.createElement('a');
						link.setAttribute('href', data);
						link.setAttribute('download', filename);
						link.click();
						self.showLoading = false;
						self.$Progress.finish();

					})
					.catch(error => {
							self.showLoading = false;
							self.$Progress.fail();

					});
				},
        doExport: function(id){

          let self = this;
					self.showLoading = true;
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
               link.setAttribute('download', "LocalPhysician-"+id+".csv");
               document.body.appendChild(link);
               link.click();
             }
						 self.showLoading = false;
            self.$Progress.finish();

          })
          .catch(error => {
							self.showLoading = false;
              self.$Progress.fail();


          });
        },
        doAllExport: function(){

          let profile_ids = Object.values(this.searchResult).map(function (result, key, index) {
            //console.log(index[key].physician_profile_id+' = '+key+" - "+index);
            return index[key].physician_profile_id;

          });
					let fileName = "ExportReport "+new Date()+".xlsx";
          let self = this;
					self.showLoading = true;
          self.$Progress.start();
          axios({
              method:'post',
              url:'http://46.101.56.165:8001/export/all',
              responseType:'arraybuffer',
              data: {"profileIds": profile_ids}
            }).then(function(response){

              //I.E Download is annyoying!!!sorry. I love chrome.

             let blob = new Blob([response.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
             if (typeof window.navigator.msSaveBlob !== 'undefined') {
               window.navigator.msSaveBlob(blob, fileName);
             } else {
               const url = window.URL.createObjectURL(blob);
               const link = document.createElement('a');
               link.href = url;
               link.setAttribute('download', fileName);
               document.body.appendChild(link);
               link.click();

             }
          //  console.log(response);
										self.showLoading = false;
             self.$Progress.finish();

          })
          .catch(error => {
							self.showLoading = false;
              self.$Progress.fail();
          });
        }


	    },
      watch:{
        searchtext: function(){
						this.$refs.search.focus();
						//vuejs v model is to fast for doSearch :( so gotta put 1 sec lil delay
						setTimeout(() => {
							 this.doSearch();
						}, 1000)
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
