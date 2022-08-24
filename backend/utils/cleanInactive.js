const checkInterval = 5000;

export function checkUsers() {
	console.log("*** Cleaner Looking For Users ***");
  
	let userId;
	User.findOne({ active: false, deactivatedOn: mdq.beforeLastDays(20) })
	  .exec()
	  .then((user) => {
		if (!user) {
		  throw "No User Found"; //this message shows in the catch block below when no user is found
		}
		else {
		  userId = user._id;
		  console.log(`User with pending deletion found (email: ${user.email})`);
		  return Message.remove({ user: userId });
		}
	  })
	  .then(() => {
		console.log("All user messages removed");
		return Project.remove({ user: userId });
	  })
	  .then(() => {
		console.log("All user projects removed");
		return User.findByIdAndRemove(userId);
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