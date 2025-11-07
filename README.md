
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
  
