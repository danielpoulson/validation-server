const { printToCSV } = require("./reports");

exports.createProjectTaskReport = projects => {
  const reportName = "Project_Tasks_Report";
  const fields = [
    { label: "Outline Level", value: "outline" },
    { label: "Name", value: "pj_title" },
    { label: "Start", value: "TKStart" },
    { label: "Finish", value: "TKTarg" },
    { label: "Status", value: "TKStat" },
    { label: "Resource Name", value: "TKChamp" }
  ];

  let newArray = [];

  const data = projects.map(p => {
    newArray = [
      ...newArray,
      { outline: 1, pj_title: `${p.pj_no} - ${p.pj_title}` }
    ];

    if (p.tasks.length !== 0) {
      p.tasks.map(t => {
        newArray = [
          ...newArray,
          {
            outline: 2,
            pj_title: t.TKName,
            TKStart: t.TKStart,
            TKTarg: t.TKTarg,
            TKStat: t.TKStat,
            TKChamp: t.TKChamp
          }
        ];
      });
    }
  });

  return printToCSV(newArray, reportName, fields);
};
