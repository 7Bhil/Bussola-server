const Subscriber = require('../models/Subscriber');
const Message = require('../models/Message');
const mailer = require('../utils/mailer');

exports.subscribeNewsletter = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Cet email est déjà inscrit' });

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ message: 'Inscription réussie !' });
  } catch (error) {
    next(error);
  }
};

exports.sendContactMessage = async (req, res, next) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();

    // Notification admin
    mailer.sendContactNotification({
      name: newMessage.name,
      email: newMessage.email,
      subject: newMessage.subject,
      message: newMessage.message
    });

    res.status(201).json({ message: 'Votre message a été envoyé avec succès !' });
  } catch (error) {
    next(error);
  }
};

exports.getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
};

exports.getContactMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
