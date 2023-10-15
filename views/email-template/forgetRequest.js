function forgetPassReqEmailTemplate(token, email) {
  return (
    '<div style="font-family: Rubik;background-color: #EAEEF2;text-align: center;padding: 5rem;">' +
    '<img style="margin-bottom: 2rem;" width="103" height="128" src="https://cdn.fanavaran.ca/email/Logo.png">' +
    '<div style="width: 700px;padding: 4rem 2rem 2rem;background-color: #ffffff;border-radius: 35px;margin: 0 auto 2rem;">' +
    '<h1 style="margin-bottom: 2rem;font-size: 40;font-weight: 400;">Reset Your Password</h1>' +
    '<p style="margin-bottom: 10px;font-size: 18px;font-weight: 400;">' +
    "We received a request to reset your password. <br/>If you didn't make this request, please ignore this email." +
    "</p>" +
    '<p style="margin-bottom: 4rem;font-size: 18px;font-weight: 400;">' +
    "To reset your password, click the link below:" +
    "</p>" +
    "<p>" +
    `<a href="${process.env.APP_URL}/reset-password/${token}" style="display:block;background-color: #202B8B;padding: 1rem 1.5rem;font-size: 16px;border-radius: 12px;color: #ffffff;margin: 0 auto 2rem;width: 175px;text-decoration:none;text-align:center">` +
    "Reset Password" +
    "</a>" +
    "</p>" +
    `<p><a href="mailto:info@fanavaran.ca" style="color:#000000;font-weight:600;font-size:28px;text-decoration:none">${email}</a></p>` +
    '<p><small style="color: #A6B1BA;font-size: 15px;">Your fanavaran account</small></p>' +
    '<img width="379" height="299" src="https://cdn.fanavaran.ca/email/Email.png" />' +
    "</div>" +
    "<div>" +
    '<p><small style="font-weight: 400;font-size: 14px;">Copyright &copy; 2022 fanavaran O&#220; (LLC)</small></p>' +
    '<p style="color: #5a5a5a;font-weight: 500;font-size: 14px;">fanavaran.ca All rights reserved.</p>' +
    '<p style="font-size: 14px;margin-bottom: 2rem;">' +
    '<a href="mailto:info@fanavaran.ca" style="color: #585B60;border-right: 1px solid #585B60;padding: 0 .5rem;">info@fanavaran.ca</a> ' +
    '<a href="#" style="color: #585B60;border-right: 1px solid #585B60;padding: 0 .5rem;">Manage Email Notifictions</a> ' +
    '<a href="#" style="color: #585B60;padding: 0 .5rem;">Unsubscribe</a> ' +
    "</p>" +
    "<p>" +
    '<a href="https://facebook.com/fanavaran">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/facebook.png" />' +
    "</a>" +
    '<a href="https://twitter.com/fanavaran">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/twitter.png" />' +
    "</a>" +
    '<a href="https://www.instagram.com/fanavaran/">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/instagram.png" />' +
    "</a>" +
    '<a href="https://www.linkedin.com/company/fanavaran">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/linkedin.png" />' +
    "</a>" +
    '<a href="https://www.youtube.com/channel/UCKi9MzvDEmrpFC304Dpeyqg">' +
    '<img width="34" height="34" src="https://cdn.fanavaran.ca/email/youtube.png" />' +
    "</a>" +
    "</p>" +
    "</div>" +
    "</div>"
  );
}

module.exports = {
  forgetPassReqEmailTemplate,
};
