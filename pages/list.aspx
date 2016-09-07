<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint,Version=16.0.0.0,Culture=neutral,PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ContentPlaceHolderId="PlaceHolderPageTitle" runat="server">
    List Demo
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <!-- Scripts -->
    <script type="text/javascript" src="../js/jquery.min.js"></script>
    <script type="text/javascript" src="../js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../js/sprest.js"></script>

    <!-- CSS -->
    <link rel="stylesheet" href="../css/bootstrap.min.css" />
    <SharePoint:StyleBlock runat="server">
        #contentBox {
            margin-left:20px;
        }
    </SharePoint:StyleBlock>
</asp:Content>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <!-- Header -->
    <div class="container-fluid">
        <div class="row">
            <h1 class="page-header">List Demo</h1>
            <div class="row placeholders">
            </div>
            <div class="table-responsive">
                <table id="tblMain" class="table table-striped">
                    <thead>
                        <tr>
                            <th><button type="button" class="btn btn-primary" onclick="GD.newItem();">New Item</button></th>
                            <th>Title</th>
                            <th>Choice</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div id="itemForm" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="pull-right" aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">New Item</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="item_Title">Title: </label>
                        <input type="text" class="form-control" id="item_Title" placeholder="Title"></input>
                    </div>
                    <div class="form-group">
                        <label for="item_DemoChoice">Choice: </label>
                        <select class="form-control" id="item_DemoChoice">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="item_DemoUserId">User: </label>
                        <input type="email" class="form-control" id="item_DemoUserId_" placeholder="User"></input>
                    </div>
                    <div class="form-group">
                        <label for="item_DemoNote">Note: </label>
                        <textarea class="form-control" id="item_DemoNote" rows="3"" placeholder="Note"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="GD.saveItem();">Save</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Scripts -->
    <script type="text/javascript" src="../js/list.js"></script>
</asp:Content>
<asp:Content ContentPlaceHolderID="PlaceHolderLeftNavBar" runat="server" />
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server" />