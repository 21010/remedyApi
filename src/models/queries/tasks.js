module.exports = data => {

	const status = data.status ? `Tasks.Status IN (${data.status})` : 'Tasks.Status > 1000 AND Status < 6000';
	const userName = data.userName ? `AND Assignee = '${data.userName}'` : '';
	const teamID = data.teamID ? `AND Assignee_Group_Id = '${data.teamID}'` : '';
	const where = `${status} ${userName} ${teamID}`;

	return `
        SELECT
	        Tasks.Task_ID AS 'Task_Number',
	        CASE Tasks.Status
		    	WHEN 1000 THEN 'Staged'
		    	WHEN 2000 THEN 'Assigned'
		    	WHEN 3000 THEN 'Pending'
		    	WHEN 4000 THEN 'In Progress'
		    	WHEN 6000 THEN 'Closed'
		    	WHEN 7000 THEN 'ByPassed'
	    	END AS 'Status',
	    	Tasks.Summary,
	    	Tasks.Assignee_Group,
	    	Tasks.Assignee AS 'Task_Assignee',
	    	Tasks.RootRequestID AS 'Ticket_Number',
			Tickets.Assignee AS 'Ticket_Assignee',
	    	Tickets.Assignee_Login_ID AS 'Ticket_Assignee_ID'
    	FROM 
			ARSystem.dbo.NSG_TasktoHPD_Join AS Tasks
			INNER JOIN ARSystem.dbo.HPD_Help_Desk AS Tickets
			ON Tasks.RootRequestID = Tickets.Incident_Number
		WHERE 
			${where}
		ORDER BY
	    	Tasks.Status, Tasks.Summary, Tasks.Assignee
    	`;

};