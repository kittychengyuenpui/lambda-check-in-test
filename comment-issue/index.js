var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

// spreadsheet key is the long id in the sheets URL
var spreadsheetId = process.env.spreadsheetId;
var doc = new GoogleSpreadsheet(spreadsheetId);
var sheet;

function step(){
	console.log('');
}


exports.handler = async(event, context, callback) => {
	//if (!event.body) return 'no body'
    //const body = JSON.parse(event.body) || {}
	console.log('Request Headers:', event.body);
	const body = event.body || event;
    if (!body || body.action !== 'created') return response(callback);
    const title = body.issue.title.split(' ');
    if (!title.length) return response(callback);
    const date = title[1];
    const account = body.comment.user.login;
    console.log('log:', date, account);
    try {
		await updateSheet(date, account);
        return callback(null, {
            statusCode: 200,
            body: date + account
        });
    } catch (err) {
        console.log('error:', err);
    }
      
    return response(callback);
};
  
const response = (cb) => {
    cb(null, {
        statusCode: 200,
        body: 'ok'
    })
}


async function updateSheet(date, account) {
  try {
		//await getSheet(step);
		var creds = require('./service-account-creds.json');
		var accountPosition;
		var datePosition;
		doc.useServiceAccountAuth(creds, step);
		doc.getInfo(function(err, info) {
		  console.log('Loaded doc: '+info.title+' by '+info.author.email);
		  sheet = info.worksheets[0];
		  console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
		  sheet.getCells({
			'min-row': 1,
			'max-row': 1
		  }, function(err, cells) {
			  for(var i = 0; i < sheet.colCount;i++){
				if (cells[i].value === account) {
					accountPosition = cells[i].col;
					break;
				} 
			  }
			  sheet.getCells({
				'min-col': 1,
				'max-col': 1
			  }, function(err, cells) {
				  for(var i = 0; i < sheet.rowCount;i++){
					if (cells[i].value === date) {
						datePosition = cells[i].row;
						break;
					} 
			  }
			  console.log('position:', accountPosition, datePosition)
			  if (!accountPosition || !datePosition) return '';
					
				sheet.getCells({
					'min-row': datePosition,
					'max-row': datePosition,
					'min-col': accountPosition,
					'max-col': accountPosition,
					'return-empty': true
				  }, function(err, cells) {
						if (cells && cells[0]) {
							cells[0].value = '✔'; 
							cells[0].save(function(err) {
							  if (err) {
								console.log('err', err);
							  }
							})
						}	  
					  
				  })
			  })
	  
			
		  })
		  

		});

		
		
		
    
  } catch (err) {
    console.log('err', err)
  }  
}
