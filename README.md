![bibgameplayers](https://user-images.githubusercontent.com/25724314/174857587-8ff1e362-0e15-42fe-a80c-c30895f12020.png)

# Event Organisation

A web app designed to manage group events, currently adapted for football matches and associated socials.

## Demo website

A demo version of the website is available here: [Demo site](https://demo.bibgameplayers.com)

**NB** - the website is hosted on a free tier platform that puts the server to sleep after a period of inactivity, so you may encounter a lag of a few seconds on the first page load while the server wakes.

#### Login details

##### Admin account

- Username: demo-admin@bibgameplayers.com
- Password: Demoadmin1!

##### Standard user account

- Username: demo-user@bibgameplayers.com
- Password: Demouser1!

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

A Node.js / Express backend provides a REST api that allows creation, editing and deletion of events, users and event attendance records stored in a remote MongoDB database. It handles authentication of users, storing salted hashes only in the database, and provides authentication tokens (JWT). The React frontend communicates with this backend via the api, caching api calls with RTK Query.

### Backend

- Node.js/Express
- MongoDB database (Mongoose ODM)
- Express-Validator (request body/parameter validation/sanitisation)

#### Testing

- Jest
- SuperTest (http request testing)
- mongodb-memory-server (in memory MongoDB test database)
- Faker (fake data generation)

### Frontend

- React
- Redux (Redux-Toolkit)
- RTK Query (api caching)
- Formik (forms)
- Yup (field validation)
- styled-components (for css in js)

#### Testing

- Jest
- Mock Service Worker (api mocking)
- mswjs/data (data modelling/mocking)
- Faker (fake data generation)
