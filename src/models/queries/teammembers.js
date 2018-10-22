module.exports = data => {
	
	const teamID = getItems(data.teamID);
	
	return `
        SELECT
	        Team.Login_ID AS 'id',
	        Team.Full_Name AS 'name'
        FROM 
	        ARSystem.dbo.CTM_Support_Group_Assoc_LookUp AS Team
        WHERE 
		        Team.Support_Group_ID IN '${teamID}' 
	        AND Team.Assignment_Availability = 0
        ORDER BY
	        Team.Full_Name
    `;

};

const getItems = (items) => items.map(item => {return `'${item}'`;}).join(',');