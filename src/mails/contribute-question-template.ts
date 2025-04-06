export const contribute_question_templete = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Question Submission</title>
  <style>
    /* Base styles */
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
      color: #333;
      line-height: 1.6;
    }
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: linear-gradient(135deg, #1e1b2e 0%, #2d2b42 100%);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      border: 1px solid #4c3a8a;
    }
    
    /* Header */
    .header {
      background: linear-gradient(90deg, #6b21a8 0%, #7e22ce 50%, #581c87 100%);
      padding: 30px 40px;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
      border-bottom: 3px solid #ffd700;
    }
    
    .header h2 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 1px;
      position: relative;
      z-index: 2;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    /* Shimmering effect */
    .header::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent,
        rgba(255, 215, 0, 0.2),
        transparent
      );
      transform: rotate(45deg);
      animation: shimmer 3s infinite linear;
      z-index: 1;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%) rotate(45deg); }
      100% { transform: translateX(100%) rotate(45deg); }
    }
    
    /* Content */
    .content {
      padding: 30px 40px;
      color: #e5e7eb;
    }
    
    .content p {
      margin: 12px 0;
      font-size: 16px;
    }
    
    .content strong {
      color: #d8b4fe;
      font-weight: bold;
    }
    
    /* Options list */
    .options {
      background: rgba(80, 50, 120, 0.3);
      border-radius: 8px;
      padding: 15px 25px;
      margin: 20px 0;
      border-left: 4px solid #a855f7;
    }
    
    .options ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    
    .options li {
      padding: 8px 15px;
      margin: 8px 0;
      background: rgba(109, 40, 217, 0.3);
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    
    .options li:hover {
      background: rgba(109, 40, 217, 0.5);
      transform: translateX(5px);
    }
    
    .options li:last-child {
      background: rgba(255, 215, 0, 0.2);
      border: 1px solid rgba(255, 215, 0, 0.5);
    }
    
    /* Category badge */
    .category-badge {
      display: inline-block;
      background: linear-gradient(45deg, #6d28d9, #4c1d95);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
      color: white;
      margin-top: 5px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
      border: 1px solid #a78bfa;
    }
    
    /* Difficulty indicators */
    .difficulty {
      margin-top: 20px;
      padding: 8px 0;
    }
    
    .difficulty-indicator {
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin-right: 5px;
    }
    
    .easy { background-color: #4ade80; }
    .medium { background-color: #facc15; }
    .hard { background-color: #ef4444; }
    
    /* Button */
    .button-container {
      text-align: center;
      margin: 30px 0 20px;
    }
    
    .review-button {
      display: inline-block;
      background: linear-gradient(90deg, #6d28d9 0%, #8b5cf6 100%);
      color: white;
      padding: 14px 28px;
      font-size: 16px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      border: 2px solid #a78bfa;
    }
    
    .review-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 7px 20px rgba(0, 0, 0, 0.4);
      background: linear-gradient(90deg, #7c3aed 0%, #9333ea 100%);
    }
    
    .review-button::after {
      content: "";
      position: absolute;
      width: 50%;
      height: 100%;
      top: 0;
      left: -50%;
      background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
      animation: buttonFlow 2s infinite linear;
    }
    
    @keyframes buttonFlow {
      0% { left: -50%; }
      100% { left: 150%; }
    }
    
    /* Footer */
    .footer {
      background: #2d2640;
      text-align: center;
      padding: 20px;
      color: #9ca3af;
      font-size: 14px;
      border-top: 1px solid #4c3a8a;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>New Question Submission: {{username}}</h2>
    </div>
    
    <div class="content">
      <p>
        <strong>Category:</strong> 
        <span class="category-badge">{{category}}</span>
      </p>
      
      <p><strong>Question ID:</strong> #{{id}}</p>
      
      <p><strong>Question:</strong> {{question}}</p>
      
      <div class="options">
        <p><strong>Options:</strong></p>
        <ul>
          <li>{{option1}}</li>
          <li>{{option2}}</li>
          <li>{{option3}}</li>
          <li>{{correct_option}} ✓</li>
        </ul>
      </div>
      
      <div class="difficulty">
        <p>
          <strong>Difficulty:</strong> {{difficulty}}
          <span class="difficulty-indicator {{difficultyInLowerCase}}"></span>
        </p>
      </div>
      
      <div class="button-container">
        <a href="{{domain}}/admin/contribution-question/{{id}}" class="review-button">
          Review Question
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2025 Anime Quiz. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;