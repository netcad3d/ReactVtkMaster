const { User } = require("../models/User");
const mdq = require('mongo-date-query');
const File = require("../models/File");

const checkInterval = 86400000; //1 day in milliseconds

const checkUsers=()=> {
	console.log("*** Cleaner Looking For Inactive Users ***");
  
	let userId;
	User.findOne({ verified: false, deactivatedOn: mdq.beforeLastDays(2) })
	  .exec()
	  .then((user) => {
		if (!user) {
		  throw "No Inactive Account Found"; //this message shows in the catch block below when no user is found
		}
		/*else {
		  userId = user._id;
		  console.log(`User with pending deletion found (email: ${user.email})`);
		  return Message.remove({ user: userId });
		}*/
	  })
	  .then(() => {
		console.log("All user files removed");
		return File.remove({ userId: userId });
	  })
	  .then(() => {
		console.log(`User removed from database`);
		setTimeout(checkUsers, checkInterval);
	  })
	  .catch(e => {
		console.log(e);
		setTimeout(checkUsers, checkInterval);
	  })
  }
  module.exports = checkUsers;