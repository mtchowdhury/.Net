using System.Web;
using System.Web.Optimization;

namespace ArmadaReports.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/jquery.browser.js",
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/datepicker/bootstrap-datepicker.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/numeral.js"));

            bundles.Add(new ScriptBundle("~/bundles/charts").Include(
                      "~/Scripts/Charts/canvasjs.js",
                      "~/Scripts/Charts/raphael.js",
                      "~/Scripts/Charts/jquery.usmap.js",
                      "~/Scripts/Charts/jquery.vmap.js",
                      "~/Scripts/Charts/jquery.vmap.usa.js",
                      "~/Scripts/Charts/column-chart-wrapper.js",
                      "~/Scripts/Charts/pie-chart-wrapper.js",
                      "~/Scripts/Charts/doughnut-chart-wrapper.js",
                      "~/Scripts/Charts/map-wrapper.js",
                      "~/Scripts/Charts/table-wrapper.js",
                      "~/Scripts/Charts/details-wrapper.js",
                      "~/Scripts/Charts/epipen-pie-chart-wrapper.js",
                      "~/Scripts/Charts/epipen-table-wrapper.js",
                      "~/Scripts/Charts/epipen-map-wrapper.js",
                      "~/Scripts/Charts/epipen-details-wrapper.js",
                      "~/Scripts/Charts/enrollment-wrapper.js"));

            bundles.Add(new ScriptBundle("~/bundles/utility").Include(
                      "~/Scripts/Utility/popup-utility.js",
                      "~/Scripts/Utility/epipen-popup-utility.js",
                      "~/Scripts/Utility/utility.js"));

            bundles.Add(new ScriptBundle("~/bundles/service").Include(
                      "~/Scripts/Service/repository-service.js",
                      "~/Scripts/Service/epipen-repository-service.js"));

            bundles.Add(new ScriptBundle("~/bundles/reportrequestservice").Include(
                      "~/Scripts/ReportRequestService/report-service.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/datepicker/bootstrap-datepicker.css",
                      "~/Content/site.css",
                      "~/Content/jqvmap.css",
                      "~/Content/font-aewsome/font-awesome.css"));
        }
    }
}
