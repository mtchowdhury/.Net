using System.Web;
using System.Web.Optimization;

namespace AMMS.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/css").Include(
                      "~/Content/Plugins/Bootstrap/bootstrap.css",
                      "~/Content/Global/site.css",
                      "~/Content/Button/button-style.css",
                      "~/Content/Form/form-style.css",
                      "~/Content/Font/font-style.css",
                      "~/Content/Dropdown/dropdown-style.css",
                      "~/Content/Navbar/side-navbar-styles.css",
                      "~/Content/Navbar/top-navbar-style.css",
                      "~/Content/Navtabs/tab-styles.css",
                      "~/Content/Custom/custom-style.css",
                      "~/Content/Table/table-style.css",
                      "~/Content/Validation/validation-style.css",
                      "~/Content/Responsive/responsive-bootstrap-800-1280-1366.css",
                      "~/Content/Translation/translation-styles.css"
                      ));
            bundles.Add(new StyleBundle("~/bundles/style-plugins").Include(
                      "~/Content/Plugins/DataTable/angular-datatables.css",
                      "~/Content/Plugins/AngularTreeView/angular.treeview.css",
                       "~/Content/Plugins/AngularDatepicker/datetimepicker.css",
                      "~/Content/ui-bootstrap-csp.css",
                      "~/Content/Plugins/sweetalert.css",
                      "~/Content/Plugins/Bootstrap Datepicker/bootstrap-datepicker.css",
                      "~/Content/font-awesome.css",
                      "~/Content/Plugins/Bootstrap Select/bootstrap-select.css",
                      "~/Content/Plugins/Autocomplete/angucomplete-alt.css"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/encryption").Include(
                        "~/Scripts/encryption/aes.js",
                        "~/Scripts/encryption/encryption.js"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/bootstrap/bootstrap-datepicker.js",
                      "~/Scripts/bootstrap/bootstrap-select.js"));

            bundles.Add(new ScriptBundle("~/bundles/syncjs").Include(
                      "~/Scripts/SyncScripts/sync-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                 "~/Scripts/angular-components/angular.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular-app").Include(
                 "~/Scripts/angular-scripts/App/*.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular-configs").Include(
            "~/Scripts/angular-scripts/Configs/*.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular-controller").IncludeDirectory(
            "~/Scripts/angular-scripts/Controllers/", "*.js", true));

            bundles.Add(new ScriptBundle("~/bundles/angular-service").IncludeDirectory(
                 "~/Scripts/angular-scripts/Services/", "*.js", true));

            bundles.Add(new ScriptBundle("~/bundles/angular-validator").Include(
            "~/Scripts/angular-scripts/Validator/angular-validator.js"));

            //bundles.Add(new ScriptBundle("~/bundles/ui-bootstrap").Include(
            //"~/Scripts/angular-ui/*.js"));
            bundles.Add(new ScriptBundle("~/bundles/ui-bootstrap").Include(
            "~/Scripts/angular-ui/ui-bootstrap-tpls-2.5.0.min.js",
            "~/Scripts/angular-ui/checklist-model.js"));

            bundles.Add(new ScriptBundle("~/bundles/DataTables").Include(
            "~/Scripts/jquery-plugins/jquery.dataTables.js"));

            bundles.Add(new ScriptBundle("~/bundles/filesaver").Include(
            "~/Scripts/jquery-plugins/file-saver.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularDataTables").Include(
            "~/Scripts/angular-plugins/angular-datatables.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularDropdownMultiSelect").Include(
            "~/Scripts/angular-plugins/angularjs-dropdown-multiselect.js"));

            bundles.Add(new ScriptBundle("~/bundles/angulardatepicker").Include(
            "~/Scripts/angular-plugins/moment.js",
            "~/Scripts/angular-plugins/dateTimeInput.js",
            "~/Scripts/angular-plugins/datetimepicker.js",
            "~/Scripts/angular-plugins/datetimepicker.templates.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularplugins").Include(
            "~/Scripts/angular-plugins/moment.js",
            "~/Scripts/angular-plugins/dateTimeInput.js",
            "~/Scripts/angular-plugins/datetimepicker.js",
            "~/Scripts/angular-plugins/datetimepicker.templates.js",
            "~/Scripts/angular-plugins/angular-datatables.js",
            "~/Scripts/angular-plugins/angular-translate.js",
            "~/Scripts/angular-plugins/angular-datatables.js",
            "~/Scripts/angular-plugins/angular-datatables.columnfilter.js",
            "~/Scripts/angular-plugins/angular-sanitize.js",
            "~/Scripts/angular-plugins/angular-translate-loader-static-files.js",
            "~/Scripts/angular-plugins/angucomplete-alt.js",
            "~/Scripts/angular-plugins/angular-animate.js",
            "~/Scripts/angular-plugins/ng-file-upload.js",
            "~/Scripts/angular-plugins/ng-file-upload-shim.js",
            "~/Scripts/angular-plugins/angular.treeview.js",
            "~/Scripts/angular-plugins/xls.core.min.js",
            "~/Scripts/angular-plugins/xlsx.core.min.js"

            ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryPlugins").Include(
            "~/Scripts/jquery-plugins/sweetalert.js",
            "~/Scripts/jquery-plugins/numeral.js"));

            bundles.Add(new ScriptBundle("~/bundles/navBar").Include(
            "~/Scripts/Navbar/navbar.js"));

            bundles.Add(new ScriptBundle("~/bundles/jsUtility").Include(
            "~/Scripts/js-utility/accordion-utility.js"));

            bundles.Add(new ScriptBundle("~/bundles/env-variables").Include(
            "~/Scripts/env-variables/env.js"));

            
        }
    }
}