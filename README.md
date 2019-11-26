# lambda-check-in-test project
* Desc: A project to achieve a auto-check-in system with the use of AWS Lambda, Github Webhook and Google Spreadsheet.

* Workflow: 
  1. Automatically create an issue everyday for github users to comment
  2. When a github user commented on the issue, it syncs to slack and triggers the webhook that will trigger the API Gateway of the Lambda  function.
  3. API Gateway will trigger the lambda function and record on google spreadsheet automatically by service account.

* Issue comment format/template:
  ```
  check-in
  your user name (e.g. kittycheng)
  ```
