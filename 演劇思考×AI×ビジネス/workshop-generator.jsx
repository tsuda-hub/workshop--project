import { useState } from "react";

const WORKSHOP_DATA = {
  icebreakers: [
    { name: "ネームアクション", duration: 10, minPeople: 3, maxPeople: 30, level: "初級", description: "名前と一緒にジェスチャーを付けて自己紹介。全員がそれを真似する。緊張をほぐし、名前を覚えやすくする。" },
    { name: "ジップ・ザップ・ゾーイ", duration: 10, minPeople: 5, maxPeople: 25, level: "初級", description: "円になり、エネルギーを「ジップ」「ザップ」「ゾーイ」の掛け声で回す。集中力とリアクション速度を高める。" },
    { name: "ミラーリング", duration: 15, minPeople: 2, maxPeople: 40, level: "初級", description: "ペアになり、一方の動きをもう一方が鏡のように真似する。観察力と同調性を養う。" },
    { name: "サウンド＆ムーブメント", duration: 10, minPeople: 4, maxPeople: 30, level: "初級", description: "一人が音と動きを作り、隣の人に渡す。渡された人はそれを変形させて次へ。創造性のウォームアップ。" },
    { name: "ウォーキング・エクササイズ", duration: 15, minPeople: 5, maxPeople: 30, level: "初級", description: "空間を歩きながら、スピード・感情・状況を変えていく。身体の表現力と空間認識を高める。" },
  ],
  mainExercises: {
    "チームビルディング": [
      { name: "グループ彫刻", duration: 20, minPeople: 4, maxPeople: 20, level: "初級", description: "テーマに沿って全員で一つの「彫刻」を体で作る。言葉を使わず、互いの意図を読み取る力を養う。" },
      { name: "ブラインドウォーク", duration: 25, minPeople: 4, maxPeople: 30, level: "初級", description: "目を閉じたパートナーを声だけで誘導する。信頼関係の構築と、明確な指示の出し方を学ぶ。" },
      { name: "マシーン（機械づくり）", duration: 20, minPeople: 5, maxPeople: 25, level: "中級", description: "一人ずつ動きと音を追加して全員で一つの「機械」を作る。チームの一体感と創造的協働を体験。" },
      { name: "ステータスゲーム", duration: 30, minPeople: 4, maxPeople: 20, level: "中級", description: "1〜10のステータス（地位）カードを引き、その立場で振る舞う。組織内の力関係への気づきを得る。" },
      { name: "シップ・イズ・シンキング", duration: 25, minPeople: 8, maxPeople: 30, level: "初級", description: "号令に合わせて即座にグループを組む。瞬時の判断力と協力関係を楽しく鍛える。" },
    ],
    "コミュニケーション": [
      { name: "イエス・アンド", duration: 20, minPeople: 2, maxPeople: 30, level: "初級", description: "相手の提案を「はい、そして…」で受け入れて発展させる。肯定的コミュニケーションの基本を体得。" },
      { name: "ワンワード・ストーリー", duration: 15, minPeople: 3, maxPeople: 20, level: "初級", description: "一人一語ずつ順番に言葉を出して物語を紡ぐ。傾聴力と協調性、予測不能を楽しむ力を養う。" },
      { name: "感情のスイッチ", duration: 25, minPeople: 2, maxPeople: 20, level: "中級", description: "同じセリフを異なる感情で言い分ける。非言語コミュニケーションの影響力を実感する。" },
      { name: "アクティブリスニング・シーン", duration: 30, minPeople: 2, maxPeople: 20, level: "中級", description: "2人で即興シーンを行い、相手のセリフの「最後の言葉」を自分のセリフの最初に使う。深い傾聴を訓練。" },
      { name: "プレゼント・ゲーム", duration: 15, minPeople: 2, maxPeople: 30, level: "初級", description: "見えないプレゼントを渡し、受け取った人がそれが何かを決める。受容と感謝の姿勢を学ぶ。" },
    ],
    "リーダーシップ": [
      { name: "ディレクターズチェア", duration: 30, minPeople: 4, maxPeople: 15, level: "中級", description: "一人が「演出家」として短いシーンを演出。ビジョンの伝え方とフィードバックの出し方を実践。" },
      { name: "フォロー・ザ・リーダー（隠れリーダー）", duration: 20, minPeople: 6, maxPeople: 25, level: "初級", description: "円の中で誰がリーダーかを隠しながら動きを変えていく。影響力と観察力を同時に鍛える。" },
      { name: "ホットシーティング", duration: 30, minPeople: 4, maxPeople: 20, level: "中級", description: "一人が架空のリーダー役として質問に即興で答える。即座の判断力と一貫性のある発言力を磨く。" },
      { name: "スペース・ジャンプ", duration: 25, minPeople: 4, maxPeople: 15, level: "上級", description: "複数のシーンを「フリーズ！」で切り替え、リーダーが物語を管理する。俯瞰力と決断力を養う。" },
      { name: "コーラス・ライン", duration: 20, minPeople: 5, maxPeople: 20, level: "中級", description: "一人のリーダーの動きに全員が同調する。リーダーは交代制。導く側・従う側両方の感覚を知る。" },
    ],
    "プレゼンテーション": [
      { name: "エレベーターピッチ即興", duration: 25, minPeople: 2, maxPeople: 20, level: "中級", description: "ランダムなお題で30秒のプレゼンを即興で行う。瞬発力と説得力のある話し方を訓練。" },
      { name: "感情スピーチ", duration: 20, minPeople: 2, maxPeople: 20, level: "初級", description: "指定された感情でスピーチを行う。声・表情・身体が聴衆に与える印象の違いを体感。" },
      { name: "エキスパート・ゲーム", duration: 25, minPeople: 3, maxPeople: 15, level: "中級", description: "架空の専門家になりきって質疑応答。「知らないことでも堂々と話す」プレゼン度胸をつける。" },
      { name: "ストーリーテリング・リレー", duration: 30, minPeople: 3, maxPeople: 20, level: "中級", description: "一つのストーリーを交代で語り継ぐ。構成力・展開力・聴衆を引き込む話術を磨く。" },
      { name: "TED風3分プレゼン", duration: 30, minPeople: 2, maxPeople: 15, level: "上級", description: "学んだことを3分のTED風プレゼンにまとめる。全エクササイズの集大成として実施。" },
    ],
    "メンタル・自己成長": [
      { name: "感情マッピング", duration: 25, minPeople: 2, maxPeople: 20, level: "初級", description: "身体のどこに感情を感じるかを探り、動きで表現する。自己認識と感情知性を高める。" },
      { name: "内なる批評家 vs 応援団", duration: 30, minPeople: 2, maxPeople: 15, level: "中級", description: "内面の否定的な声と肯定的な声を2人で演じ分ける。セルフトークの影響を客観視。" },
      { name: "ライフライン・シアター", duration: 35, minPeople: 3, maxPeople: 15, level: "中級", description: "人生の転機を短いシーンとして再構成。過去の経験に新たな意味を見出す。" },
      { name: "コンフォートゾーン・チャレンジ", duration: 20, minPeople: 3, maxPeople: 20, level: "初級", description: "段階的に「恥ずかしいこと」に挑戦。安全な場で快適圏を広げる体験をする。" },
      { name: "フューチャーセルフ対話", duration: 30, minPeople: 2, maxPeople: 15, level: "中級", description: "5年後の自分を演じて、今の自分にアドバイスを送る。目標設定と自己対話の力を養う。" },
    ],
  },
  closings: [
    { name: "チェックアウト・サークル", duration: 10, minPeople: 2, maxPeople: 30, level: "初級", description: "一人一言ずつ今日の気づきを共有。学びの定着と一体感を生む。" },
    { name: "ワンワード・リフレクション", duration: 5, minPeople: 2, maxPeople: 40, level: "初級", description: "今日の体験を「一言」で表現。シンプルだが深い振り返りになる。" },
    { name: "グループ・フリーズフレーム", duration: 10, minPeople: 3, maxPeople: 30, level: "初級", description: "今日の学びを全員で一つのポーズとして表現。写真に残せる記念にもなる。" },
    { name: "感謝のギフト", duration: 10, minPeople: 2, maxPeople: 20, level: "初級", description: "隣の人に「見えないギフト」を贈る。今日の体験への感謝を形にする。" },
  ],
};

const PURPOSES = ["チームビルディング", "コミュニケーション", "リーダーシップ", "プレゼンテーション", "メンタル・自己成長"];
const LEVELS = ["初級", "中級", "上級"];
const DURATIONS = [
  { label: "60分", value: 60 },
  { label: "90分", value: 90 },
  { label: "120分（2時間）", value: 120 },
  { label: "180分（3時間）", value: 180 },
];

function generateCurriculum({ people, purpose, level, duration }) {
  const result = { icebreaker: null, main: [], closing: null, totalDuration: 0 };

  // Filter by people count and level
  const levelOrder = { "初級": 1, "中級": 2, "上級": 3 };
  const userLevel = levelOrder[level] || 1;

  const validIcebreakers = WORKSHOP_DATA.icebreakers.filter(
    (e) => people >= e.minPeople && people <= e.maxPeople && levelOrder[e.level] <= userLevel
  );
  const validClosings = WORKSHOP_DATA.closings.filter(
    (e) => people >= e.minPeople && people <= e.maxPeople
  );
  const purposeExercises = (WORKSHOP_DATA.mainExercises[purpose] || []).filter(
    (e) => people >= e.minPeople && people <= e.maxPeople && levelOrder[e.level] <= userLevel
  );

  // Pick icebreaker
  if (validIcebreakers.length > 0) {
    result.icebreaker = validIcebreakers[Math.floor(Math.random() * validIcebreakers.length)];
    result.totalDuration += result.icebreaker.duration;
  }

  // Pick closing
  if (validClosings.length > 0) {
    result.closing = validClosings[Math.floor(Math.random() * validClosings.length)];
    result.totalDuration += result.closing.duration;
  }

  // Fill main exercises
  const remainingTime = duration - result.totalDuration - 10; // 10min buffer for transitions
  let timeUsed = 0;
  const shuffled = [...purposeExercises].sort(() => Math.random() - 0.5);

  for (const ex of shuffled) {
    if (timeUsed + ex.duration <= remainingTime) {
      result.main.push(ex);
      timeUsed += ex.duration;
    }
  }

  // If we have room and few exercises, add from other categories
  if (result.main.length < 2 && timeUsed < remainingTime - 15) {
    const otherPurposes = PURPOSES.filter((p) => p !== purpose);
    for (const op of otherPurposes) {
      const extras = (WORKSHOP_DATA.mainExercises[op] || []).filter(
        (e) =>
          people >= e.minPeople &&
          people <= e.maxPeople &&
          levelOrder[e.level] <= userLevel &&
          !result.main.find((m) => m.name === e.name)
      );
      for (const ex of extras) {
        if (timeUsed + ex.duration <= remainingTime) {
          result.main.push({ ...ex, isBonus: true, bonusCategory: op });
          timeUsed += ex.duration;
          break;
        }
      }
    }
  }

  result.totalDuration = (result.icebreaker?.duration || 0) + timeUsed + (result.closing?.duration || 0);
  return result;
}

// Timeline component
function Timeline({ curriculum, duration }) {
  const allItems = [];
  let currentTime = 0;

  if (curriculum.icebreaker) {
    allItems.push({ ...curriculum.icebreaker, phase: "アイスブレイク", color: "#E8B931", startTime: currentTime });
    currentTime += curriculum.icebreaker.duration;
  }

  curriculum.main.forEach((ex, i) => {
    if (i > 0) currentTime += 3; // transition time
    allItems.push({
      ...ex,
      phase: ex.isBonus ? `ボーナス（${ex.bonusCategory}）` : "メインワーク",
      color: ex.isBonus ? "#7B8CDE" : "#D45D5D",
      startTime: currentTime,
    });
    currentTime += ex.duration;
  });

  if (curriculum.closing) {
    currentTime += 5; // transition time
    allItems.push({ ...curriculum.closing, phase: "クロージング", color: "#5DAD7D", startTime: currentTime });
    currentTime += curriculum.closing.duration;
  }

  return (
    <div style={{ position: "relative", padding: "0 0 0 140px", marginTop: 24 }}>
      {/* Vertical line */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 0,
          bottom: 0,
          width: 3,
          background: "linear-gradient(to bottom, #E8B931, #D45D5D, #5DAD7D)",
          borderRadius: 2,
        }}
      />
      {allItems.map((item, i) => (
        <div key={i} style={{ position: "relative", marginBottom: 28, paddingLeft: 32 }}>
          {/* Time label */}
          <div
            style={{
              position: "absolute",
              left: -140,
              top: 2,
              width: 100,
              textAlign: "right",
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              color: "#8B8B8B",
              fontWeight: 500,
            }}
          >
            {item.startTime}分〜
          </div>
          {/* Dot */}
          <div
            style={{
              position: "absolute",
              left: -13,
              top: 6,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: item.color,
              border: "3px solid #1A1A1A",
              boxShadow: `0 0 12px ${item.color}55`,
            }}
          />
          {/* Card */}
          <div
            style={{
              background: "#1E1E1E",
              borderRadius: 12,
              padding: "16px 20px",
              borderLeft: `4px solid ${item.color}`,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(4px)";
              e.currentTarget.style.boxShadow = `0 4px 20px ${item.color}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  color: item.color,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {item.phase}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#666",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {item.duration}分
              </span>
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#F0F0F0",
                marginBottom: 6,
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#999",
                lineHeight: 1.6,
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              {item.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WorkshopGenerator() {
  const [people, setPeople] = useState(10);
  const [purpose, setPurpose] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const canGenerate = people > 0 && purpose && level && duration;

  const handleGenerate = () => {
    const result = generateCurriculum({ people, purpose, level, duration });
    setCurriculum(result);
    setIsGenerated(true);
  };

  const handleRegenerate = () => {
    const result = generateCurriculum({ people, purpose, level, duration });
    setCurriculum(result);
  };

  const handleReset = () => {
    setCurriculum(null);
    setIsGenerated(false);
    setPurpose("");
    setLevel("");
    setDuration(null);
    setPeople(10);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111111",
        color: "#F0F0F0",
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        style={{
          padding: "40px 24px 32px",
          textAlign: "center",
          borderBottom: "1px solid #222",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#E8B931",
            marginBottom: 12,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Theater Thinking Workshop
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.3,
            background: "linear-gradient(135deg, #F0F0F0, #888)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          演劇思考ワークショップ
          <br />
          カリキュラム生成
        </h1>
        <p style={{ color: "#666", fontSize: 13, marginTop: 8, fontFamily: "'DM Mono', monospace" }}>
          条件を入力するだけで、最適なワークショップメニューを自動構成
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 60px" }}>
        {!isGenerated ? (
          <>
            {/* People Count */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#E8B931",
                  marginBottom: 12,
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                }}
              >
                参加人数
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <input
                  type="range"
                  min={2}
                  max={40}
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: "#E8B931",
                    height: 6,
                  }}
                />
                <div
                  style={{
                    minWidth: 56,
                    textAlign: "center",
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#E8B931",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {people}
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#D45D5D",
                  marginBottom: 12,
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                }}
              >
                目的
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PURPOSES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPurpose(p)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 8,
                      border: purpose === p ? "2px solid #D45D5D" : "2px solid #333",
                      background: purpose === p ? "#D45D5D22" : "#1A1A1A",
                      color: purpose === p ? "#D45D5D" : "#888",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#7B8CDE",
                  marginBottom: 12,
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                }}
              >
                参加者レベル
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: level === l ? "2px solid #7B8CDE" : "2px solid #333",
                      background: level === l ? "#7B8CDE22" : "#1A1A1A",
                      color: level === l ? "#7B8CDE" : "#888",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: 36 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#5DAD7D",
                  marginBottom: 12,
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                }}
              >
                ワークショップ時間
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    style={{
                      flex: "1 1 calc(50% - 4px)",
                      padding: "12px 16px",
                      borderRadius: 8,
                      border: duration === d.value ? "2px solid #5DAD7D" : "2px solid #333",
                      background: duration === d.value ? "#5DAD7D22" : "#1A1A1A",
                      color: duration === d.value ? "#5DAD7D" : "#888",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 12,
                border: "none",
                background: canGenerate
                  ? "linear-gradient(135deg, #E8B931, #D45D5D)"
                  : "#333",
                color: canGenerate ? "#111" : "#666",
                fontSize: 16,
                fontWeight: 900,
                cursor: canGenerate ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                fontFamily: "'Noto Sans JP', sans-serif",
                letterSpacing: 2,
              }}
            >
              🎭 カリキュラムを生成する
            </button>
          </>
        ) : (
          <>
            {/* Summary bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                padding: "16px 0",
                borderBottom: "1px solid #222",
                marginBottom: 8,
              }}
            >
              {[
                { label: "人数", value: `${people}名`, color: "#E8B931" },
                { label: "目的", value: purpose, color: "#D45D5D" },
                { label: "レベル", value: level, color: "#7B8CDE" },
                { label: "時間", value: `${duration}分`, color: "#5DAD7D" },
              ].map((tag) => (
                <div
                  key={tag.label}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: `${tag.color}18`,
                    border: `1px solid ${tag.color}44`,
                    fontSize: 12,
                    fontWeight: 600,
                    color: tag.color,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {tag.label}: {tag.value}
                </div>
              ))}
            </div>

            {/* Total duration */}
            <div
              style={{
                textAlign: "center",
                padding: "12px 0 4px",
                fontSize: 13,
                color: "#666",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              合計所要時間:{" "}
              <span style={{ color: "#F0F0F0", fontWeight: 700 }}>
                約{curriculum.totalDuration}分
              </span>
              （移動・休憩時間を含めると{duration}分枠に収まります）
            </div>

            {/* Timeline */}
            <Timeline curriculum={curriculum} duration={duration} />

            {/* Action buttons */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 32,
              }}
            >
              <button
                onClick={handleRegenerate}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  borderRadius: 10,
                  border: "2px solid #E8B931",
                  background: "transparent",
                  color: "#E8B931",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E8B93122";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                🔄 別パターンを生成
              </button>
              <button
                onClick={handleReset}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  borderRadius: 10,
                  border: "2px solid #444",
                  background: "transparent",
                  color: "#888",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ffffff08";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                ↩ 条件を変更する
              </button>
            </div>

            {/* Footer note */}
            <div
              style={{
                marginTop: 32,
                padding: "16px 20px",
                background: "#1A1A1A",
                borderRadius: 10,
                border: "1px solid #252525",
                fontSize: 12,
                color: "#666",
                lineHeight: 1.7,
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              💡 このカリキュラムは叩き台です。ご自身の経験やオリジナルのエクササイズを追加して、
              あなただけのワークショップに仕上げてください。
              「別パターンを生成」で何度でも新しい組み合わせを試せます。
            </div>
          </>
        )}
      </div>
    </div>
  );
}
