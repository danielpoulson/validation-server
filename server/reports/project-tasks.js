const { printToCSV } = require("./reports");

exports.createProjectTaskReport = projects => {
  //   const data = projects;
  const reportName = "Project_Tasks_Report";
  const fields = ["pj_no", "pj_title"];
  const fieldNames = ["Project No", "Project Description"];

  const data = projects.map(p => {
    return { pjno: p.pj_no, pj_title: p.pj_title };
  });

  return data;

  //   return printToCSV(data, reportName, fields, fieldNames);
};
