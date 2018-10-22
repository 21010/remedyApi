module.exports = (data) => {

	const userID = getItems(data.userID);
	const teamCondition = data.teamID ? getTeams(data.teamID) : '';

	return `
    SELECT
        Tickets.Assigned_Group_ID AS 'teamID',
        Tickets.Assigned_Group AS 'teamName',
        Tickets.Assignee_Login_ID AS 'userID',
        Tickets.Assignee AS 'userName',
        (SELECT CONVERT(date, GETDATE())) AS 'date',
        SUM(CASE WHEN Tickets.Status < 4 THEN 1 ELSE 0 END) AS 'queue',
        SUM(CASE WHEN Tickets.Status = 2 THEN 1 ELSE 0 END) AS 'inProgress',
        SUM(CASE WHEN Tickets.Priority = 1 AND Tickets.Status < 4 THEN 1 ELSE 0 END) AS 'highPriority',
        SUM(CASE WHEN Tickets.Priority = 0 AND Tickets.Status < 4 THEN 1 ELSE 0 END) AS 'criticalPriority',
        SUM(CASE WHEN Tickets.SLM_Status = 2 AND Tickets.Status < 4 THEN 1 ELSE 0 END) AS 'dueToBreach',
        (SELECT COUNT(*) FROM ARSystem.dbo.HPD_Help_Desk AS Tickets2 INNER JOIN ARSystem.dbo.SLM_Measurement AS SLM ON (SLM.ApplicationUserFriendlyID = Tickets2.Incident_Number) WHERE Tickets2.Status IN (4,5) AND Tickets2.Assigned_Group = Tickets.Assigned_Group AND CONVERT(date,  DATEADD(second, Tickets2.Last_Resolved_Date, 'Jan 1, 1970')) >= CONVERT(date, DATEADD( month, 0, DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) ) ) AND SLM.MeasurementStatus = 5 AND SLM.GoalCategoryChar = 'Incident Response Time') AS 'breachedAssignment',
        (SELECT COUNT(*) FROM ARSystem.dbo.HPD_Help_Desk AS Tickets2 INNER JOIN ARSystem.dbo.SLM_Measurement AS SLM ON (SLM.ApplicationUserFriendlyID = Tickets2.Incident_Number) WHERE Tickets2.Status IN (4,5) AND Tickets2.Assigned_Group = Tickets.Assigned_Group AND CONVERT(date,  DATEADD(second, Tickets2.Last_Resolved_Date, 'Jan 1, 1970')) >= CONVERT(date, DATEADD( month, 0, DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) ) ) AND SLM.MeasurementStatus = 5 AND SLM.GoalCategoryChar = 'Incident Resolution Time') AS 'breachedResolution',
        SUM(CASE WHEN Tickets.Status IN (4,5) AND CONVERT(date, DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970')) >= CONVERT(date, DATEADD( month, 0, DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) ) ) THEN 1 ELSE 0 END) AS 'closed',
        CONVERT(decimal(6,2), (100 - (CAST((SELECT COUNT(*) FROM ARSystem.dbo.HPD_Help_Desk AS Tickets2 INNER JOIN ARSystem.dbo.SLM_Measurement AS SLM ON (SLM.ApplicationUserFriendlyID = Tickets2.Incident_Number) WHERE Tickets2.Assigned_Group = Tickets.Assigned_Group AND CONVERT(date,  DATEADD(second, Tickets2.Last_Resolved_Date, 'Jan 1, 1970')) >= CONVERT(date, DATEADD(month, 0, DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) ) ) AND SLM.MeasurementStatus = 5 AND SLM.GoalCategoryChar = 'Incident Resolution Time') AS float) / CAST(SUM(CASE WHEN Tickets.Status IN (4,5) AND CONVERT(date,  DATEADD(second, Tickets.Last_Resolved_Date, 'Jan 1, 1970')) >= CONVERT(date, DATEADD( month, 0, DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0) ) ) THEN 1 ELSE 0 END) AS float)) * 100)) AS 'sla',
        (SELECT 50) AS 'slaMin',
        (SELECT 100) AS 'slaMax',
        (SELECT 96) AS 'slaTarget'
    FROM
        ARSystem.dbo.HPD_Help_Desk AS Tickets
    WHERE
        Tickets.Assignee_Login_ID IN (${userID})
        ${teamCondition}
    GROUP BY
        Tickets.Assigned_Group_ID,
        Tickets.Assigned_Group,
        Tickets.Assignee_Login_ID,
        Tickets.Assignee
    ORDER BY
        Tickets.Assigned_Group
    `;

};

const getItems = (items) => items.map(item => {return `'${item}'`;}).join(',');
const getTeams = (teams) => {
	return `AND Tickets.Assigned_Group_ID IN (${getItems(teams)})`;
};