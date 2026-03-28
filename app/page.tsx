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
        <div key={i} style={{ position: "relative", marginBottom: 18, paddingLeft: 24 }}>
          <div style={{ position: "absolute", left: -110, top: 4, width: 82, textAlign: "right", fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.textMuted, fontWeight: 500 }}>{item.startTime}分〜</div>
          <div style={{ position: "absolute", left: -10, top: 7, width: 11, height: 11, borderRadius: "50%", background: item.color, border: `3px solid ${C.bg}`, boxShadow: `0 0 0 2px ${item.color}44` }} />
          <div
            style={{ background: C.cardBg, borderRadius: 10, padding: "14px 18px", borderLeft: `4px solid ${item.color}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "transform 0.15s ease" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateX(3px)"; e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: item.color, fontFamily: "'DM Mono', monospace" }}>{item.phase}</span>
              <span style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{item.duration}分</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7 }}>{item.description}</div>
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

  const canGenerate = people > 0 && purpose !== "" && level !== "" && duration !== null;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setCurriculum(generateCurriculum({ people, purpose: purpose as Purpose, level: level as Level, duration: duration! }));
    setIsGenerated(true);
    window.scrollTo(0, 0);
  };
  const handleRegenerate = () => {
    if (!canGenerate) return;
    setCurriculum(generateCurriculum({ people, purpose: purpose as Purpose, level: level as Level, duration: duration! }));
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
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Noto Sans JP', sans-serif" }}>
      {/* ヘッダー */}
      {!isGenerated && (
        <div style={{ padding: "48px 24px 36px", textAlign: "center", borderBottom: `1px solid ${C.border}`, background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAF8 100%)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 5, textTransform: "uppercase", color: C.accent1, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>Theater Method Lab</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0, lineHeight: 1.4, color: C.text }}>ワークショップメーカー</h1>
          <p style={{ color: C.textSub, fontSize: 15, marginTop: 6, fontWeight: 500 }}>あなたのワークショップを、自動でデザインします</p>
          <div style={{ display: "inline-block", marginTop: 16, padding: "6px 16px", borderRadius: 20, background: `${C.accent1}10`, border: `1px solid ${C.accent1}30`, fontSize: 12, fontWeight: 600, color: C.accent1, fontFamily: "'DM Mono', monospace" }}>{totalExercises} exercises</div>
        </div>
      )}

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 60px" }}>
        {!isGenerated ? (
          <>
            {/* 参加人数 */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 1, color: C.textSub, marginBottom: 12 }}>参加人数</label>
              <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.cardBg, padding: "16px 20px", borderRadius: 12, border: `1px solid ${C.border}` }}>
                <input type="range" min={2} max={35} value={people} onChange={e => setPeople(Number(e.target.value))} style={{ flex: 1 }} />
                <div style={{ minWidth: 56, textAlign: "center", fontSize: 32, fontWeight: 900, color: C.accent1, fontFamily: "'DM Mono', monospace" }}>{people}</div>
              </div>
            </div>

            {/* 目的 */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 1, color: C.textSub, marginBottom: 12 }}>目的</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PURPOSES.map(p => {
                  const pc = PURPOSE_COLORS[p];
                  const sel = purpose === p;
                  return (
                    <button key={p} onClick={() => setPurpose(p)} style={{ padding: "10px 16px", borderRadius: 8, border: `2px solid ${sel ? pc : C.border}`, background: sel ? `${pc}12` : C.cardBg, color: sel ? pc : C.textSub, fontSize: 13, fontWeight: sel ? 700 : 500, cursor: "pointer", transition: "all 0.2s ease" }}>{p}</button>
                  );
                })}
              </div>
            </div>

            {/* 参加者レベル */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 1, color: C.textSub, marginBottom: 12 }}>参加者レベル</label>
              <div style={{ display: "flex", gap: 8 }}>
                {LEVELS.map(l => {
                  const sel = level === l;
                  return (
                    <button key={l} onClick={() => setLevel(l)} style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: sel ? `2px solid ${C.accent2}` : `1px solid ${C.border}`, background: sel ? `${C.accent2}12` : C.cardBg, color: sel ? C.accent2 : C.textSub, fontSize: 14, fontWeight: sel ? 700 : 500, cursor: "pointer", transition: "all 0.2s ease" }}>{l}</button>
                  );
                })}
              </div>
            </div>

            {/* ワークショップ時間 */}
            <div style={{ marginBottom: 36 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 1, color: C.textSub, marginBottom: 12 }}>ワークショップ時間</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DURATIONS.map(d => {
                  const sel = duration === d.value;
                  return (
                    <button key={d.value} onClick={() => setDuration(d.value)} style={{ flex: "1 1 calc(50% - 4px)", padding: "12px 16px", borderRadius: 8, border: sel ? `2px solid ${C.accent4}` : `1px solid ${C.border}`, background: sel ? `${C.accent4}12` : C.cardBg, color: sel ? C.accent4 : C.textSub, fontSize: 14, fontWeight: sel ? 700 : 500, cursor: "pointer", transition: "all 0.2s ease" }}>{d.label}</button>
                  );
                })}
              </div>
            </div>

            {/* 生成ボタン */}
            <button onClick={handleGenerate} disabled={!canGenerate} style={{ width: "100%", padding: "16px 24px", borderRadius: 12, border: "none", background: canGenerate ? C.accent1 : "#E0E0E0", color: canGenerate ? "#FFFFFF" : "#AAA", fontSize: 16, fontWeight: 800, cursor: canGenerate ? "pointer" : "not-allowed", transition: "all 0.3s ease", letterSpacing: 1, boxShadow: canGenerate ? `0 4px 16px ${C.accent1}44` : "none" }}>
              カリキュラム作成
            </button>
          </>
        ) : curriculum && !showProgram ? (
          <>
            {/* タグ一覧 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "16px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
              {[{ label: "人数", value: `${people}名`, color: C.accent1 }, { label: "目的", value: purpose, color: purposeColor }, { label: "レベル", value: level, color: C.accent2 }, { label: "時間", value: `${duration}分`, color: C.accent4 }].map(tag => (
                <div key={tag.label} style={{ padding: "5px 12px", borderRadius: 20, background: `${tag.color}10`, border: `1px solid ${tag.color}30`, fontSize: 12, fontWeight: 600, color: tag.color, fontFamily: "'DM Mono', monospace" }}>{tag.label}: {tag.value}</div>
              ))}
            </div>
            <div style={{ textAlign: "center", padding: "12px 0 4px", fontSize: 13, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>
              合計: <span style={{ color: C.text, fontWeight: 700 }}>約{curriculum.totalDuration}分</span>
              <span style={{ marginLeft: 8, fontSize: 11 }}>（移動・休憩含め{duration}分枠に収まります）</span>
            </div>
            <Timeline curriculum={curriculum} />

            {/* プログラム作成ボタン */}
            <button
              onClick={() => { setShowProgram(true); window.scrollTo(0, 0); }}
              style={{ width: "100%", padding: "16px 24px", borderRadius: 12, border: "none", background: C.accent2, color: "#FFFFFF", fontSize: 16, fontWeight: 800, cursor: "pointer", transition: "all 0.3s ease", letterSpacing: 1, boxShadow: `0 4px 16px ${C.accent2}44`, marginTop: 28 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${C.accent2}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 16px ${C.accent2}44`; }}
            >
              プログラム作成
            </button>
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button onClick={handleRegenerate} style={{ flex: 1, padding: "14px 20px", borderRadius: 10, border: `2px solid ${C.accent1}`, background: "transparent", color: C.accent1, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${C.accent1}08`; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>別パターンを生成</button>
              <button onClick={handleReset} style={{ flex: 1, padding: "14px 20px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.textSub, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F5F5F5"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>条件を変更する</button>
            </div>
            <div style={{ marginTop: 28, padding: "14px 18px", background: C.cardBg, borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12, color: C.textSub, lineHeight: 1.7 }}>
              このカリキュラムは叩き台です。ご自身の経験やオリジナルのエクササイズを追加して、あなただけのワークショップに仕上げてください。
            </div>
          </>
        ) : curriculum && showProgram ? (
          <>
            {/* タグ一覧 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "16px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
              {[{ label: "人数", value: `${people}名`, color: C.accent1 }, { label: "目的", value: purpose, color: purposeColor }, { label: "レベル", value: level, color: C.accent2 }, { label: "時間", value: `${duration}分`, color: C.accent4 }].map(tag => (
                <div key={tag.label} style={{ padding: "5px 12px", borderRadius: 20, background: `${tag.color}10`, border: `1px solid ${tag.color}30`, fontSize: 12, fontWeight: 600, color: tag.color, fontFamily: "'DM Mono', monospace" }}>{tag.label}: {tag.value}</div>
              ))}
            </div>
            <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.text }}>プログラム詳細</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>各エクササイズのやり方・手順</div>
            </div>

            {/* プログラム詳細カード */}
            {buildTimelineItems(curriculum).map((item, i) => {
              const detail = EXERCISE_HOWTO[item.name];
              return (
                <div key={i} style={{ marginBottom: 20, background: C.cardBg, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ background: `${item.color}10`, borderBottom: `3px solid ${item.color}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: item.color, fontFamily: "'DM Mono', monospace" }}>{item.phase}</span>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginTop: 2 }}>{item.name}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>{item.startTime}分〜</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: "'DM Mono', monospace" }}>{item.duration}分</div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7, marginBottom: 14, padding: "10px 14px", background: C.bg, borderRadius: 8, borderLeft: `3px solid ${item.color}40` }}>{item.description}</div>
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
                          <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.7 }}>{detail.aim}</div>
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
              style={{ width: "100%", padding: "16px 24px", borderRadius: 12, border: "none", background: "#264653", color: "#FFFFFF", fontSize: 16, fontWeight: 800, cursor: "pointer", transition: "all 0.3s ease", letterSpacing: 1, boxShadow: "0 4px 16px #26465344", marginTop: 28 }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px #26465366"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px #26465344"; }}
            >
              PDFでダウンロード
            </button>

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button onClick={() => { setShowProgram(false); window.scrollTo(0, 0); }} style={{ flex: 1, padding: "14px 20px", borderRadius: 10, border: `2px solid ${C.accent2}`, background: "transparent", color: C.accent2, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${C.accent2}08`; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>カリキュラムに戻る</button>
              <button onClick={handleReset} style={{ flex: 1, padding: "14px 20px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.textSub, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F5F5F5"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>条件を変更する</button>
            </div>
          </>
        ) : null}
      </div>
      <div style={{ textAlign: "center", padding: "24px", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace" }}>Powered by Theater Thinking Method</div>
    </div>
  );
}
