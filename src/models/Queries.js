// sql query routes
module.exports = {

	// team
	// team members (teamID)
	teammembers(data) {
		if (!data.teamID || !Array.isArray(data.teamID)) { return error('teamID (Array)'); }
		return success( require('./queries/teammembers')({ teamID : data.teamID }) );
	},
	// team current stats (teamID)
	teamsummary(data) {
		if (!data.teamName || !Array.isArray(data.teamName)) { return error('teamName (Array)'); }
		return success( require('./queries/teamsummary')({ teamName : data.teamName }));
	},
	// team statistics (current month)
	teamstatistics(data) {
		if (!data.teamID || !Array.isArray(data.teamID)) { return error('teamID (Array)'); }
		return success(require('./queries/teamstatistics')({ teamID : data.teamID }));
	},
	// team sla in given period of time (months)
	teamsla(data) {
		if (!data.teamID || !Array.isArray(data.teamID)) { return error('teamID (Array)'); }
		const months = data.months ? data.months : 6;
		const slaTarget = data.slaTarget ? data.slaTarget : 96;
		return success(require('./queries/teamsla')({teamID: data.teamID, months, slaTarget}));
	},
	// team name (teamID)
	teamname(data) {
		if (!data.teamID || !Array.isArray(data.teamID)) { return error('teamID (Array)'); }
		return success(require('./queries/team')({ teamID : data.teamID }));
	},
	// team id (teamName)
	teamid(data) {
		if (!data.teamName || !Array.isArray(data.teamName)) { return error('teamName (Array)'); }
		return success(require('./queries/team')({ teamName: data.teamName }));
	},

	// ticket
	// ticket details (ticketNumber)
	ticket(data) {
		if (!data.ticketNumber) { return error('ticketNumber'); }
		return success(require('./queries/ticket')({ ticketNumber: data.ticketNumber }));
	},

	// tickets
	tickets(data) {
		const userID = data.userID ? data.userID : false;
		const teamID = data.teamID ? data.teamID : false;
		const status = data.status ? data.status : false;
		const slmStatus = data.slmStatus ? data.slmStatus : false;
		const priority = data.priority ? data.priority : false;
		const top = data.top ? data.top : false;
		const orderby = data.orderby ? data.orderby : false;
		return success(require('./queries/tickets')({ userID, teamID, status, slmStatus, priority, top, orderby }));
	},
	// active tickets for selected team (and user if provided) (teamID, *userID)
	activetickets(data) {
		const userID = data.userID ? data.userID : false;
		const teamID = data.teamID ? data.teamID : false;
		return success(require('./queries/tickets')({ userID, teamID }));
	},
	// top 5 oldest tickets for selected team (and user) (teamID, *userID, top)
	oldesttickets(data) {
		const userID = data.userID ? data.userID : false;
		const teamID = data.teamID ? data.teamID : false;
		const top = data.top ? data.top : 5;
		const orderby = 'Tickets.Submit_date';
		return success(require('./queries/tickets')({ top, userID, teamID, orderby }));
	},
	// due to breach tickets for team (and user) (teamID, *userID)
	duetobreachtickets(data) {
		if (!data.teamID) { return error('teamID'); }
		const userID = data.userID ? data.userID : false;
		const teamID = data.teamID;
		const slmStatus = 2;
		return success(require('./queries/tickets')({ userID, teamID, slmStatus }));
	},
	// breached tickets for team (and user) (teamID, *userID)
	breachedtickets(data) {
		if (!data.teamID) { return error('teamID'); }
		const userID = data.userID ? data.userID : false;
		const teamID = data.teamID;
		const slmStatus = 3;
		return success(require('./queries/tickets')({ userID, teamID, slmStatus }));
	},
	// critical priority (0) tickets for team (and user) (teamID, *userID)
	criticalprioritytickets(data) {
		if (!data.teamID) { return error('teamID'); }
		const userID = data.userID ? data.userID : false;
		const teamID = data.teamID;
		const priority = 0;
		return success(require('./queries/tickets')({ userID, teamID, priority }));
	},
	// high priority ticket (1) tickets for team (and user) (teamID, *userID)
	highprioritytickets(data) {
		if (!data.teamID) { return error('teamID'); }
		const userID = data.userID ? data.userID : false;
		const teamID = data.teamID;
		const priority = 1;
		return success(require('./queries/tickets')({ userID, teamID, priority }));
	},
	// tickets with high or critical priority
	higherprioritytickets(data) {
		if (!data.teamID) { return error('teamID'); }
		const userID = data.userID ? data.userID : false;
		const teamID = data.teamID;
		const priority = '0, 1';
		return success(require('./queries/tickets')({ userID, teamID, priority }));
	},

	// tasks
	// active tasks for team (and user) (teamID, *userName)
	tasks(data) {
		const status = data.status ? data.status : false;
		const userName = data.userName ? data.userName : false;
		const teamID = data.teamID ? data.teamID : false;
		return success(require('./queries/tasks')({ status, userName, teamID }));
	}
};

// error handling
function error(data) {
	return {
		status: false,
		message: `Missing or incorrect data provided - ${data}`
	};
}

function success(query) {
	return {
		status: true,
		message: 'Data retrieved',
		query
	};
}