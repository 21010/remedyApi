module.exports = (data) => {

	const teamID = getItems(data.teamID);
	
	return `
        SELECT
	        Tickets.Assigned_Group_ID AS 'teamID',
	        Tickets.Assigned_Group AS 'teamName',
	        CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 111) AS 'date',
	        (SELECT COUNT(*) FROM ARSystem.dbo.HPD_Help_Desk AS Tickets2 WHERE Tickets2.Status IN (4,5) AND CONVERT(VARCHAR(7), DATEADD(second, Tickets2.Last_Resolved_Date, 'Jan 1, 1970'), 111) = CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 111) AND Tickets2.Assigned_Group_ID = Tickets.Assigned_Group_ID) AS 'closed',
	        (SELECT COUNT(*) FROM ARSystem.dbo.HPD_Help_Desk AS Tickets2 INNER JOIN ARSystem.dbo.SLM_Measurement AS SLM ON (SLM.ApplicationUserFriendlyID = Tickets2.Incident_Number) WHERE Tickets2.Status IN (4,5) AND SLM.MeasurementStatus = 5 AND SLM.GoalCategoryChar = 'Incident Response Time' AND CONVERT(VARCHAR(7), DATEADD(second, Tickets2.Last_Resolved_Date, 'Jan 1, 1970'), 111) = CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 111) AND Tickets2.Assigned_Group_ID = Tickets.Assigned_Group_ID) AS 'breachedResponseTime',
	        (SELECT COUNT(*) FROM ARSystem.dbo.HPD_Help_Desk AS Tickets2 INNER JOIN ARSystem.dbo.SLM_Measurement AS SLM ON (SLM.ApplicationUserFriendlyID = Tickets2.Incident_Number) WHERE Tickets2.Status IN (4,5) AND SLM.MeasurementStatus = 5 AND SLM.GoalCategoryChar = 'Incident Resolution Time' AND CONVERT(VARCHAR(7), DATEADD(second, Tickets2.Last_Resolved_Date, 'Jan 1, 1970'), 111) = CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 111) AND Tickets2.Assigned_Group_ID = Tickets.Assigned_Group_ID) AS 'breachedResolutionTime',
	        (SELECT CAST(100 - ((CAST(SUM(CASE WHEN SLM.MeasurementStatus = 5 THEN 1 ELSE 0 END) AS float) / CAST(SUM(CASE WHEN SLM.MeasurementStatus IN (4,5) THEN 1 ELSE 0 END) AS float)) * 100) AS decimal(18,2)) FROM ARSystem.dbo.HPD_Help_Desk AS Tickets2 INNER JOIN ARSystem.dbo.SLM_Measurement AS SLM ON (SLM.ApplicationUserFriendlyID = Tickets2.Incident_Number) WHERE Tickets2.Status IN (4,5) AND Tickets2.Assigned_Group_ID = Tickets.Assigned_Group_ID AND SLM.GoalCategoryChar = 'Incident Resolution Time' AND CONVERT(VARCHAR(7), DATEADD(second, Tickets2.Last_Resolved_Date, 'Jan 1, 1970'), 111) = CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 111)) AS 'sla'
        FROM
	        ARSystem.dbo.HPD_Help_Desk AS Tickets
        WHERE
	        CONVERT(date, DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970')) >= CONVERT(date, DATEADD(month, -6, DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)))
	        AND Tickets.Assigned_Group_ID IN (${teamID})
        GROUP BY
	        Tickets.Assigned_Group_ID,
	        Tickets.Assigned_Group,
	        CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 111)
        ORDER BY
	        Tickets.Assigned_Group_ID,
	        CONVERT(VARCHAR(7), DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970'), 111) DESC
    `;

};

const getItems = (items) => items.map(item => `'${item}'`).join(',');