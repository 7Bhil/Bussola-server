const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Envoie un mail à une liste d'abonnés
 * @param {Array} emails - Liste des emails
 * @param {Object} content - { title, summary, id }
 */
exports.sendNewsletterNotification = async (emails, content) => {
  if (!emails || emails.length === 0) return;

  const siteUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const articleUrl = `${siteUrl}/actualites/${content.id}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: emails.join(','),
    subject: `🔔 Nouvelle Actualité : ${content.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1e3a8a;">ONG Busola - Nouvelle publication</h2>
        <p>Bonjour,</p>
        <p>Une nouvelle actualité vient d'être publiée sur notre site :</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; border-left: 5px solid #2864ae;">
          <h3 style="margin-top: 0;">${content.title}</h3>
          <p>${content.summary || ''}</p>
          <a href="${articleUrl}" style="display: inline-block; background: #2864ae; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 3px; font-weight: bold;">Lire l'article complet</a>
        </div>
        <p style="margin-top: 20px;">Merci de votre soutien,<br>L'équipe ONG Busola</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">Vous recevez ce mail car vous êtes inscrit à notre newsletter. Si vous souhaitez vous désabonner, contactez-nous.</p>
      </div>
    `
  };

  try {
  await transporter.sendMail(mailOptions);
  console.log(`Newsletter envoyée à ${emails.length} abonnés.`);
  } catch (error) {
  console.error('Erreur lors de l\'envoi de la newsletter:', error);
  }
  };

  /**
  * Envoie une notification à l'admin pour un nouveau message de contact
  * @param {Object} message - { name, email, subject, message }
  */
  exports.sendContactNotification = async (message) => {
  const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: process.env.EMAIL_USER, // L'admin reçoit le mail
  subject: `📩 Nouveau message de contact : ${message.subject}`,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #1e3a8a;">Nouveau message sur le site ONG Busola</h2>
      <p><strong>De :</strong> ${message.name} (${message.email})</p>
      <p><strong>Sujet :</strong> ${message.subject}</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; border-left: 5px solid #2864ae;">
        <p style="white-space: pre-wrap;">${message.message}</p>
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">Ceci est un message automatique envoyé depuis le formulaire de contact.</p>
    </div>
  `
  };

  try {
  await transporter.sendMail(mailOptions);
  console.log('Notification de contact envoyée à l\'admin.');
  } catch (error) {
  console.error('Erreur lors de l\'envoi de la notification de contact:', error);
  }
  };

