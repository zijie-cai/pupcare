import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';
import nodemailer from 'nodemailer';

admin.initializeApp();

interface WaitlistDocument {
  email?: string;
  createdAt?: FirebaseFirestore.Timestamp;
}

interface MailSettings {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  from?: string;
  replyTo?: string;
}

const rawMailConfig = functions.config().mail ?? {};

const mailSettings: MailSettings = {
  service: rawMailConfig.service,
  host: rawMailConfig.host,
  port: rawMailConfig.port ? Number(rawMailConfig.port) : undefined,
  secure:
    typeof rawMailConfig.secure === 'string'
      ? rawMailConfig.secure === 'true'
      : rawMailConfig.secure,
  user: rawMailConfig.user,
  pass: rawMailConfig.pass,
  from: rawMailConfig.from,
  replyTo: rawMailConfig.reply_to,
};

const auth =
  mailSettings.user && mailSettings.pass
    ? { user: mailSettings.user, pass: mailSettings.pass }
    : undefined;

const transportOptions = mailSettings.host
  ? {
      host: mailSettings.host,
      port: mailSettings.port ?? 465,
      secure: mailSettings.secure ?? true,
      auth,
    }
  : {
      service: mailSettings.service ?? 'gmail',
      auth,
    };

const transporter = nodemailer.createTransport(transportOptions);

const buildMailBody = (email: string) => {
  const downloadUrl = 'https://testflight.apple.com/join/NXA75kXz';

  const textBody = [
    'Hi there,',
    '',
    'Thanks for joining the PupCare waitlist.',
    `You can try the beta now on TestFlight: ${downloadUrl}`,
    '',
    'We would love any of your feedback.',
    '',
    '- The PupCare Team',
  ].join('\n');

  const htmlBody = `
    <p>Hi there,</p>
    <p>Thanks for joining the PupCare waitlist.</p>
    <p>
      You can try the beta now on TestFlight:
      <a href="${downloadUrl}" target="_blank" rel="noopener noreferrer">${downloadUrl}</a>
    </p>
    <p>We would love any of your feedback.</p>
    <p>- The PupCare Team</p>
  `;

  return {
    from: mailSettings.from ?? mailSettings.user ?? 'MyPupCare <mypupcare.app@gmail.com>',
    to: email,
    replyTo: mailSettings.replyTo ?? mailSettings.from ?? mailSettings.user,
    subject: "You're on the PupCare waitlist! 🎉",
    text: textBody,
    html: htmlBody,
  };
  
};

export const sendWaitlistEmail = functions.firestore
  .document('waitlist/{docId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data() as WaitlistDocument | undefined;
    const email = data?.email;

    if (!email) {
      functions.logger.warn('Waitlist document missing email field', { id: context.params.docId });
      return;
    }

    if (!mailSettings.user || !mailSettings.pass) {
      functions.logger.error('Mail credentials are missing. Configure functions:config:set mail.user="..." mail.pass="..."');
      return;
    }

    try {
      await transporter.sendMail(buildMailBody(email));
      functions.logger.info('Sent waitlist confirmation email', { email });
    } catch (error) {
      functions.logger.error('Failed to send waitlist confirmation email', {
        error,
        email,
      });
    }
  });
