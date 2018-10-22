module.exports = {

	// server application configuration
	'App' : {
		'name'    : 'itis-remedyapi',
		'title'   : 'itisdash Remedy API',
		'port'    : 3111,
		'host'    : 'localhost',
		'service' : {
			'options': {
				'programArgs': ['--run']
			}
		},
		'secret'  : [
			'LVm=b@:Nkd0^r?^Xgrv|`VPSrD(*',
			'c#6pCCVs^L^PfPS"F"$)WA3%,]Xh',
			')KcGKji(7T1m:UHgz}!4;1V:TaQQ',
			'nY::1A;u=:=n"O6*^jnuPgLP`ij-'
		]
	},

	// BMC Remedy database configuration (MSSQL database)
	'DB' : {
		'config' : {
			'user'     : 'userid',
			'password' : 'password',
			'server'   : 'mssqlserver',
			'database' : 'database',
			'options'  : { encrypt: false }
		}
	}

};