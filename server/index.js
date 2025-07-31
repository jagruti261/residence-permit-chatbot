const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { NlpManager } = require('node-nlp');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const manager = new NlpManager({ languages: ['en'] });

// Training data & answers
(async () => {
  manager.addDocument('en', 'What is the status of my application?', 'status');
  manager.addDocument('en', 'Tell me my application status', 'status');
  manager.addDocument('en', 'Where is my application?', 'status');
  manager.addDocument('en', 'Which documents do I need?', 'missing_docs');
  manager.addDocument('en', 'What documents are missing?', 'missing_docs');
  manager.addDocument('en', 'What are the next steps?', 'next_steps');
  manager.addDocument('en', 'How do I proceed?', 'next_steps');
  manager.addDocument('en', 'Hello', 'greetings');
  manager.addDocument('en', 'Hi', 'greetings');
  manager.addDocument('en', 'Hey', 'greetings');

  manager.addAnswer('en', 'status', 'Your application is currently being reviewed.');
  manager.addAnswer('en', 'missing_docs', 'You still need to upload: Proof of Residence and Health Insurance.');
  manager.addAnswer('en', 'next_steps', 'Please wait for notification after the review is complete.');
  manager.addAnswer('en', 'greetings', 'Hello! How can I assist you today?');

  await manager.train();
  manager.save();
})();

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ answer: 'Please ask a question.' });

  const response = await manager.process('en', question);

  if (!response.answer || response.score < 0.5) {
    return res.json({ answer: "I'm sorry, I don't understand. Please contact support." });
  }
  res.json({ answer: response.answer });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
