# Event Organisation

A web app designed to manage group events, currently adapted for football matches and associated socials.

![bibgameplayers](https://user-images.githubusercontent.com/25724314/174857587-8ff1e362-0e15-42fe-a80c-c30895f12020.png)

## User Features

- Account creation and authentication.
- View and edit your profile.
- View a calendar of all events, past and upcoming.
- View events and update your attendance, with the option to bring guests.
- View event timing, location and the current lineup of attendees.
- A quick link in the navbar to the next upcoming match.

## Admin Features

- Event creation, editing, cancellation and deletion.
- Edit the event attendance status of any user.

## Technology

A Node.js / Express backend provides a REST api that allows creation, editing and deletion of events, users and event attendance records stored in a remote MongoDB database. It handles authentication of users, stores salted hashes only in the database and provides authentication tokens (JWT). The React frontend communicates with this backend via the api, storing and updating the state with Redux.

### Backend
- Node.js/Express
- MongoDB database (Mongoose ODM)
- Express-Validator (request body/parameter validation)

### Frontend
- React
- Redux (Redux-Toolkit)
- Formik (forms)
- Yup (field validation)
- styled-components (for css in js)
