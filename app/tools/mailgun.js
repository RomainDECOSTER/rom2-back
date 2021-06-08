const ejs = require('ejs');
const Mailgun = require('mailgun.js');
const formData = require('form-data');

const mailgunConfig = require('config/mailgun');

const MG = new Mailgun(formData);

const mailgun = MG.client({
  key: mailgunConfig.MAILGUN_API_KEY,
  username: mailgunConfig.MAILGUN_USERNAME,
  url: 'https://api.eu.mailgun.net',
});

// returns a Promise containing the email html and subject
function getMailContent(data) {
  const content = {};
  return new Promise((resolve, reject) => {
    if (data.template && data.template.subject && (data.template.file || data.template.html)) {
      content.subject = data.template.subject;
      if (data.template.html) {
        content.html = data.template.html;
      } else {
        const lang = data.lang !== undefined ? data.lang : 'en';
        const filePath = `config/templates/${lang}/${data.template.file}`;
        ejs.renderFile(filePath, data.data, {}, (err, html) => {
          if (err) {
            reject(new Error('Error opening template file'));
          }
          content.html = html;
          resolve(content);
        });
      }
    } else if (data.subject && data.html) {
      content.html = data.html;
      content.subject = data.subject;
    } else {
      reject(new Error('Html and subject or template needed for mail'));
    }
    resolve(content);
  });
}

// sends an email according to the object data
function sendEmail(data) {
  if (!data || !data.to) {
    return Promise.reject(new Error('Receiver needed for mail'));
  }
  const finalData = {
    to: data.to,
    from: data.from ? data.from : mailgunConfig.MAILGUN_SENDER,
  };
  return new Promise((resolve, reject) => {
    getMailContent(data)
      .then(content => {
        finalData.subject = content.subject;
        finalData.html = content.html;
        mailgun.messages
          .create(mailgunConfig.MAILGUN_DOMAIN, finalData)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = {
  sendEmail,
};
