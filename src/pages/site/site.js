import {getDateAndTime} from 'public/timeFormatHelpers';

$w.onReady(async function () {
});


// close notification alert
export function closeNotificationButton_click(event) {
	$w("#alert").collapse();
}

// collapse/expand notification list
export function notificationButton_click_1(event) {
	$w("#alert").collapse();
    if( $w("#notificationRepeater").collapsed ) {
  		$w("#notificationRepeater").expand();
	}
	else {
  		$w("#notificationRepeater").collapse();
	}
}


export function notificationRepeater_itemReady($item, itemData, index) {
	$item("#notificationEmail").text = itemData.userEmail;
	$item("#notificationTime").text = getDateAndTime(itemData._createdDate);
}