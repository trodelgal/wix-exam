export function formatDaysAgo(date) {
	var ago = new Date().getTime() - date.getTime();
	if (ago < 44 * 1000)
		return "a few seconds ago";
	else if (ago < 89 * 1000)
		return "a minute ago";
	else if (ago < 44 * 60 * 1000)	
		return Math.round(ago / 60 / 1000) + ' minutes ago';
	else if (ago < 89 * 60 * 1000)
		return "an hour ago";
	else if (ago < 21 * 60 * 60 * 1000)
		return Math.round(ago / 60 / 60 / 1000) + ' hours ago';
	else if (ago < 35 * 60 * 60 * 1000)
		return "a day ago";
	else if (ago < 25 * 24 * 60 * 60 * 1000)
		return Math.round(ago / 24 / 60 / 60 / 1000) + ' days ago';
	else if (ago < 45 * 24 * 60 * 60 * 1000)
		return 'a month ago';
	else if (ago < 319 * 24 * 60 * 60 * 1000)
		return Math.round(ago / 29 / 24 / 60 / 60 / 1000) + ' months ago';
	else if (ago < 547 * 24 * 60 * 60 * 1000)
		return 'a year ago';
	else 
		return Math.round(ago / 365 / 24 / 60 / 60 / 1000) + ' years ago';
}

export function getDateAndTime(date){
const baseDate = new Date(date);
  return `${baseDate.getDate().toString().padStart(2, "0")}/${(
    baseDate.getMonth() + 1
  )
    .toString()
    .padStart(
      2,
      "0"
    )}/${baseDate.getFullYear()} - ${baseDate
    .toLocaleTimeString()
    .slice(0, -3)}`;
}

export function debounce(func,delay){
    let timeoutId;
    return function(...args){
        if(timeoutId){
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(()=>{
            func(...args)
        },delay)
    }
}