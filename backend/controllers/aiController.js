// controllers/aiController.js
// OpenRouter-powered complaint analysis

const OpenAI = require("openai");
const Complaint = require("../models/Complaint");

// OpenRouter Configuration

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// @desc    Analyze complaint using AI
// @route   POST /api/ai/analyze
// @access  Private

const analyzeComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: "complaintId is required.",
      });
    }

    // Find complaint
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    // Verify ownership or admin
    if (
      complaint.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    // Return cached analysis if already analyzed in last 24h
    if (
      complaint.aiAnalysis?.analyzedAt &&
      Date.now() -
        new Date(complaint.aiAnalysis.analyzedAt).getTime() <
        86400000
    ) {
      return res.status(200).json({
        success: true,
        message: "Returning cached AI analysis.",
        analysis: complaint.aiAnalysis,
        complaint,
      });
    }

    // AI Prompt
    const prompt = `
You are an AI assistant for a Smart Complaint Management System for Indian municipal services.

Analyze the complaint and return ONLY valid JSON.

Complaint Details:
Title: ${complaint.title}
Category: ${complaint.category}
Description: ${complaint.description}
Location: ${complaint.location}

Return JSON in this format:

{
  "priority": "High | Medium | Low",
  "department": "Department name",
  "summary": "Short complaint summary",
  "userResponse": "Professional citizen response"
}

Rules:
- Water leakage, pipe burst → Water Department, High priority
- Power outage, electricity issues → Electricity Department
- Garbage issues → Sanitation Department
- Road damage → PWD Department
- Noise complaints → Municipal Corporation

Urgent words:
urgent, dangerous, emergency, flooded, no water = High priority
`;

    // OpenRouter AI Request
    const response = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.3,
      max_tokens: 500,
    });

    const rawText = response.choices[0].message.content.trim();

    let aiResult;

    try {
      aiResult = JSON.parse(rawText);
    } catch (err) {
      // fallback if AI returns invalid JSON
      aiResult = generateFallbackAnalysis(complaint);
    }

    // Save AI analysis
    complaint.aiAnalysis = {
      priority: aiResult.priority || "Medium",
      department:
        aiResult.department || "Municipal Corporation",

      summary:
        aiResult.summary ||
        complaint.description.substring(0, 100),

      userResponse:
        aiResult.userResponse ||
        "Your complaint has been received and forwarded to the concerned department.",

      analyzedAt: new Date(),
    };

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "AI analysis completed successfully.",
      analysis: complaint.aiAnalysis,
      complaint,
    });

  } catch (error) {
    console.error("AI ANALYSIS ERROR:", error);

    // OpenRouter/OpenAI quota error
    if (
      error.code === "insufficient_quota" ||
      error.status === 429
    ) {
      return res.status(503).json({
        success: false,
        message:
          "AI quota exceeded. Please check API billing.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Fallback analysis if AI fails
const generateFallbackAnalysis = (complaint) => {
  const categoryMap = {
    Water: {
      department: "Water Department",
      priority: "High",
    },

    Electricity: {
      department: "Electricity Department",
      priority: "High",
    },

    Garbage: {
      department: "Sanitation Department",
      priority: "Medium",
    },

    Roads: {
      department: "PWD Department",
      priority: "Medium",
    },

    Sanitation: {
      department: "Sanitation Department",
      priority: "Medium",
    },

    Noise: {
      department: "Municipal Corporation",
      priority: "Low",
    },

    Other: {
      department: "Municipal Corporation",
      priority: "Medium",
    },
  };

  const mapped =
    categoryMap[complaint.category] ||
    categoryMap["Other"];

  const descLower = complaint.description.toLowerCase();

  const isUrgent = [
    "urgent",
    "dangerous",
    "emergency",
    "flooded",
    "no water",
  ].some((word) => descLower.includes(word));

  return {
    priority: isUrgent ? "High" : mapped.priority,

    department: mapped.department,

    summary: `Complaint regarding ${complaint.category} issue in ${complaint.location}.`,

    userResponse: `Dear ${complaint.name}, your complaint "${complaint.title}" has been received and forwarded to the ${mapped.department}.`,
  };
};

// @desc    Quick AI Analyze
// @route   POST /api/ai/quick-analyze
// @access  Private

const quickAnalyze = async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body;

    if (!description || !category) {
      return res.status(400).json({
        success: false,
        message: "description and category are required.",
      });
    }

    const fakeComplaint = {
      title,
      description,
      category,
      location,
      name: "User",
    };

    const result = generateFallbackAnalysis(fakeComplaint);

    res.status(200).json({
      success: true,
      message: "Quick analysis complete.",
      analysis: result,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeComplaint,
  quickAnalyze,
};