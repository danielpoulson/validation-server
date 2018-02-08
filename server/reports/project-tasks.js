const utils = require("../config/utils");
const { printToCSV } = require("./reports");

exports.createProjectTaskReport = (projects, reportName) => {
  const fields = [
    { label: "Outline Level", value: "outline" },
    { label: "Name", value: "pj_title" },
    { label: "Start", value: "TKStart" },
    { label: "Finish", value: "TKTarg" },
    { label: "Status", value: "TKStat" },
    { label: "Resource Name", value: "TKChamp" },
    { label: "% Complete", value: "TKpcent" }
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
            TKStart:
              typeof t.TKStart != "undefined"
                ? utils.dpFormatDate(t.TKStart)
                : "",
            TKTarg:
              typeof t.TKTarg != "undefined"
                ? utils.dpFormatDate(t.TKTarg)
                : "",
            TKStat: t.TKStat,
            TKChamp: t.TKChamp,
            TKpcent: t.TKpcent
          }
        ];
      });
    }
  });

  return printToCSV(newArray, reportName, fields);
};
