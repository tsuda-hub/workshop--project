"use client";

import { useState } from "react";
import { generateCurriculum, type Curriculum } from "@/lib/curriculum";
import {
  WORKSHOP_DATA,
  EXERCISE_HOWTO,
  PURPOSES,
  LEVELS,
  DURATIONS,
  C,
  PURPOSE_COLORS,
  PHASE_COLORS,
  type Purpose,
  type Level,
} from "@/data/data";
import { downloadPdf } from "@/lib/generatePdf";

type TimelineItem = {
  name: string;
  duration: number;
  description: string;
  phase: string;
  color: string;
  startTime: number;
};

function buildTimelineItems(curriculum: Curriculum): TimelineItem[] {
  const allItems: TimelineItem[] = [];
  let currentTime = 0;
  curriculum.icebreakers.forEach((ice, i) => {
    const label = curriculum.icebreakers.length > 1 ? `アイスブレイク${["①", "②"][i]}` : "アイスブレイク";
    allItems.push({ ...ice, phase: label, color: PHASE_COLORS["アイスブレイク"], startTime: currentTime });
    currentTime += ice.duration;
  });
  curriculum.main.forEach((ex, i) => {
    if (i > 0) currentTime += 3;
    allItems.push({ ...ex, phase: "メインワーク", color: PHASE_COLORS["メインワーク"], startTime: currentTime });
    currentTime += ex.duration;
  });
  if (curriculum.closing) {
    currentTime += 5;
    allItems.push({ ...curriculum.closing, phase: "クロージング", color: PHASE_COLORS["クロージング"], startTime: currentTime });
  }
  return allItems;
}

function Timeline({ curriculum }: { curriculum: Curriculum }) {
  const allItems = buildTimelineItems(curriculum);
  return (
    <div style={{ position: "relative", padding: "0 0 0 110px", marginTop: 24 }}>
      <div style={{ position: "absolute", left: 96, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${PHASE_COLORS["アイスブレイク"]}, ${PHASE_COLORS["メインワーク"]}, ${PHASE_COLORS["クロージング"]})`, borderRadius: 2 }} />
      {allItems.map((item, i) => (
        <div key={i} className="stagger-item" style={{ position: "relative", marginBottom: 20, paddingLeft: 24, animationDelay: `${i * 0.07}s` }}>
          <div className="mono" style={{ position: "absolute", left: -110, top: 4, width: 82, textAlign: "right", fontSize: 12, color: C.textMuted, fontWeight: 500 }}>{item.startTime}分〜</div>
          <div style={{ position: "absolute", left: -10, top: 7, width: 11, height: 11, borderRadius: "50%", background: item.color, border: `3px solid ${C.bg}`, boxShadow: `0 0 0 2px ${item.color}44` }} />
          <div className="card card--timeline" style={{ borderLeftColor: item.color }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span className="mono" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: item.color }}>{item.phase}</span>
              <span className="mono" style={{ fontSize: 11, color: C.textMuted }}>{item.duration}分</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 6 }}>{item.name}</div>
            <div style={{ fontSize: 13, color: "#444444", lineHeight: 1.75 }}>{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WorkshopGenerator() {
  const [people, setPeople] = useState(10);
  const [purpose, setPurpose] = useState<Purpose | "">("");
  const [level, setLevel] = useState<Level | "">("");
  const [duration, setDuration] = useState<number | null>(null);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showProgram, setShowProgram] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const canGenerate = people > 0 && purpose !== "" && level !== "" && duration !== null;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setCurriculum(generateCurriculum({ people, purpose: purpose as Purpose, level: level as Level, duration: duration! }));
    setIsGenerated(true);
    setAnimKey(k => k + 1);
    window.scrollTo(0, 0);
  };
  const handleRegenerate = () => {
    if (!canGenerate) return;
    setCurriculum(generateCurriculum({ people, purpose: purpose as Purpose, level: level as Level, duration: duration! }));
    setAnimKey(k => k + 1);
    window.scrollTo(0, 0);
  };
  const handleReset = () => {
    setCurriculum(null);
    setIsGenerated(false);
    setShowProgram(false);
    setPurpose("");
    setLevel("");
    setDuration(null);
    setPeople(10);
    window.scrollTo(0, 0);
  };

  const totalExercises = WORKSHOP_DATA.icebreakers.length + Object.values(WORKSHOP_DATA.mainExercises).reduce((s, a) => s + a.length, 0) + WORKSHOP_DATA.closings.length;
  const purposeColor = PURPOSE_COLORS[purpose] || C.accent1;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ヘッダー */}
      {!isGenerated && (
        <div className="header fade-in">
          <div className="header__brand">Theater Method Lab</div>
          <h1 className="header__title">ワークショップメーカー</h1>
          <p className="header__subtitle">あなたのワークショップを、自動でデザインします</p>
          <div className="header__badge">{totalExercises} exercises</div>
        </div>
      )}

      <div className="container">
        {!isGenerated ? (
          <>
            {/* 参加人数 */}
            <div className="form-section fade-in" style={{ animationDelay: "0.05s" }}>
              <label className="form-label">参加人数</label>
              <div className="slider-container">
                <input type="range" min={2} max={35} value={people} onChange={e => setPeople(Number(e.target.value))} />
                <div className="slider-value">{people}</div>
              </div>
            </div>

            {/* 目的 */}
            <div className="form-section fade-in" style={{ animationDelay: "0.1s" }}>
              <label className="form-label">目的</label>
              <div className="form-options">
                {PURPOSES.map(p => {
                  const pc = PURPOSE_COLORS[p];
                  const sel = purpose === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setPurpose(p)}
                      className={`select-btn ${sel ? "select-btn--selected" : ""}`}
                      style={sel ? { color: pc, borderColor: pc, background: `${pc}12` } : undefined}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 参加者レベル */}
            <div className="form-section fade-in" style={{ animationDelay: "0.15s" }}>
              <label className="form-label">参加者レベル</label>
              <div className="form-options">
                {LEVELS.map(l => {
                  const sel = level === l;
                  return (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`select-btn select-btn--wide ${sel ? "select-btn--selected" : ""}`}
                      style={sel ? { color: C.accent2, borderColor: C.accent2, background: `${C.accent2}12` } : undefined}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ワークショップ時間 */}
            <div className="form-section fade-in" style={{ animationDelay: "0.2s", marginBottom: 36 }}>
              <label className="form-label">ワークショップ時間</label>
              <div className="form-options">
                {DURATIONS.map(d => {
                  const sel = duration === d.value;
                  return (
                    <button
                      key={d.value}
                      onClick={() => setDuration(d.value)}
                      className={`select-btn select-btn--half ${sel ? "select-btn--selected" : ""}`}
                      style={sel ? { color: C.accent4, borderColor: C.accent4, background: `${C.accent4}12` } : undefined}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 生成ボタン */}
            <div className="fade-in" style={{ animationDelay: "0.25s" }}>
              <button onClick={handleGenerate} disabled={!canGenerate} className="btn btn--primary">
                カリキュラム作成
              </button>
            </div>
          </>
        ) : curriculum && !showProgram ? (
          <div className="fade-in" key={animKey}>
            {/* タグ一覧 */}
            <div className="form-options" style={{ padding: "16px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
              {[{ label: "人数", value: `${people}名`, color: C.accent1 }, { label: "目的", value: purpose, color: purposeColor }, { label: "レベル", value: level, color: C.accent2 }, { label: "時間", value: `${duration}分`, color: C.accent4 }].map(tag => (
                <div key={tag.label} className="tag" style={{ color: tag.color, background: `${tag.color}10`, border: `1px solid ${tag.color}30` }}>{tag.label}: {tag.value}</div>
              ))}
            </div>
            <div className="text-center mono" style={{ padding: "12px 0 4px", fontSize: 13, color: C.textMuted }}>
              合計: <span style={{ color: C.text, fontWeight: 700 }}>約{curriculum.totalDuration}分</span>
              <span style={{ marginLeft: 8, fontSize: 11 }}>（移動・休憩含め{duration}分枠に収まります）</span>
            </div>
            <Timeline curriculum={curriculum} />

            {/* プログラム作成ボタン */}
            <button
              onClick={() => { setShowProgram(true); window.scrollTo(0, 0); }}
              className="btn btn--secondary"
              style={{ background: C.accent2, boxShadow: `0 4px 16px ${C.accent2}44`, marginTop: 28 }}
            >
              プログラム作成
            </button>
            <div className="btn-row">
              <button onClick={handleRegenerate} className="btn btn--outline" style={{ color: C.accent1 }}>別パターンを生成</button>
              <button onClick={handleReset} className="btn btn--ghost">条件を変更する</button>
            </div>
            <div className="note-box">
              このカリキュラムは叩き台です。ご自身の経験やオリジナルのエクササイズを追加して、あなただけのワークショップに仕上げてください。
            </div>
          </div>
        ) : curriculum && showProgram ? (
          <div className="fade-in">
            {/* タグ一覧 */}
            <div className="form-options" style={{ padding: "16px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
              {[{ label: "人数", value: `${people}名`, color: C.accent1 }, { label: "目的", value: purpose, color: purposeColor }, { label: "レベル", value: level, color: C.accent2 }, { label: "時間", value: `${duration}分`, color: C.accent4 }].map(tag => (
                <div key={tag.label} className="tag" style={{ color: tag.color, background: `${tag.color}10`, border: `1px solid ${tag.color}30` }}>{tag.label}: {tag.value}</div>
              ))}
            </div>
            <div className="text-center" style={{ padding: "20px 0 8px" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.text }}>プログラム詳細</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>各エクササイズのやり方・手順</div>
            </div>

            {/* プログラム詳細カード */}
            {buildTimelineItems(curriculum).map((item, i) => {
              const detail = EXERCISE_HOWTO[item.name];
              return (
                <div key={i} className="card card--program stagger-item" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div style={{ background: `${item.color}10`, borderBottom: `3px solid ${item.color}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span className="mono" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: item.color }}>{item.phase}</span>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginTop: 2 }}>{item.name}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="mono" style={{ fontSize: 11, color: C.textMuted }}>{item.startTime}分〜</div>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.duration}分</div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: 13, color: "#444444", lineHeight: 1.75, marginBottom: 14, padding: "10px 14px", background: C.bg, borderRadius: 8, borderLeft: `3px solid ${item.color}40` }}>{item.description}</div>
                    {detail && (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.accent1, letterSpacing: 1, marginBottom: 8 }}>やり方・手順</div>
                        <div style={{ fontSize: 13, color: C.text, lineHeight: 2 }}>
                          {detail.howto.split("\n").map((line, li) => (
                            <div key={li} style={{ padding: "4px 0", borderBottom: li < detail.howto.split("\n").length - 1 ? `1px dashed ${C.border}` : "none" }}>{line}</div>
                          ))}
                        </div>
                        <div style={{ marginTop: 14, padding: "10px 14px", background: `${C.accent4}08`, borderRadius: 8, border: `1px solid ${C.accent4}20` }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.accent4, marginBottom: 4, letterSpacing: 0.5 }}>ねらい・効果</div>
                          <div style={{ fontSize: 12, color: "#444444", lineHeight: 1.7 }}>{detail.aim}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* PDFダウンロードボタン */}
            <button
              onClick={async () => {
                const btn = document.activeElement as HTMLButtonElement;
                if (btn) { btn.disabled = true; btn.textContent = "PDF生成中..."; }
                try {
                  await downloadPdf({
                    items: buildTimelineItems(curriculum),
                    people,
                    purpose: purpose as Purpose,
                    level,
                    duration: duration!,
                    totalDuration: curriculum.totalDuration,
                  });
                } finally {
                  if (btn) { btn.disabled = false; btn.textContent = "PDFでダウンロード"; }
                }
              }}
              className="btn btn--secondary"
              style={{ background: "#264653", boxShadow: "0 4px 16px #26465344", marginTop: 28 }}
            >
              PDFでダウンロード
            </button>

            <div className="btn-row">
              <button onClick={() => { setShowProgram(false); window.scrollTo(0, 0); }} className="btn btn--outline" style={{ color: C.accent2 }}>カリキュラムに戻る</button>
              <button onClick={handleReset} className="btn btn--ghost">条件を変更する</button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="footer">Powered by Theater Thinking Method</div>
    </div>
  );
}
