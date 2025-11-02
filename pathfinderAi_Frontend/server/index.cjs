const express = import('express');
const cors = import('cors');
const axios = import('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB Atlas Data API configuration
const ATLAS_DATA_API_URL = "https://data.mongodb-api.com/app/data-alfjq/endpoint/data/v1";
const ATLAS_API_KEY = process.env.MONGODB_ATLAS_API_KEY || "";
const DATABASE_NAME = "pathfinder_ai";
const DATA_SOURCE = "Cluster0";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to make Atlas Data API calls
async function callAtlasAPI(action, collection, payload = {}) {
  try {
    const response = await axios.post(
      `${ATLAS_DATA_API_URL}/action/${action}`,
      {
        dataSource: DATA_SOURCE,
        database: DATABASE_NAME,
        collection,
        ...payload,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "apiKey": ATLAS_API_KEY,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Atlas API ${action} error:`, error.message);
    throw error;
  }
}

// ==================== API Routes ====================

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Initialize a machine coding session
 */
app.post('/api/machine-coding/init-session', async (req, res) => {
  try {
    const { sessionId, userId, role, company, level, totalQuestions } = req.body;

    const document = {
      sessionId,
      userId,
      startedAt: new Date().toISOString(),
      role,
      company,
      level,
      totalQuestions,
      createdAt: new Date().toISOString(),
      questionsGenerated: 0,
      questionsAttempted: 0,
      submissionCount: 0,
      totalScore: 0,
    };

    const result = await callAtlasAPI("insertOne", "machine_coding_sessions", {
      document,
    });

    res.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Unknown error" 
    });
  }
});

/**
 * Save generated questions
 */
app.post('/api/machine-coding/save-questions', async (req, res) => {
  try {
    const { sessionId, userId, questions, role, company, level, generatedAt } = req.body;

    const documents = questions.map((q) => ({
      questionId: q.id,
      title: q.title,
      difficulty: q.difficulty,
      tags: q.tags,
      description: q.description,
      examples: q.examples,
      constraints: q.constraints,
      testCases: q.testCases,
      hiddenTestCases: q.hiddenTestCases,
      templates: q.templates,
      timeComplexity: q.timeComplexity,
      spaceComplexity: q.spaceComplexity,
      hints: q.hints,
      approaches: q.approaches,
      sessionId,
      userId,
      role,
      company,
      level,
      generatedAt: new Date(generatedAt).toISOString(),
      createdAt: new Date().toISOString(),
    }));

    await callAtlasAPI("insertMany", "machine_coding_questions", {
      documents,
    });

    res.json({ success: true, count: documents.length });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Unknown error" 
    });
  }
});

/**
 * Save code submission
 */
app.post('/api/machine-coding/save-submission', async (req, res) => {
  try {
    const {
      sessionId,
      userId,
      questionId,
      questionTitle,
      language,
      code,
      analysisResult,
      submittedAt,
      testsPassed,
      testsTotal,
    } = req.body;

    const document = {
      sessionId,
      userId,
      questionId,
      questionTitle,
      language,
      code,
      analysisResult: {
        success: analysisResult.success,
        output: analysisResult.output,
        error: analysisResult.error,
        analysis: analysisResult.analysis,
        testCaseResults: analysisResult.testCaseResults,
      },
      testsPassed: testsPassed || 0,
      testsTotal: testsTotal || 0,
      score: analysisResult?.analysis?.overallScore || 0,
      submittedAt: new Date(submittedAt).toISOString(),
      createdAt: new Date().toISOString(),
    };

    const result = await callAtlasAPI("insertOne", "machine_coding_submissions", {
      document,
    });

    res.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Unknown error" 
    });
  }
});

/**
 * Update session with submission count
 */
app.post('/api/machine-coding/update-session', async (req, res) => {
  try {
    const { sessionId, submissionCount, totalScore } = req.body;

    await callAtlasAPI("updateOne", "machine_coding_sessions", {
      filter: { sessionId },
      update: {
        $set: {
          submissionCount,
          totalScore,
          updatedAt: new Date().toISOString(),
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Unknown error" 
    });
  }
});

/**
 * End machine coding session
 */
app.post('/api/machine-coding/end-session', async (req, res) => {
  try {
    const { sessionId, totalScore } = req.body;

    await callAtlasAPI("updateOne", "machine_coding_sessions", {
      filter: { sessionId },
      update: {
        $set: {
          endedAt: new Date().toISOString(),
          totalScore: totalScore || 0,
          status: "completed",
          updatedAt: new Date().toISOString(),
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Unknown error" 
    });
  }
});

/**
 * Get user session history
 */
app.get('/api/machine-coding/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await callAtlasAPI("find", "machine_coding_sessions", {
      filter: { userId },
      sort: { startedAt: -1 },
    });

    res.json({ success: true, sessions: result.documents || [] });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Unknown error" 
    });
  }
});

/**
 * Get session submissions
 */
app.get('/api/machine-coding/submissions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await callAtlasAPI("find", "machine_coding_submissions", {
      filter: { sessionId },
      sort: { submittedAt: 1 },
    });

    res.json({ success: true, submissions: result.documents || [] });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Unknown error" 
    });
  }
});

/**
 * Get user analytics
 */
app.get('/api/machine-coding/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await callAtlasAPI("find", "machine_coding_submissions", {
      filter: { userId },
    });

    const submissions = result.documents || [];

    if (submissions.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalSubmissions: 0,
          averageScore: 0,
          questionsAttempted: 0,
          questionsCorrect: 0,
        },
      });
    }

    const totalSubmissions = submissions.length;
    const averageScore =
      submissions.reduce((sum, sub) => sum + (sub.score || 0), 0) /
      totalSubmissions;
    const questionsAttempted = new Set(
      submissions.map((sub) => sub.questionId)
    ).size;
    const questionsCorrect = submissions.filter(
      (sub) => sub.score >= 80
    ).length;

    res.json({
      success: true,
      analytics: {
        totalSubmissions,
        averageScore: Math.round(averageScore),
        questionsAttempted,
        questionsCorrect,
        submissions: submissions.map((sub) => ({
          questionId: sub.questionId,
          questionTitle: sub.questionTitle,
          score: sub.score,
          language: sub.language,
          submittedAt: sub.submittedAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Unknown error" 
    });
  }
});

// ==================== Error Handling ====================

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// ==================== Start Server ====================

app.listen(PORT, () => {
  console.log('');
  console.log('============================================');
  console.log('✓ Machine Coding Backend Server');
  console.log('============================================');
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ MongoDB API Key: ${ATLAS_API_KEY ? '✓ Configured' : '✗ NOT SET'}`);
  console.log('============================================');
  console.log('');
  if (!ATLAS_API_KEY) {
    console.warn('⚠️  WARNING: MONGODB_ATLAS_API_KEY is not set in .env');
    console.warn('   MongoDB operations will fail!');
    console.warn('');
  }
});

module.exports = app;
