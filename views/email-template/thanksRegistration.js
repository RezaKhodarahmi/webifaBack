function thanksRegistrationEmailTemplate(email, NewDate) {
  return (
    '<div style="font-family: Helvetica;background-color: #EAEEF2;text-align: center;padding: 5rem;">' +
    '<img style="margin-bottom: 2rem;" width="103" height="128" src="https://cdn.fanavaran.ca/email/Logo.png">' +
    '<div style="width: 700px;padding: 4rem 2rem 2rem;background-color: #ffffff;border-radius: 35px;margin: 0 auto 2rem;">' +
    '<h1 style="margin-bottom: 2rem;font-size: 40;font-weight: 400;">Verify it&apos;s you</h1>' +
    '<p style="margin-bottom: 4rem;font-size: 18px;font-weight: 400;">' +
    "You&apos;re almost there. Just click below to <br />" +
    "complete your registration process." +
    "</p>" +
    "<p>" +
    `<a href="${process.env.APP_URL}/register/verification/${email}" style="display:block;background-color: #202B8B;padding: 1rem 1.5rem;font-size: 16px;border-radius: 12px;color: #ffffff;margin: 0 auto 2rem;width: 175px;text-decoration:none;text-align:center">` +
    "Verify Email" +
    '<span style="display: flex;justify-content: center;align-items: center;width: 28px;height: 28px;"><img src="https://cdn.fanavaran.ca/email/right-arrow.png" /></span>' +
    "</a>" +
    "</p>" +
    `<p><a href="mailto:info@fanavaran.ca" style="color:#000000;font-weight:600;font-size:28px;text-decoration:none">${email}</a></p>` +
    '<p><small style="color: #A6B1BA;font-size: 15px;">Your fanavaran account</small></p>' +
    '<img width="379" height="299" src="https://cdn.fanavaran.ca/email/Email.png" />' +
    "</div>" +
    "<div>" +
    `<p><small style="font-weight: 400;font-size: 14px;">Copyright &copy; 2022 - ${NewDate} fanavaran O&#220; (LLC)</small></p>` +
    '<p style="color: #5a5a5a;font-weight: 500;font-size: 14px;">fanavaran.ca All rights reserved.</p>' +
    '<p style="font-size: 14px;margin-bottom: 2rem;">' +
    '<a href="mailto:info@fanavaran.ca" style="color: #585B60;border-right: 1px solid #585B60;padding: 0 .5rem;">info@fanavaran.ca</a> ' +
    '<a href="#" style="color: #585B60;border-right: 1px solid #585B60;padding: 0 .5rem;">Manage Email Notifictions</a> ' +
    '<a href="#" style="color: #585B60;padding: 0 .5rem;">Unsubscribe</a> ' +
    "</p>" +
    "<p>" +
    '<a href="https://facebook.ca/fanavaran">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/facebook.png" />' +
    "</a>" +
    '<a href="https://twitter.ca/fanavaran">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/twitter.png" />' +
    "</a>" +
    '<a href="https://www.instagram.ca/fanavaran/">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/instagram.png" />' +
    "</a>" +
    '<a href="https://www.linkedin.ca/company/fanavaran">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/linkedin.png" />' +
    "</a>" +
    '<a href="https://www.youtube.ca/channel/UCKi9MzvDEmrpFC304Dpeyqg">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/youtube.png" />' +
    "</a>" +
    "</p>" +
    "</div>" +
    "</div>"
  );
}

module.exports = {
  thanksRegistrationEmailTemplate,
};
