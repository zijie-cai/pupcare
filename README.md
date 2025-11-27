
  # pupcare

  This is a code bundle for pupcare. The original project is available at https://www.figma.com/design/H2VVHz3Fscz0cr51flu68Z/pupcare.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Firebase waitlist setup

  Create a `pupcare` project in Firebase, enable Firestore, and add a web app. Copy the config values into a `.env.local` file in the project root:

  ```
  VITE_FIREBASE_API_KEY=your_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
  ```

  Restart the dev server after adding the file so Vite picks up the environment variables. The waitlist form writes to the `waitlist` collection in Firestore.

  ## Sending waitlist emails

  The repository includes a Firebase Cloud Function (`functions/src/index.ts`) that watches the `waitlist` collection and sends a confirmation email through Nodemailer when a new document is created.

  1. Install the function dependencies once (Functions target the Node.js 22 runtime, so use Node 22 locally for parity):
     ```
     cd functions
     npm install
     ```
  2. Configure the email credentials with Firebase (example for Gmail app password):
     ```
     firebase functions:config:set \
       mail.user="your@gmail.com" \
       mail.pass="your_app_password" \
       mail.from="PupCare <your@gmail.com>" \
       mail.service="gmail"
     ```
     You can also provide `mail.host`, `mail.port`, `mail.secure` and `mail.reply_to` if you use a custom SMTP service.
  3. Deploy the function:
     ```
     npm run --prefix functions deploy
     ```
     (The root `firebase.json` already runs `npm --prefix functions run build` automatically before deployment.)

  After deployment, every time someone submits the waitlist form, Firestore stores their email and the Cloud Function sends them the confirmation message. Use `firebase emulators:start --only functions` from the `functions` directory to test locally if needed.
  
