const Message = require("../Models/messages");
const AppError = require("../Helpers/AppError");

const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({});
    if (!messages.length) {
      return next(new AppError("no any messages yet", 404));
    }
    res.send(messages);
  } catch (error) {
    return next(new AppError("Error updating review", 500));
  }
};

const addNewMessages = async (req, res, next) => {
  try {
    const { name, message: mes } = req.body;
    const message = new Message({
      name,
      message: mes,
      dateTime: new Date(),
    });
    await message.save();
    res.send(message);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllMessages,
  addNewMessages,
};
