module.exports = (data) => {

	return `
        SELECT
            Tickets.Incident_Number AS 'ticketNumber',
            CASE Tickets.Status WHEN 0 THEN 'New' WHEN 1 THEN 'Assigned' WHEN 2 THEN 'In Progress' WHEN 3 THEN 'Pending' WHEN 4 THEN 'Resolved' WHEN 5 THEN 'Closed' WHEN 6 THEN 'Cancelled' END AS 'ticketStatus',
            CASE Tickets.Priority WHEN 0 THEN 'Critical' WHEN 1 THEN 'High' WHEN 2 THEN 'Medium' WHEN 3 THEN 'Low' END AS 'ticketPriority',
            Tickets.Assigned_Group_ID AS 'teamID',
            Tickets.Assigned_Group AS 'teamName,
            Tickets.Assignee_Login_ID AS 'userID',
            Tickets.Assignee AS 'userName',
            Tickets.Description AS 'ticketSummary',
            CONVERT(date, DATEADD(second, Tickets.Reported_Date, 'Jan 1, 1970')) AS 'ticketReportedDate'
        FROM
            ARSystem.dbo.HPD_Help_Desk AS Tickets
        WHERE
            Tickets.Incident_Number = ${data.ticketNumber}
    `;

};