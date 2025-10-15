Ensure Domain is verified in the console. The domain for this build will expire in 10/14/26.

Ensure configuration of Messaging Service is created with a verified number added to the sender pool. 

Status webhook of the Messaging Service should be updated to point to <ngrok.url/statusEvents> for the SMS delivery events.

Add domain to link shortening and ensure A fields are added to DNS.
The link shortening configuration should have a link pointing to <ngrok.url/clicked>

To run this server - npm run dev
Then in a seperate instance - ngrok http 3000 --domain=<ngrok.url>

Navigate to http://localhost:3000 or https://<ngrok.url> 

- Add a number and send SMS
- Wait for status updates and delivered SMS status
- End user should receive a text with a link
- Click the link and a status update should appear on screen

