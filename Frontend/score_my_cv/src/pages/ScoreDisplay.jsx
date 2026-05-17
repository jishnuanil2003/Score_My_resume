import React from "react";
import Image from "../../public/1131w-7wI4I6L9Vfc.webp"

export default function ATSResultsPage() {
  const overallScore = 78;

  const sections = [
    { name: "Summary", score: 100 },
    { name: "Experience", score: 92 },
    { name: "Skills", score: 68 },
    { name: "Education", score: 100 },
    { name: "Projects", score: 84 },
  ];

  const missingKeywords = [
    "TensorFlow",
    "Docker",
    "CI/CD",
    "AWS",
    "Kubernetes",
  ];

  const suggestions = [
    "Add more measurable achievements in your experience section.",
    "Include more ATS keywords from the job description.",
    "Simplify complex formatting for better ATS readability.",
    "Mention deployment and cloud technologies.",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0d0f12;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
        }

        .results-page {
          min-height: 100vh;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        .results-page::before,
        .results-page::after {
          content: '';
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.18;
          z-index: 0;
        }

        .results-page::before {
          width: 600px;
          height: 600px;
          background: #4f6ef7;
          top: -200px;
          left: -120px;
        }

        .results-page::after {
          width: 500px;
          height: 500px;
          background: #a855f7;
          bottom: -180px;
          right: -100px;
        }

        .results-container {
          position: relative;
          z-index: 2;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(79,110,247,0.1);
          border: 1px solid rgba(79,110,247,0.25);
          color: #8ea5ff;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 18px;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4f6ef7;
        }

        .results-title {
          font-family: 'Syne', sans-serif;
          font-size: 46px;
          font-weight: 800;
          margin-bottom: 12px;
          line-height: 1.1;
        }

        .results-title span {
          color: #4f6ef7;
        }

        .results-subtitle {
          color: #7b7870;
          line-height: 1.7;
          font-size: 15px;
          max-width: 700px;
          margin-bottom: 40px;
        }

        .top-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 24px;
          align-items: start;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 24px;
          margin-top: 24px;
          align-items: start;
        }

        .glass-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }

        .score-card {
          padding: 26px;
        }

        .score-title {
          text-align: center;
          font-size: 26px;
          margin-bottom: 28px;
          font-weight: 700;
        }

        .gauge-wrap {
          position: relative;
          width: 220px;
          height: 120px;
          margin: 0 auto 24px;
        }

        .gauge-bg,
        .gauge-fill {
          position: absolute;
          width: 220px;
          height: 110px;
          border-radius: 220px 220px 0 0;
          border: 18px solid #ef4444;
          border-bottom: 0;
        }

        .gauge-fill {
          border-color: #22c55e;
          clip-path: polygon(0 0, 78% 0, 78% 100%, 0 100%);
        }

        .score-number {
          position: absolute;
          top: 52px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 42px;
          font-weight: 800;
          color: #22c55e;
        }

        .score-number span {
          font-size: 24px;
          color: #fff;
        }

        .score-text {
          text-align: center;
          color: #d6d6d6;
          line-height: 1.7;
          font-size: 15px;
          margin-bottom: 28px;
        }

        .score-text strong {
          color: #facc15;
        }

        .section-heading {
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .section-item {
          margin-bottom: 16px;
        }

        .section-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 20px;
        }

        .green { background: #22c55e; }
        .yellow { background: #facc15; }
        .red { background: #ef4444; }

        .button-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 28px;
        }

        .primary-btn,
        .secondary-btn {
          padding: 10px;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s;
        }

        .primary-btn {
          background: #4f6ef7;
          border: none;
          color: white;
        }

        .secondary-btn {
          background: rgba(79,110,247,0.08);
          border: 1px solid rgba(79,110,247,0.25);
          color: #a8bcff;
        }

        .primary-btn:hover {
          background: #3c5cf0;
        }

        .secondary-btn:hover {
          background: rgba(79,110,247,0.16);
        }

        .keywords-card,
        .suggestions-card,
        .resume-card {
          padding: 22px;
        }

        .keyword-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .keyword {
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #ff8a8a;
          font-size: 13px;
        }

        .resume-preview {
          background: #f4f4f4;
          border-radius: 18px;
          overflow: hidden;
          height: 720px;
          margin-top: 18px;
        }

        .resume-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .suggestion-item {
          display: flex;
          gap: 14px;
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 14px;
        }

        .suggestion-index {
          min-width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(79,110,247,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a8bcff;
          font-weight: 700;
          font-size: 14px;
        }
        .results-title{
            font-family: 'Syne', sans-serif;
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
            line-height: 1.1;
        }
        .results-title span{ color: #4f6ef7; }
        .subtitle {
          font-size: 15px; font-weight: 300; line-height: 1.6;
          color: #7b7870; max-width: 460px; margin: 0 auto;
        }

        .suggestion-text {
          color: #d6d6d6;
          line-height: 1.7;
          font-size: 14px;
        }

        @media (max-width: 1100px) {
          .top-grid,
          .bottom-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .results-page {
            padding: 20px;
          }
        
          .button-row {
            grid-template-columns: 1fr;
          }

          .resume-preview {
            height: 500px;
          }
        }
      `}</style>

      <div className="results-page">
        <div className="results-container">

          <div className="badge">
            <div className="badge-dot"></div>
            ATS Resume Analysis
          </div>

          <h3 className="results-title">
            Your Resume <span>Performance</span>
          </h3>

          <p className="results-subtitle">
            AI-powered ATS analysis based on formatting,
            keyword relevance, structure quality, and
            job-description matching.
          </p>

          {/* TOP SECTION */}
          <div className="top-grid">

            {/* SCORE */}
            <div className="glass-card score-card">

              <h2 className="score-title">
                ATS Score
              </h2>

              <div className="gauge-wrap">
                <div className="gauge-bg"></div>
                <div className="gauge-fill"></div>

                <div className="score-number">
                  {overallScore}
                  <span>/100</span>
                </div>
              </div>

              <p className="score-text">
                Your resume has a <strong>strong</strong>
                chance of passing ATS screening.
              </p>

              <h3 className="section-heading">
                Section Scores
              </h3>

              {sections.map((section) => (
                <div className="section-item" key={section.name}>
                  <div className="section-row">
                    <span>{section.name}</span>
                    <span>{section.score}%</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${
                        section.score >= 85
                          ? "green"
                          : section.score >= 70
                          ? "yellow"
                          : "red"
                      }`}
                      style={{ width: `${section.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <div className="button-row">
                <button className="primary-btn">
                  Upload Again
                </button>

                <button className="secondary-btn">
                  Download Report
                </button>
              </div>
            </div>

            {/* PREVIEW */}
            <div className="glass-card resume-card">

              <h3 className="section-heading">
                Resume Preview
              </h3>

              <div className="resume-preview">
                <img
                  src={Image}
                  alt="Resume Preview"
                />
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="bottom-grid">

            {/* KEYWORDS */}
            <div className="glass-card keywords-card">

              <h3 className="section-heading">
                Missing Keywords
              </h3>

              <div className="keyword-list">
                {missingKeywords.map((item) => (
                  <div className="keyword" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTIONS */}
            <div className="glass-card suggestions-card">

              <h3 className="section-heading">
                AI Suggestions
              </h3>

              {suggestions.map((item, index) => (
                <div className="suggestion-item" key={index}>
                  <div className="suggestion-index">
                    {index + 1}
                  </div>

                  <p className="suggestion-text">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}