import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/* ── tiny helpers ─────────────────────────────────────── */
const isPDF = (f) => f?.type === "application/pdf";
const fmtSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/* ── DropZone sub-component ───────────────────────────── */
function DropZone({ label, icon, file, onFile, accept = ".pdf", error, allowText = false }) {
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState("file"); // "file" | "text"
  const [pastedText, setPastedText] = useState("");
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped && isPDF(dropped)) onFile(dropped, null);
    },
    [onFile]
  );

  const handleTextBlur = () => {
    if (pastedText.trim()) onFile(null, pastedText.trim());
  };

  return (
    <div className="dropzone-wrapper">
      {allowText && (
        <div className="tab-row">
          <button
            className={`dz-tab ${tab === "file" ? "active" : ""}`}
            onClick={() => { setTab("file"); onFile(null, null); }}
          >
            Upload PDF
          </button>
          <button
            className={`dz-tab ${tab === "text" ? "active" : ""}`}
            onClick={() => { setTab("text"); onFile(null, null); }}
          >
            Paste Text
          </button>
        </div>
      )}

      {tab === "file" ? (
        <div
          className={`dropzone ${dragging ? "drag-over" : ""} ${file ? "has-file" : ""} ${error ? "has-error" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files[0];
              if (f && isPDF(f)) onFile(f, null);
              e.target.value = "";
            }}
          />

          {file ? (
            <div className="file-preview">
              <div className="file-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{fmtSize(file.size)}</span>
              </div>
              <button
                className="file-remove"
                onClick={(e) => { e.stopPropagation(); onFile(null, null); }}
                aria-label="Remove file"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="dz-empty">
              <div className="dz-icon">{icon}</div>
              <p className="dz-label">{label}</p>
              <p className="dz-hint">Drag &amp; drop or <span className="dz-browse">browse</span></p>
              <p className="dz-constraint">PDF only · max 5 MB</p>
            </div>
          )}
        </div>
      ) : (
        <textarea
          className={`jd-textarea ${pastedText ? "has-content" : ""}`}
          placeholder="Paste the full job description here…"
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          onBlur={handleTextBlur}
          rows={9}
        />
      )}

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

/* ── main page ────────────────────────────────────────── */
export default function UploadPage() {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile]         = useState(null);
  const [jdText, setJdText]         = useState(null);

  const [errors, setErrors]   = useState({});
  const [stage, setStage]     = useState("idle"); // idle | uploading | analyzing | error
  const [errMsg, setErrMsg]   = useState("");

  /* validation */
  const validate = () => {
    const e = {};
    if (!resumeFile) e.resume = "Please upload your resume PDF.";
    if (!jdFile && !jdText) e.jd = "Please upload or paste the job description.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* submit */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      /* ── 1. upload ── */
      setStage("uploading");
      const form = new FormData();
      form.append("resume_file", resumeFile);
      if (jdFile)   form.append("jd_file", jdFile);
      if (jdText)   form.append("jd_text", jdText);

      const { data: uploadData } = await axios.post(`${API}/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { session_id } = uploadData;

      /* ── 2. analyze ── */
      setStage("analyzing");
      await axios.post(`${API}/analyze`, { session_id });

      /* ── 3. navigate ── */
      navigate(`/results/${session_id}`);
    } catch (err) {
      setStage("error");
      const detail = err?.response?.data?.detail;
      setErrMsg(detail || "Something went wrong. Please try again.");
    }
  };

  const busy = stage === "uploading" || stage === "analyzing";

  const stageLabel = {
    idle:      "Check my resume",
    uploading: "Uploading…",
    analyzing: "Analyzing…",
    error:     "Try again",
  }[stage];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0d0f12;
          color: #e8e6e0;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 56px 20px 80px;
          position: relative;
          overflow: hidden;
        }

        /* ambient blobs */
        .page::before, .page::after {
          content: '';
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.18;
        }
        .page::before {
          width: 600px; height: 600px;
          background: #4f6ef7;
          top: -180px; left: -140px;
        }
        .page::after {
          width: 500px; height: 500px;
          background: #a855f7;
          bottom: -160px; right: -120px;
        }

        .content { position: relative; z-index: 1; width: 100%; max-width: 720px; }

        /* header */
        .header { text-align: center; margin-bottom: 52px; }
        .header-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #7d9cf7;
          background: rgba(79,110,247,0.1);
          border: 1px solid rgba(79,110,247,0.25);
          padding: 5px 12px; border-radius: 99px;
          margin-bottom: 20px;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #4f6ef7;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.5; transform:scale(.7); }
        }
        h3 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -1.5px;
          color: #f0ede6;
          margin-bottom: 14px;
        }
        h3 span { color: #4f6ef7; }
        .subtitle {
          font-size: 15px; font-weight: 300; line-height: 1.6;
          color: #7b7870; max-width: 460px; margin: 0 auto;
        }

        /* card */
        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(12px);
        }

        /* grid */
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        @media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }

        /* section label */
        .section-label {
          font-size: 11px; font-weight: 500; letter-spacing: 1.2px;
          text-transform: uppercase; color: #55524e;
          margin-bottom: 8px;
        }

        /* dropzone wrapper */
        .dropzone-wrapper { display: flex; flex-direction: column; gap: 6px; }

        /* tabs inside dropzone */
        .tab-row { display: flex; gap: 0; margin-bottom: 6px; }
        .dz-tab {
          flex: 1; font-size: 12px; font-weight: 500;
          padding: 6px 0; cursor: pointer;
          background: rgba(255,255,255,0.04);
          color: #55524e; border: 1px solid rgba(255,255,255,0.07);
          transition: all .2s;
        }
        .dz-tab:first-child { border-radius: 8px 0 0 8px; border-right: none; }
        .dz-tab:last-child  { border-radius: 0 8px 8px 0; }
        .dz-tab.active {
          background: rgba(79,110,247,0.12);
          color: #7d9cf7;
          border-color: rgba(79,110,247,0.25);
        }

        /* dropzone */
        .dropzone {
          border: 1.5px dashed rgba(255,255,255,0.1);
          border-radius: 14px;
          min-height: 180px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color .2s, background .2s;
          position: relative;
          overflow: hidden;
        }
        .dropzone:hover { border-color: rgba(79,110,247,0.45); background: rgba(79,110,247,0.04); }
        .dropzone.drag-over { border-color: #4f6ef7; background: rgba(79,110,247,0.08); }
        .dropzone.has-file { border-style: solid; border-color: rgba(79,110,247,0.4); cursor: default; }
        .dropzone.has-error { border-color: rgba(239,68,68,0.45); }

        .dz-empty { text-align: center; padding: 28px 20px; pointer-events: none; }
        .dz-icon {
          font-size: 28px; margin-bottom: 10px;
          filter: grayscale(0.3); opacity: 0.7;
        }
        .dz-label { font-size: 13px; font-weight: 500; color: #c0bdb6; margin-bottom: 4px; }
        .dz-hint  { font-size: 12px; color: #55524e; }
        .dz-browse { color: #4f6ef7; text-decoration: underline; }
        .dz-constraint { font-size: 11px; color: #3e3c39; margin-top: 6px; }

        /* file preview */
        .file-preview {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px; width: 100%;
        }
        .file-icon-wrap {
          width: 44px; height: 44px; flex-shrink: 0;
          background: rgba(79,110,247,0.12);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #4f6ef7;
        }
        .file-info { flex: 1; overflow: hidden; }
        .file-name {
          font-size: 13px; font-weight: 500; color: #e0ddd6;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          display: block;
        }
        .file-size { font-size: 11px; color: #55524e; }
        .file-remove {
          width: 28px; height: 28px; border-radius: 6px;
          background: rgba(239,68,68,0.1); border: none;
          color: #ef4444; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s;
          flex-shrink: 0;
        }
        .file-remove:hover { background: rgba(239,68,68,0.2); }

        /* textarea */
        .jd-textarea {
          width: 100%; min-height: 178px; resize: vertical;
          background: rgba(255,255,255,0.03);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          color: #e0ddd6; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300;
          line-height: 1.6; padding: 14px 16px;
          outline: none; transition: border-color .2s;
        }
        .jd-textarea::placeholder { color: #3e3c39; }
        .jd-textarea:focus { border-color: rgba(79,110,247,0.45); }
        .jd-textarea.has-content { border-color: rgba(79,110,247,0.3); }

        /* error */
        .field-error { font-size: 11px; color: #f87171; padding-left: 2px; }

        /* divider */
        .divider {
          grid-column: 1 / -1;
          display: flex; align-items: center; gap: 12px;
          margin: 4px 0;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1;
          height: 1px; background: rgba(255,255,255,0.06);
        }
        .divider span { font-size: 11px; color: #3e3c39; white-space: nowrap; }

 .submit-wrap { margin-top: 8px; }
        .submit-btn {
          width: 100%; padding: 15px 24px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #e8e6e0;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: .3px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          backdrop-filter: blur(12px);
          transition: background .25s, border-color .25s, box-shadow .25s, transform .15s, opacity .2s;
          position: relative; overflow: hidden;
          box-shadow: 0 0 0 0 rgba(79,110,247,0);
        }
        .submit-btn:hover:not(:disabled) {
          background: rgba(79,110,247,0.12);
          border-color: rgba(79,110,247,0.4);
          box-shadow: 0 0 24px rgba(79,110,247,0.18), inset 0 1px 0 rgba(255,255,255,0.07);
          color: #a8bcff;
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }
 
        /* shimmer on busy */
        .submit-btn.busy::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%);
          animation: shimmer 1.6s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
 
        /* spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
 

        /* stage progress pills */
        .stage-row {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 14px; min-height: 24px;
        }
        .stage-pill {
          font-size: 11px; padding: 3px 10px;
          border-radius: 99px;
          transition: all .3s;
        }
        .stage-pill.done     { background: rgba(34,197,94,0.12); color: #4ade80; }
        .stage-pill.active   { background: rgba(79,110,247,0.15); color: #7d9cf7; }
        .stage-pill.pending  { background: rgba(255,255,255,0.04); color: #3e3c39; }

        /* global error banner */
        .err-banner {
          margin-top: 14px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px; padding: 11px 14px;
          font-size: 13px; color: #f87171; text-align: center;
        }

        /* features strip */
        .features {
          display: flex; gap: 12px; margin-top: 28px;
          flex-wrap: wrap; justify-content: center;
        }
        .feature-pill {
          display: flex; align-items: center; gap: 7px;
          font-size: 12px; color: #55524e;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 6px 12px; border-radius: 99px;
        }
        .feature-dot {
          width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
        }
      `}</style>

      <div className="page">
        <div className="content">

          {/* ── header ── */}
          <header className="header">
            <div className="header-badge">
              <span className="badge-dot" />
              Beat the ATS with AI
            </div>
            <h3>Stop struggling with <span>Resume</span><br />Let AI do the hard part.</h3>
            <p className="subtitle">
              Upload your resume and job description — we'll score your match,
              surface missing keywords, and tell you exactly how to improve.
            </p>
          </header>

          {/* ── upload card ── */}
          <div className="card">
            <div className="grid">

              {/* resume */}
              <div>
                <p className="section-label">Your resume</p>
                <DropZone
                  label="Resume PDF"
                  icon="📄"
                  file={resumeFile}
                  error={errors.resume}
                  onFile={(f) => {
                    setResumeFile(f);
                    setErrors((e) => ({ ...e, resume: null }));
                  }}
                />
              </div>

              {/* jd */}
              <div>
                <p className="section-label">Job description</p>
                <DropZone
                  label="Job Description PDF"
                  icon="📋"
                  file={jdFile}
                  error={errors.jd}
                  allowText
                  onFile={(f, text) => {
                    setJdFile(f);
                    setJdText(text);
                    setErrors((e) => ({ ...e, jd: null }));
                  }}
                />
              </div>

            </div>

            {/* submit */}
          <div className="submit-wrap">
              <button
                className={`submit-btn ${busy ? "busy" : ""}`}
                onClick={stage === "error" ? () => setStage("idle") : handleSubmit}
                disabled={busy}
              >
                {busy && <span className="spinner" />}
                {stageLabel}
              </button>
 
              {/* progress pills */}
              {busy && (
                <div className="stage-row">
                  <span className={`stage-pill ${stage === "uploading" ? "active" : stage === "analyzing" ? "done" : "pending"}`}>
                    {stage === "analyzing" ? "✓ " : ""}Upload
                  </span>
                  <span style={{ fontSize: 11, color: "#3e3c39" }}>→</span>
                  <span className={`stage-pill ${stage === "analyzing" ? "active" : "pending"}`}>
                    Analyze
                  </span>
                  <span style={{ fontSize: 11, color: "#3e3c39" }}>→</span>
                  <span className="stage-pill pending">Results</span>
                </div>
              )}
 
              {/* error banner */}
              {stage === "error" && (
                <div className="err-banner">⚠ {errMsg}</div>
              )}
            </div>
          </div>

          {/* ── feature pills ── */}
          <div className="features">
            {[
              { color: "#4f6ef7", label: "Smart Job Matching" },
              { color: "#a855f7", label: "AI-Powered Resume Analysis" },
              { color: "#22c55e", label: "Resume Optimization" },
              { color: "#f59e0b", label: "Missing Keywords Detection" },
            ].map(({ color, label }) => (
              <div className="feature-pill" key={label}>
                <span className="feature-dot" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}