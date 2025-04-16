const cron = require("node-cron");
const Chat = require("../models/chatMessage");
const ArchivedChat = require("../models/archivedChat");
const { Op } = require("sequelize");

// Runs every night at 11 AM
cron.schedule("0 11 * * *", async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get chats older than 1 day
    const oldChats = await Chat.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    if (oldChats.length === 0) return console.log("No old chats to archive.");

    // Archive them
    const chatData = oldChats.map(chat => chat.toJSON());
    await ArchivedChat.bulkCreate(chatData);

    // Delete from main table
    const idsToDelete = oldChats.map(chat => chat.id);
    await Chat.destroy({
      where: {
        id: {
          [Op.in]: idsToDelete
        }
      }
    });

    console.log(`Archived and deleted ${idsToDelete.length} chats.`);
  } catch (err) {
    console.error("Error archiving chats:", err);
  }
});
