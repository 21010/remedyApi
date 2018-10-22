module.exports = (data) => {

	return `
        SELECT 
            Teams.Support_Group_ AS 'teamName', 
            Teams.Support_Group_ID AS 'teamId',
            Teams.Remedy_Login_ID AS 'userId' 
        FROM 
            CTM_SupportGroupAssociationLoo AS Teams
        WHERE 
            Teams.Remedy_Login_ID IN (${getItems(data.userID)})
    `;

};

const getItems = (items) => items.map(item => `'${item}'`).join(',');