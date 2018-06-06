<template>

<div>
   <!-- template for the modal component -->

   <transition name="fade">
     <div class="modal-mask">
       <div class="modal-wrapper">
         <div class="modal-container">

           <div class="modal-header">
             <slot name="header">
               <span style="font-size: 16px; float: left; font-weight: 450;">John Smith </span>
             </slot>
           </div>

           <div class="modal-body">
             <slot name="body">
               A A A A AA  A Aaaaaa
             </slot>
           </div>

           <div class="modal-footer">
             <slot name="footer">
               <div  class="text-right">
                 Close

              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>

</div>
</template>
<script>
export default{
  /* eslint-disable */
		name: 'SearchPopup',

		props: [],
		data () {
			return {

			}
		},

}
</script>
<style scoped>
.modal-container {
    width: 650px;
    text-align: -webkit-auto;
    text-align: auto;
  }


</style>
