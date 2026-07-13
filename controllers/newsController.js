const News = require('../models/News');
const Subscriber = require('../models/Subscriber');
const mailer = require('../utils/mailer');

// Récupérer toutes les news publiées (Public)
exports.getAllNews = async (req, res, next) => {
  try {
    const news = await News.find({ published: true }).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    next(error);
  }
};

// Récupérer toutes les news (Admin)
exports.getAdminNews = async (req, res, next) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    next(error);
  }
};

// Récupérer une news par son ID
exports.getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Article non trouvé' });
    res.json(news);
  } catch (error) {
    next(error);
  }
};

exports.createNews = async (req, res, next) => {
  try {
    const newArticle = new News(req.body);
    await newArticle.save();

    // Si l'article est publié à la création, on envoie la newsletter
    if (newArticle.published) {
      await sendNewsletter(newArticle);
    }

    res.status(201).json(newArticle);
  } catch (error) {
    next(error);
  }
};

// Modifier une news
exports.updateNews = async (req, res, next) => {
  try {
    const oldArticle = await News.findById(req.params.id);
    if (!oldArticle) return res.status(404).json({ message: 'Article non trouvé' });

    const article = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Si l'article passe de non publié à publié, on envoie la newsletter
    if (!oldArticle.published && article.published) {
      await sendNewsletter(article);
    }

    res.json(article);
  } catch (error) {
    next(error);
  }
};

// Supprimer définitivement
exports.deleteNews = async (req, res, next) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article non trouvé' });
    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

/**
 * Fonction utilitaire pour envoyer la newsletter
 * @param {Object} article 
 */
async function sendNewsletter(article) {
  const subscribers = await Subscriber.find({}, 'email');
  const emailList = subscribers.map(s => s.email);
  
  if (emailList.length > 0) {
    // On ne 'await' pas forcément ici pour ne pas bloquer l'utilisateur,
    // mais on lance le processus.
    mailer.sendNewsletterNotification(emailList, {
      title: article.title,
      summary: article.summary,
      id: article._id
    });
  }
}
