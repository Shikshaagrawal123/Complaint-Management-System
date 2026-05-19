// controllers/aiController.js - OpenAI-powered complaint analysis
const OpenAI = require('openai');
const Complaint = require('../models/Complaint');

// @desc    Analyze complaint using OpenAI
// @route   POST /api/ai/analyze
// @access  Private
const analyzeComplaint = async (req, res, next) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({
        success: false,
        message: 'complaintId is required.',
      });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Verify ownership or admin
    if (
      complaint.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // If already analyzed within last 24h, return cached
    if (
      complaint.aiAnalysis.analyzedAt &&
      Date.now() - new Date(complaint.aiAnalysis.analyzedAt).getTime() < 86400000
    ) {
      return res.status(200).json({
        success: true,
        message: 'Returning cached AI analysis.',
        analysis: complaint.aiAnalysis,
        complaint,
      });
    }

    // Call OpenAI API
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are an AI assistant for a Smart Complaint Management System for Indian municipal services.

Analyze the following complaint and provide a structured response in JSON format ONLY (no extra text):

Complaint Details:
- Title: ${complaint.title}
- Category: ${complaint.category}
- Description: ${complaint.description}
- Location: ${complaint.location}

Respond with this exact JSON structure:
{
  "priority": "High | Medium | Low",
  "department": "Department name responsible (e.g., Water Department, Electricity Department, Sanitation Department, PWD, etc.)",
  "summary": "A 1-2 sentence summary of the complaint",
  "userResponse": "A professional, empathetic response to the citizen about their complaint (2-3 sentences)"
}

Rules:
- Water leakage, pipe burst → Water Department, High priority
- Power outage, electricity issues → Electricity Department, High/Medium priority
- Garbage, waste → Sanitation Department, Medium priority
- Road damage, potholes → PWD (Public Works Department), Medium priority
- Noise complaints → Municipal Corporation, Low priority
- Base priority on urgency words: "urgent", "dangerous", "no water" = High`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    });

    const rawText = response.choices[0].message.content.trim();

    let aiResult;
    try {
      aiResult = JSON.parse(rawText);
    } catch {
      // Fallback if JSON parse fails
      aiResult = generateFallbackAnalysis(complaint);
    }

    // Save AI analysis to complaint
    complaint.aiAnalysis = {
      priority: aiResult.priority || 'Medium',
      department: aiResult.department || 'Municipal Corporation',
      summary: aiResult.summary || complaint.description.substring(0, 100),
      userResponse: aiResult.userResponse || 'Your complaint has been received and will be addressed shortly.',
      analyzedAt: new Date(),
    };

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'AI analysis completed successfully.',
      analysis: complaint.aiAnalysis,
      complaint,
    });
  } catch (error) {
    // If OpenAI fails, use fallback
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return res.status(503).json({
        success: false,
        message: 'OpenAI quota exceeded. Please check your API key billing.',
      });
    }
    next(error);
  }
};

// Fallback analysis without OpenAI (rule-based)
const generateFallbackAnalysis = (complaint) => {
  const categoryMap = {
    Water: { department: 'Water Department', priority: 'High' },
    Electricity: { department: 'Electricity Department', priority: 'High' },
    Garbage: { department: 'Sanitation Department', priority: 'Medium' },
    Roads: { department: 'PWD (Public Works Department)', priority: 'Medium' },
    Sanitation: { department: 'Sanitation Department', priority: 'Medium' },
    Noise: { department: 'Municipal Corporation', priority: 'Low' },
    Other: { department: 'Municipal Corporation', priority: 'Medium' },
  };

  const mapped = categoryMap[complaint.category] || categoryMap['Other'];
  const descLower = complaint.description.toLowerCase();
  const isUrgent = ['urgent', 'emergency', 'dangerous', 'no water', 'flooded'].some(
    (word) => descLower.includes(word)
  );

  return {
    priority: isUrgent ? 'High' : mapped.priority,
    department: mapped.department,
    summary: `Complaint regarding ${complaint.category.toLowerCase()} issue in ${complaint.location}. Requires attention from the ${mapped.department}.`,
    userResponse: `Dear ${complaint.name}, your complaint about "${complaint.title}" in ${complaint.location} has been received. It has been forwarded to the ${mapped.department} and will be addressed within 3-5 working days. Thank you for bringing this to our attention.`,
  };
};

// @desc    Analyze without saving (quick analyze)
// @route   POST /api/ai/quick-analyze
// @access  Private
const quickAnalyze = async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body;

    if (!description || !category) {
      return res.status(400).json({
        success: false,
        message: 'description and category are required.',
      });
    }

    const fakeComplaint = { title, description, category, location, name: 'User' };
    const result = generateFallbackAnalysis(fakeComplaint);

    res.status(200).json({
      success: true,
      message: 'Quick analysis complete.',
      analysis: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeComplaint, quickAnalyze };
