const prisma = require('../lib/prisma');
const mailer = require('../utils/mailer');

const formatItem = (i) => i ? { ...i, _id: i.id } : null;

exports.subscribeNewsletter = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Cet email est déjà inscrit' });

    await prisma.subscriber.create({ data: { email } });
    res.status(201).json({ message: 'Inscription réussie !' });
  } catch (error) {
    next(error);
  }
};

exports.sendContactMessage = async (req, res, next) => {
  try {
    const { type, name, email, subject, message, status } = req.body;
    const newMessage = await prisma.message.create({
      data: {
        type: type || 'contact',
        name,
        email,
        subject: subject || null,
        message,
        status: status || 'nouveau'
      }
    });

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
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscribers.map(formatItem));
  } catch (error) {
    next(error);
  }
};

exports.getContactMessages = async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages.map(formatItem));
  } catch (error) {
    next(error);
  }
};
