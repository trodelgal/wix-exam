import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixRealtime from 'wix-realtime';
import {sendMessage, deleteMessage} from 'backend/RealTime';
import {formatDaysAgo, debounce} from 'public/timeFormatHelpers';
import {getNotificationData, searchMessagesQuery} from 'public/databaseQueries';
import {messageChannel, deleteChannel} from 'public/channels';
const user = wixUsers.currentUser;

let followingUsers = [];

// on load function
$w.onReady(async function () {
	// get array of following users id 
	followingUsers = await getFollowingUsers();
	// get the last 6 user notification
	const userNotifications = await getNotificationData(followingUsers);
	$w("#notificationRepeater").data = userNotifications;

	// search with debounce
	$w("#searchInput").onInput(debounce((event)=>search(event.target.value),700))
	// real time connection
	wixRealtime.subscribe(messageChannel,(message)=>{
		$w("#messagesRead").refresh()
		setRepeater(message.payload)
		notification(message.payload)
	})

	wixRealtime.subscribe(deleteChannel,(message)=>{
		$w("#messagesRead").refresh()
		removeMessage(message.payload)
	})
});

// add new message
function setRepeater(newMessage){
	let data = $w("#mainRepeater").data;
	data.unshift(newMessage);
	$w("#mainRepeater").data = data;
}

// show alert notification
async function notification(newNotification){
	if(followingUsers.includes(newNotification._owner)){
		$w("#notificationAlertEmail").text = newNotification.userEmail;
		$w("#alertText").text = "Added new message";
		$w("#alert").expand();
		const userNotifications = await getNotificationData(followingUsers);
		$w("#notificationRepeater").data = userNotifications;
	}
}

// get the users that the currnt user following them
async function getFollowingUsers(){
	const userFollowd = await wixData.query("followers").eq("_owner", user.id).find();
	const followingArr = userFollowd.items.map((item)=>item.followedUserId)
	return followingArr
}

// to follow other user
const postFollowers = async (followedUserId,text) => {
	try{
		if(followedUserId !== user.id){
			if(text === "Follow user"){
				await wixData.insert("followers", {followedUserId});
				$w("#mainRepeater").forEachItem(($item,data)=>{
					if(data._owner === followedUserId){
						$item("#followButton").label = "Unfollow";
					}
				})
				setNotificationRepeater()
			}else{
				const toDelete = await wixData.query("followers").eq("_owner",user.id).eq("followedUserId",followedUserId).limit(1).find();
				await wixData.remove("followers", toDelete.items[0]._id);
				$w("#mainRepeater").forEachItem(($item,data)=>{
					if(data._owner === followedUserId){
						$item("#followButton").label = "Follow user";
					}
				})
				setNotificationRepeater()
			}
		}
	}catch(error){
		return console.error(error);
	}
}

// send message function
export async function sendButton_click(event) {
	try{
		$w("#error").hide()
		if($w("#messageContent").value!==''){
			const content = $w("#messageContent").value;
			const userEmail = await user.getEmail();
			const messageObject = {
				content,
				userEmail,
			}
			await sendMessage(messageObject);
			$w("#messageContent").value = "";
		}else{
			$w("#error").show()
		}
	}catch(error){
		return console.error(error);
	}

}

// repeater messages on ready
export async function mainRepeater_itemReady($item, itemData, index) {
	const followButton = $item("#followButton");
	$item("#ownerEmail").text = itemData._owner === user.id?"Me":itemData.userEmail;
	$item("#repeaterText").text = itemData.content;
	$item("#sentTime").text = formatDaysAgo(new Date(itemData._createdDate));
	followButton.label = followingUsers.some((id)=> id === itemData._owner)?"Unfollow":"Follow user";
	followButton.onClick(debounce(()=>postFollowers(itemData._owner, followButton.label),700))
	if(itemData._owner === user.id){
		await $item("#deleteButton").expand()
	}else{
		await $item("#deleteButton").collapse()
	}
}

// search for messages and show them
async function search(toSearch){
	const searchedQuery = await searchMessagesQuery(toSearch);
	$w("#mainRepeater").data = searchedQuery;
}

// change the notification list
async function setNotificationRepeater(){
	followingUsers = await getFollowingUsers();
	const userNotifications = await getNotificationData(followingUsers);
	$w("#notificationRepeater").data = userNotifications;
} 

// delete message button onclick function
export async function deleteButton_click(event) {
	await deleteMessage(event.context.itemId);
}

// remove message for all the users
function removeMessage(id){
	let data = $w("#mainRepeater").data;
	const Index = data.indexOf(data=>data._id===id);
	data.splice(Index,1);
	$w("#mainRepeater").data = data;
}

