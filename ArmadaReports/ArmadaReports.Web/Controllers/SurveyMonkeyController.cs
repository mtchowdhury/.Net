using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArmadaReports.Web.Extension;
using ArmadaReports.Web.SurveyMonkey;
using ArmadaReports.Web.SurveyMonkey.Model;

namespace ArmadaReports.Web.Controllers
{
    [Authorize]
    [FormTimeout]
    public class SurveyMonkeyController : Controller
    {
        [HttpGet]
        public JsonResult GetAvgAnswerByQuestionType(string questionType, int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var data = new StoredProcedureService(connectionString).GetData<AvgAnswerByQuestionType>("rv_AVGAnswerByQuestionType",
                new SqlParameter[] { new SqlParameter("@QuestionType", questionType), new SqlParameter("@ProgramId", programId) }).ToList();

            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetAnswersStatsByQuestion(string question, int programId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["connString"].ConnectionString;
            var data = new StoredProcedureService(connectionString).GetData<AnswersStatsByQuestion>("rv_AnswersStatsByQuestion",
                new SqlParameter[] { new SqlParameter("@Question", question), new SqlParameter("@ProgramId", programId) }).ToList();

            var answerList = data.Select(d => d.Answer).OrderBy(d => d).Distinct().ToList();
            if (answerList.Any(a => a.ToLower() == "yes"))
                answerList.Reverse();
            var weeks = data.Select(d => d.WeekFormatted).Distinct().ToList();
            var dataPointList = new List<DataPointList>();
            foreach (var answer in answerList)
            {
                var points = new List<DataPoint>();
                var i = 1;
                foreach (var week in weeks)
                {
                    var numerator = data.Where(d => d.Answer == answer && d.WeekFormatted == week).Sum(d => d.NumberofRecords);
                    var denominator = data.Where(d => d.WeekFormatted == week).Sum(d => d.NumberofRecords);
                    points.Add(new DataPoint
                    {
                        x = i++,
                        label = week,
                        y = denominator == 0 ? 0.0 : Math.Round(((double)numerator / denominator), 2) * 100,
                        legendText = (denominator == 0 ? 0.0 : Math.Round(((double)numerator / denominator), 2) * 100) + "%<br/>" +
                        GetAnswerString(question, answer) + "<br/>" + week
                    });
                }
                dataPointList.Add(new DataPointList
                {
                    Points = points,
                    Title = GetAnswerString(question, answer)
                });
            }

            return Json(dataPointList, JsonRequestBehavior.AllowGet);
        }

        private string GetAnswerString(string question, string answer)
        {
            if (question.ToLower()
                .Equals("did the representative state they were calling/are from the pharmacy, patient, or doctor and not on behalf of?"))
                return answer.ToLower() == "yes"
                    ? answer + " = Not Compliant"
                    : answer.ToLower() == "no" ? answer + " = Compliant" : answer;
            return answer.ToLower() == "yes"
                ? answer + " = Compliant"
                : answer.ToLower() == "no" ? answer + " = Not Compliant" : answer;
        }
    }
}