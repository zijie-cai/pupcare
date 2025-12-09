"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWaitlistEmail = void 0;
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions/v1"));
const nodemailer_1 = __importDefault(require("nodemailer"));
admin.initializeApp();
const rawMailConfig = functions.config().mail ?? {};
const mailSettings = {
    service: rawMailConfig.service,
    host: rawMailConfig.host,
    port: rawMailConfig.port ? Number(rawMailConfig.port) : undefined,
    secure: typeof rawMailConfig.secure === 'string'
        ? rawMailConfig.secure === 'true'
        : rawMailConfig.secure,
    user: rawMailConfig.user,
    pass: rawMailConfig.pass,
    from: rawMailConfig.from,
    replyTo: rawMailConfig.reply_to,
};
const auth = mailSettings.user && mailSettings.pass
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
const transporter = nodemailer_1.default.createTransport(transportOptions);
const buildMailBody = (email) => {
    const downloadUrl = 'https://testflight.apple.com/join/WB7EH4dm';
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
exports.sendWaitlistEmail = functions.firestore
    .document('waitlist/{docId}')
    .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
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
    }
    catch (error) {
        functions.logger.error('Failed to send waitlist confirmation email', {
            error,
            email,
        });
    }
});
//# sourceMappingURL=index.js.map