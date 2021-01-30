# Group Project: Pref'd
This repo is a clone of the repo used for the development of this application, it was completed by me and three other students at UNSW and was fully functional upon completion.

## Server

AWS Server is up, see `/api_server/README.md`

The Mongodb server is running online, you do not need to run api_server locally.

## Running the app

First you need to install the frontend requirements:

```bash
cd frontend
npm i # install modules
expo start
```

Open up the Expo app on your mobile device and scan the QR code supplied.

## Encountering errors

If you encounter an error, try the following:

```bash
cd frontend
rm -rf node-modules/ package-lock.json
npm start --reset-cache
```
