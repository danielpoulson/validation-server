const { dpFormatDate, compare } = require("../helpers/data-array");
const { printToCSV } = require("./reports");

exports.createProjectTaskReport = (projects, reportName) => {
  const fields = [
    { label: "Outline Level", value: "outline" },
    { label: "Name", value: "pj_title" },
    { label: "Start", value: "TKStart" },
    { label: "Finish", value: "TKTarg" },
    { label: "Status", value: "TKStat" },
    { label: "Resource Names", value: "TKChamp" },
    { label: "% Complete", value: "TKpcent" },
    { label: "Text1", value: "_id" }
  ];

  let newArray = [];

  const data = projects.map(p => {
    newArray = [
      ...newArray,
      { outline: 1, pj_title: `${p.pj_no} - ${p.pj_title}`, _id: p._id }
    ];

    if (p.tasks.length !== 0) {
      const sortedArray = p.tasks.sort((a, b) => {
        if (a.TKStart < b.TKStart) return -1;
        if (a.TKStart > b.TKStart) return 1;
        return 0;
      });

      sortedArray.map(t => {
        newArray = [
          ...newArray,
          {
            outline: 2,
            pj_title: t.TKName,
            TKStart:
              typeof t.TKStart != "undefined" ? dpFormatDate(t.TKStart) : "",
            TKTarg:
              typeof t.TKTarg != "undefined" ? dpFormatDate(t.TKTarg) : "",
            TKStat: t.TKStat,
            TKChamp: t.TKChamp,
            TKpcent: t.TKpcent,
            _id: t._id
          }
        ];
      });
    }
  });

  return printToCSV(newArray, reportName, fields);
};
