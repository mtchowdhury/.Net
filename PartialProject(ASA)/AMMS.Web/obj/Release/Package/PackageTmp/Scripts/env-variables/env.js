(function (window) {
    window.__env = window.__env || {};

   //swal heads
   
    window.__env.prompt = 'The entity will be added, OK?';
    window.__env.success = 'Added Successfully';
    window.__env.member_broadcast = 'member-add-finished';
    window.__env.error = 'Something Went Wrong';
    window.__env.error_doc = 'Something Went Wrong while uploading file';

    //
    window.__env.addConfirmation = "### will be added, are you sure?";
    window.__env.addSuccess = "### added successfully";
    window.__env.addError = "Error while adding ###, Actual Error: ";
    window.__env.docAddError = "Error while uploading documents, Actual Error: ";
    
    window.__env.editConfirmation = "### will be edited, are you sure?";
    window.__env.editSuccess = "### edited successfully";
    window.__env.editError = "Error while editing ###, Actual Error: ";

    window.__env.transferConfirmation = "### will be transferred, are you sure?";
    window.__env.transferSuccess = "### transferred successfully";
    window.__env.transferError = "Error while transferring ###, Actual Error: ";
    window.__env.derecognizeError = "Error while derecognize asset ###, Actual Error: ";
    window.__env.derecognizeDeleteError = "Error while deleting derecognized asset ###, Actual Error: ";
    window.__env.transferCancelError = "Error while cancelling transfer asset ###, Actual Error: ";
    

    window.__env.deleteConfirmation = "### will be deleted, are you sure?";
    window.__env.deleteSuccess = "### deleted successfully";
    window.__env.deleteError = "Error while deleting ###, Actual Error: ";


    window.__env.showMessage = function(message, entity) {
        return message.replace(/###/g, entity);
    }

    // Whether or not to enable debug mode
    // Setting this to false will disable console output
    window.__env.enableDebug = true;
}(window));