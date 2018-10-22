module.exports = (data) => {

	const top = data.top ? `TOP ${data.top}` : '';
	const status = data.status ? `Tickets.Status IN (${data.status})` : 'Tickets.Status < 4';
	const userID = data.userID ? `AND Tickets.Assignee_Login_Id = '${data.userID}'` : '';
	const teamID = data.teamID ? `AND Tickets.Assigned_Group_Id = '${data.teamID}'` : '';
	const slmStatus = data.slmStatus ? `AND Tickets.SLM_Status IN (${data.slmStatus})` : '';
	const priority = data.priority ? `AND Tickets.Priority IN (${data.priority})` : '';
	const ticketNumber = data.ticketNumber ? `AND Tickets.Incident_Number LIKE '%${data.ticketNumber}%'` : '';
	const customerName = data.customerName ? `AND Tickets.Full_Name LIKE '%${data.customerName}%'` : '';
	const customerID = data.customerID ? `AND Tickets.Corporate_ID LIKE '%${data.customerID}%'` : '';
	const summary = data.summary ? `AND Tickets.Description LIKE '%${data.summary}%'` : '';
	const description = data.description ? `AND Ticket.Detailed_Decription LIKE '%${data.description}%'` : '';
	const where = `${status} ${userID} ${teamID} ${slmStatus} ${priority} ${ticketNumber} ${customerName} ${customerID} ${summary} ${description}`;
	const orderby = data.orderby ? `${data.orderby}` : '';

	return `
        SELECT ${top}
            Tickets.Incident_Number AS 'Incident Number',
            Tickets.SRID AS 'Request Number',
            CASE Tickets.Status
                WHEN 0 THEN 'New'
                WHEN 1 THEN 'Assigned'
                WHEN 2 THEN 'In Progress'
                WHEN 3 THEN 'Pending'
                WHEN 4 THEN 'Resolved'
                WHEN 5 THEN 'Closed'
                WHEN 6 THEN 'Cancelled'
            END AS 'Status',
            Tickets.Status AS 'Status#',
            CASE Tickets.Priority
                WHEN 0 THEN 'Critical'
                WHEN 1 THEN 'High'
                WHEN 2 THEN 'Medium'
                WHEN 3 THEN 'Low'
            END AS 'Priority',
            Tickets.Priority AS 'Priority#',
            CASE Tickets.SLM_Status
                WHEN 1 THEN 'Normal'
                WHEN 2 THEN 'Due to breach'
                WHEN 3 THEN 'Breached'
            END AS 'SLM Status',
            Tickets.SLM_Status,
            Tickets.Assigned_Group AS 'Team',
            Tickets.Full_Name AS 'User Name',
            Tickets.Corporate_ID AS 'User ID',
            Tickets.Description AS 'Summary',
            Tickets.Detailed_Decription AS 'Description'
        FROM
            ARSystem.dbo.HPD_Help_Desk AS Tickets
        WHERE
            ${where}
        ORDER BY
            ${orderby || 'Tickets.Submit_date DESC'}
    `;

};
