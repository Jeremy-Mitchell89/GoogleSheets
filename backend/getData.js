const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { format } = require("date-fns");
const cron = require("node-cron");
let db = require("diskdb");
db = db.connect("./.db", ["inventory"]);

var todayDate = format(new Date(), "MM/DD/YYYY");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.

// cron.schedule("*/1 * * * *", () => {
//   fs.readFile("credentials.json", (err, content) => {
//     if (err) return console.log("Error loading client secret file:", err);
//     // Authorize a client with credentials, then call the Google Sheets API.
//     db.inventory.remove({ display: true }, true);
//     authorize(JSON.parse(content), getInventory);
//   });
// });

async function run() {
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), getInventory);
  });
}
function runScrap(row) {
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), writeScrap, row);
  });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 * @param {number} row The row upon which the data exists, needed for runScrap/writeScrap functions.
 */
function authorize(credentials, callback, row) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, row);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getNewToken = function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
};

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1cNb-lVgGn-doFdx-0SZRH5qLb73g_KTHsu1GqvPYrVI/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
const getInventory = function getInventory(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1cNb-lVgGn-doFdx-0SZRH5qLb73g_KTHsu1GqvPYrVI",
      range: "Scrap!A3:F"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        // add row number to value array so we can write scrap date back to sheet
        const dataObj = rows.map((camera, i) => ({
          partNumber: camera[0],
          modelNumber: camera[1],
          serialNumber: camera[2],
          controlNumber: camera[3],
          row: i + 3,
          scrapDate: camera[4],
          display: true
        }));
        const filteredList = dataObj.filter(camera => {
          return camera.scrapDate === undefined;
        });
        filteredList.forEach(cam => {
          const existingCamera = db.inventory.findOne({
            serialNumber: cam.serialNumber
          });
          if (existingCamera) {
            console.log("Camera Already in DB");
          } else {
            db.inventory.save(cam);
          }
        });
        // filteredList.length ? db.inventory.save(filteredList) : null;
      } else {
        console.log("No data found.");
      }
    }
  );
};

const writeScrap = function writeScrap(auth, row) {
  const sheets = google.sheets({ version: "v4", auth });
  var spreadsheetId = "1cNb-lVgGn-doFdx-0SZRH5qLb73g_KTHsu1GqvPYrVI";
  //update scrap spreadsheet 'date requested' column with current date
  sheets.spreadsheets.values.update(
    {
      spreadsheetId,
      range: `Scrap!E${row}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [[todayDate]] }
    },

    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully written to sheet");
      }
    }
  );
  //update scrap spreadsheet 'date scrapped' column with current date
  sheets.spreadsheets.values.update(
    {
      spreadsheetId,
      range: `Scrap!F${row}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [[todayDate]] }
    },

    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully written to sheet");
      }
    }
  );
  //update sheet with who pressed the button. Default Jeremy
  sheets.spreadsheets.values.update(
    {
      spreadsheetId,
      range: `Scrap!G${row}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [["Jeremy"]] }
    },

    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully written to sheet");
      }
    }
  );
};

module.exports = {
  getInventory,
  getNewToken,
  authorize,
  run,
  runScrap,
  writeScrap
};
