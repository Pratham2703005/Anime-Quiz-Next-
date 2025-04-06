export const feedback_template = `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 12px; overflow: hidden; border: 1px solid #ddd;">
    <div style="background: linear-gradient(to right, #7e5bef, #5f2eea); padding: 20px; color: white; text-align: center;">
      <h2 style="margin: 0;">📩 New Feedback Received</h2>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 16px; color: #333;">Hello Pratham,</p>
      <p style="font-size: 15px; color: #444; margin-top: 12px;">You've received new feedback from <strong style="color: #7e5bef;">{{username}}</strong>.</p>
      
      <div style="background: #fff; padding: 16px; margin: 20px 0; border-left: 4px solid #7e5bef; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
        <p style="margin: 0; color: #222; white-space: pre-line;">{{message}}</p>
      </div>
    </div>
    <div style="background: #fafafa; text-align: center; font-size: 13px; color: #888; padding: 12px;">
      This message was sent via <strong>Anime Quiz Feedback System</strong>.
    </div>
  </div>
`;
