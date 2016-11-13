module GD {
    /***************************************************************
     * Edit Item Panel
     ***************************************************************/
    export class ViewItemPanel {
        /***************************************************************
         * Constructor
         ***************************************************************/
        constructor() { }

        /***************************************************************
         * Public Interface
         ***************************************************************/

        // Method to close the panel
        close() {
            // Query the close button and click it
            this._activePanel ? this._activePanel.querySelector(".ms-Panel-closeButton")["click"]() : null;
        }

        // Method to show the panel
        show(item) {
            // Clone the panel
            this._activePanel = this.createPanel(item);

            // Show the panel
            new window["fabric"].Panel(this._activePanel);
        }

        /***************************************************************
         * Private Interface
         ***************************************************************/

        // The active panel
        _activePanel: Element;

        // Method to create the panel
        private createPanel(item) {
            // Create the dialog
            let panel = document.createElement("div");

            // Set the class name
            panel.className = "ms-Panel";

            // Set the item
            panel["item"] = item;

            // Set the template
            panel.innerHTML = `
<button class="ms-Panel-closeButton ms-PanelAction-close">
    <i class="ms-Panel-closeIcon ms-Icon ms-Icon--Cancel"></i>
</button>
<div class="ms-Panel-contentInner">
    <p class="ms-Panel-headerText">Edit Item</p>
    <div id="lblType" class="ms-Label">
        <label class="ms-Label">Type:</label>
    </div>
    <div id="lblTitle" class="ms-Label">
        <label class="ms-Label">Title:</label>
    <div id="lblOwner" class="ms-Label">
        <label class="ms-Label">Owner:</label>
    </div>
    <div id="lblNotes" class="ms-Label">
        <label class="ms-Label">Notes:</label>
    </div>
</div>
`;
            // Set the item values
            panel.querySelector("#lblNotes").innerHTML += item["GDNotes"];
            panel.querySelector("#lblOwner").innerHTML += item["GDOwner"].Title;
            panel.querySelector("#lblTitle").innerHTML += item["Title"];
            panel.querySelector("#lblType").innerHTML += item["GDType"];

            // Return the panel
            return panel;
        }

        // Method to save the item
        private saveItem(item: $REST.Types.IListItem) {
            item
                // Update the item
                .update({
                    GDNotes: this._activePanel.querySelector("#taNotes")["value"],
                    GDType: this._activePanel.querySelector("#ddlType")["value"],
                    Title: this._activePanel.querySelector("#tbTitle")["value"]
                })
                // Execute the request
                .execute(() => {
                    // Add the item to the dashboard
                    GD.Dashboard.addItem(item.Id);

                    // Close this panel
                    this.close();
                });
        }
    }
}