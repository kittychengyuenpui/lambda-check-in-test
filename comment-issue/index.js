var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

// spreadsheet id is the long id in the spreadsheets URL
var spreadsheetId = process.env.spreadsheetId;
var doc = new GoogleSpreadsheet(spreadsheetId);
var sheet;
var moment = require('moment-timezone');

function step(){
	console.log('');
}


exports.handler = async(event, context, callback) => {
    const body = event.body || event;
    if (!body || body.action !== 'created') return response(callback);
    const title = body.issue.title.split(' ');
    if (!title.length) return response(callback);
    const date = title[1];
    const account = body.comment.user.login;
	const commentAt = body.comment.updated_at.split('Z');
	const localDateTime = moment(body.comment.updated_at).tz("Asia/Hong_Kong").utcOffset('+0800').format();
	const localCommentAt = localDateTime.split('T');
	if(localCommentAt[0] != date) return response(callback);
	const commentTime = localCommentAt[1].split('Z')[0];	
	const ct = commentTime.split(':');
	const commentTime2 = ct[0] + ':' + ct[1];
	
    console.log('log:', date, account, commentTime2);
    try {
		await updateSheet(date, account, commentTime2);
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


async function updateSheet(date, account, commentTime) {
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
							cells[0].value = commentTime; 
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
