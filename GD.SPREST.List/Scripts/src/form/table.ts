module GD {
    /***************************************************************
     * Table
     ***************************************************************/
    export class Table {
        /***************************************************************
         * Constructor
         ***************************************************************/
        constructor(panelId) {
            // Get the panel
            let panel = document.querySelector("#" + panelId);
            if (panel) {
                // Create the table
                this.createTable();

                // Add the table to it
                panel.appendChild(this._table);
            }
        }

        /***************************************************************
         * Public Interface
         ***************************************************************/

        // Method to add a row
        addRow(item: $REST.Types.IListItem) {
            // Append a row to the body of the table
            this._table.querySelector("tbody").innerHTML += this.generateRow(item);
        }

        /***************************************************************
         * Private Interface
         ***************************************************************/

        // The table
        _table: Element;

        // Method to create the panel
        private createTable() {
            // Create the dialog
            this._table = document.createElement("table");

            // Set the class name
            this._table.className = "ms-Table";

            // Set the template
            this._table.innerHTML = `
<thead>
    <tr>
        <th>Title</th>
        <th>Type</th>
        <th>Owner</th>
        <th>Actions</th>
    </tr>
</thead>
<tbody></tbody>
`;
        }

        // Method to generate a table row
        private generateRow(item: $REST.Types.IListItem) {
            // Return the row template
            return `
<tr data-item-id="{{ID}}">
    <td>{{Title}}</td>
    <td>{{Type}}</td>
    <td>{{Owner}}</td>
    <td>
        <button class="ms-Button" onclick="return GD.Dashboard.showEditItemPanel({{ID}});">
            <span class="ms-Button-label">Edit</span>
        </button>
        &nbsp;/&nbsp;
        <button class="ms-Button" onclick="return GD.Dashboard.showNotesPanel({{ID}});">
            <span class="ms-Button-label">View Notes</span>
        </button>
    </td>
</tr>
`
                // Replace the template w/ the item field values
                .replace(/{{ID}}/g, item.Id)
                .replace(/{{Owner}}/g, item["GDOwner"] ? item["GDOwner"].Title : null)
                .replace(/{{Title}}/g, item["Title"])
                .replace(/{{Type}}/g, item["GDType"]);
        }
    }
}