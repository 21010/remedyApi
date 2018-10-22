module.exports = (data) => {

	const teamID = data.teamID ? `Team.Support_Group_ID IN (${getItems(data.teamID)})` : '';
	const teamName = data.teamName ? `Team.Support_Group_Name IN (${getItems(data.teamName)})` : '';
	const where = teamID || teamName;

	return `
        SELECT
	        Team.Support_Group_ID AS 'id',
	        Team.Support_Group_Name AS 'name'
        FROM
	        ARSystem.dbo.CTM_Support_Group AS Team
        WHERE
	        ${where}
    `;

};

const getItems = (items) => items.map(item => `'${item}'`).join(',');