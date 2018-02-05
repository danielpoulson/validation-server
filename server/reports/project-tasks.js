const { printToCSV } = require('./reports');

exports.createProjectTaskReport = projects => {
  const reportName = 'Project_Tasks_Report';
  const fields = [
    { label: 'Project Description', value: 'pj_title' },
    { label: 'Task Start', value: 'TKStart' },
    { label: 'Task End', value: 'TKTarg' },
    { label: 'Status', value: 'TKStat' },
    { label: 'Resource', value: 'TKChamp' }
  ];

  let newArray = [];

  const data = projects.map(p => {
    newArray = [...newArray, { pj_title: `${p.pj_no} - ${p.pj_title}` }];

    if (p.tasks.length !== 0) {
      p.tasks.map(t => {
        newArray = [
          ...newArray,
          {
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
