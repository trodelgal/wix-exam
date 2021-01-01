import wixData from 'wix-data';

export async function getNotificationData(followingArr){
    const notificationData = await wixData.query("messages").hasSome("_owner", followingArr).limit(6).find();
    return notificationData.items;
}

export async function searchMessagesQuery(search){
    const messagesSearched = await wixData.query("messages").contains("content",search).or(wixData.query("messages").contains("userEmail",search)).find();
    return messagesSearched.items;
}
