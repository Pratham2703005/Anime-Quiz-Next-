export const report_question_template = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
        }
        .header {
            background-color: #4a86e8;
            color: white;
            padding: 15px;
            border-radius: 5px 5px 0 0;
            margin: -20px -20px 20px;
            text-align: center;
        }
        .section {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        .content {
            margin-top: 5px;
        }
        .reason {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            margin-top: 5px;
        }
        .message {
            background-color: #fff;
            padding: 10px;
            border-left: 3px solid #4a86e8;
            margin-top: 5px;
        }
        .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
            text-align: center;
        }
        .button {
            display: block;
            width: 200px;
            background-color: #4a86e8;
            color: white;
            text-align: center;
            padding: 12px 20px;
            margin: 20px auto;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
        }
        .button:hover {
            background-color: #3a76d8;
        }
        .action-section {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Question Report</h2>
        </div>

        <div class="section">
            <div class="label">Reported By:</div>
            <div class="content">{{username}}</div>
        </div>

        <div class="section">
            <div class="label">Question ID:</div>
            <div class="content">{{questionId}}</div>
        </div>

        <div class="section">
            <div class="label">Report Reasons:</div>
            <div class="content">
                <div class="reason">
                    {{selected}}
                </div>
            </div>
        </div>

        <!-- MESSAGE_SECTION_PLACEHOLDER -->

        <div class="action-section">
            <a href="{{reviewUrl}}" class="button">Review Question</a>
        </div>

        <div class="footer">
            This is an automated message from QuizBot. Please review this report and take appropriate action.
        </div>
    </div>
</body>
</html>`