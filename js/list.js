"use strict";

// Main
$(function() {
    // Render the list
    renderList();
});

// Method to get the list data
function getListData() {
    var promise = new $REST.Promise();

    // Get the list data
    new $REST.ListItems_Async("SPREST List Demo", null, function(items) {
        // Ensure data exists
        if(items.existsFl) {
            // Resolve the promise
            promise.resolve(items);
        }
        else {
            // Ensure the list exists
            if(items.results == null) {
                // Wait for the the SP script to be loaded
                ExecuteOrDelayUntilScriptLoaded(function() {
                    // Display the notification
                    SP.UI.Notify.addNotification("List not found, creating the list...", true);

                    // Create the list
                    (new $REST.Web_Async(false)).addList({
                        BaseTemplate: 100,
                        Title: "SPRESTListDemo"
                    }).done(function(list) {
                        // Update the title
                        list.asyncFl = false;
                        list.update({ Title: "SPREST List Demo"})

                        // Display the notification
                        SP.UI.Notify.addNotification("List created successfully.");
                    });
                }, "core.js");
            }
            else {
                // Show the empty list message
                document.querySelector("#tblMain > tbody").innerHTML =
                    "<tr class='warning'><td colspan='99'>No data exists for this list...</td></tr>";
            }
        }
    });

    // Return the promise
    return promise();
}

// Method to render the list
function renderList() {
    // Get the list data
    getListData().done(function(items) {
        // Display the data
    });
}