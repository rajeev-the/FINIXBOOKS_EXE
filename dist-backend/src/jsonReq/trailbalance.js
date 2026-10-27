const getTrialBalance = (companyName, fromDate, toDate) => {
  return {
    static_variables: [
      {
        name: "svExportFormat",
        value: "jsonex",
      },
      {
        name: "svCurrentCompany",
        value: companyName,
      },
      {
        name: "svFromDate",
        value: fromDate,
      },
      {
        name: "svToDate",
        value: toDate,
      },
      {
        name: "ExplodeFlag",
        value: "Yes",
      },
    ],
  };
};

export default getTrialBalance;
