const prisma = require('../lib/prisma');
const mailer = require('../utils/mailer');

const formatNews = (n) => n ? { ...n, _id: n.id } : null;

// Récupérer toutes les news publiées (Public)
exports.getAllNews = async (req, res, next) => {
  try {
    const news = await prisma.news.findMany({
      where: { published: true, archived: false },
      orderBy: { createdAt: 'desc' }
    });
    res.json(news.map(formatNews));
  } catch (error) {
    next(error);
  }
};

// Récupérer toutes les news (Admin)
exports.getAdminNews = async (req, res, next) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(news.map(formatNews));
  } catch (error) {
    next(error);
  }
};

// Récupérer une news par son ID
exports.getNewsById = async (req, res, next) => {
  try {
    const news = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!news) return res.status(404).json({ message: 'Article non trouvé' });
    res.json(formatNews(news));
  } catch (error) {
    next(error);
  }
};

exports.createNews = async (req, res, next) => {
  try {
    const { title, content, summary, image, category, author, date, published, archived } = req.body;
    const newArticle = await prisma.news.create({
      data: {
        title,
        content,
        summary: summary || null,
        image: image || null,
        category: category || 'Information',
        author: author || 'Équipe Busola',
        date: date ? new Date(date) : new Date(),
        published: published !== undefined ? Boolean(published) : true,
        archived: archived !== undefined ? Boolean(archived) : false
      }
    });

    if (newArticle.published) {
      await sendNewsletter(newArticle);
    }

    res.status(201).json(formatNews(newArticle));
  } catch (error) {
    next(error);
  }
};

// Modifier une news
exports.updateNews = async (req, res, next) => {
  try {
    const oldArticle = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!oldArticle) return res.status(404).json({ message: 'Article non trouvé' });

    const { title, content, summary, image, category, author, date, published, archived } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (summary !== undefined) data.summary = summary;
    if (image !== undefined) data.image = image;
    if (category !== undefined) data.category = category;
    if (author !== undefined) data.author = author;
    if (date !== undefined) data.date = date ? new Date(date) : new Date();
    if (published !== undefined) data.published = Boolean(published);
    if (archived !== undefined) data.archived = Boolean(archived);

    const article = await prisma.news.update({
      where: { id: req.params.id },
      data
    });
    
    if (!oldArticle.published && article.published) {
      await sendNewsletter(article);
    }

    res.json(formatNews(article));
  } catch (error) {
    next(error);
  }
};

// Supprimer définitivement
exports.deleteNews = async (req, res, next) => {
  try {
    const article = await prisma.news.delete({ where: { id: req.params.id } }).catch(() => null);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

/**
 * Fonction utilitaire pour envoyer la newsletter
 */
async function sendNewsletter(article) {
  try {
    const subscribers = await prisma.subscriber.findMany({ select: { email: true } });
    const emailList = subscribers.map(s => s.email);
    
    if (emailList.length > 0) {
      mailer.sendNewsletterNotification(emailList, {
        title: article.title,
        summary: article.summary,
        id: article.id
      });
    }
  } catch (e) {
    console.error('Erreur lors de l\'envoi de la newsletter:', e);
  }
}
