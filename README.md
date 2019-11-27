# **Lambda-check-in-test project**
**Description:** A project to achieve a serverless auto-check-in system with the use of AWS Lambda, Github Webhook and Google Spreadsheet.

## **Workflow** 
  1. Automatically create an issue on every Monday to Friday at 12:00am (GMT+8) for github users to comment.
  2. When a github user commented on the issue, it syncs to slack and triggers the webhook that will trigger the API Gateway.
  3. API Gateway will trigger the lambda function and record in google spreadsheet automatically by service account.

## **Issue comment format/template**
  ```
  check-in
  your user name (e.g. kittycheng)
  ```
## **Resources** 
   https://github.com/theoephraim/node-google-spreadsheet
