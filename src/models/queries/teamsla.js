module.exports = (data) => {
    
	const teamID = getItems(data.teamID);
	const months = data.months;
	const slaTarget = data.slaTarget;

	return `
    SELECT
    	Tickets.Assigned_Group_ID AS 'teamID',
	    Tickets.Assigned_Group AS 'teamName',
	    CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 120) AS 'ResolvedYearMonth',
	    SUM(CASE WHEN Tickets.Status IN (4,5) AND SLM.MeasurementStatus = 5 THEN 1 ELSE 0 END) AS 'missed',
	    SUM(CASE WHEN Tickets.Status IN (4,5) AND SLM.MeasurementStatus = 4 THEN 1 ELSE 0 END) AS 'meet',
	    SUM(CASE WHEN Tickets.Status IN (4,5) AND SLM.MeasurementStatus IN (4,5) THEN 1 ELSE 0 END) AS 'total',
	    CAST(100 - ((CAST(SUM(CASE WHEN Tickets.Status IN (4,5) AND SLM.MeasurementStatus = 5 THEN 1 ELSE 0 END) AS float) / CAST(SUM(CASE WHEN Tickets.Status IN (4,5) AND SLM.MeasurementStatus IN (4,5) THEN 1 ELSE 0 END) AS float)) * 100) AS decimal(18,2)) AS 'sla',
	    (SELECT 50) AS 'slaMin',
	    (SELECT 100) AS 'slaMax',
	    (SELECT ${slaTarget}) AS 'slaTarget'
    FROM
	    ARSystem.dbo.HPD_Help_Desk AS Tickets
	    INNER JOIN ARSystem.dbo.SLM_Measurement AS SLM ON (SLM.ApplicationUserFriendlyID = Tickets.Incident_Number)
    WHERE
	    Tickets.Assigned_Group_ID IN (${teamID})
	    AND SLM.GoalCategoryChar = 'Incident Resolution Time'
	    AND CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 120) IS NOT NULL
	    AND DATEDIFF(month, DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), GETDATE()) < ${months}
    GROUP BY
	    Tickets.Assigned_Group_ID,
	    Tickets.Assigned_Group,
	    CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 120)
    ORDER BY
	    CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 120)
    `;
};

const getItems = (items) => items.map(item => {return `'${item}'`;}).join(',');