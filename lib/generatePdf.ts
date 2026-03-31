import jsPDF from "jspdf";
import { EXERCISE_HOWTO, type Purpose } from "@/data/data";

type TimelineItem = {
  name: string;
  duration: number;
  description: string;
  phase: string;
  color: string;
  startTime: number;
};

type PdfParams = {
  items: TimelineItem[];
  people: number;
  purpose: Purpose;
  level: string;
  duration: number;
  totalDuration: number;
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  return res.arrayBuffer();
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function downloadPdf({ items, people, purpose, level, duration, totalDuration }: PdfParams) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const marginL = 18;
  const marginR = 18;
  const contentW = W - marginL - marginR;
  let y = 0;

  // --- 日本語フォント読み込み ---
  const [regularBuf, boldBuf] = await Promise.all([
    loadFont("/fonts/NotoSansJP-Regular.ttf"),
    loadFont("/fonts/NotoSansJP-Bold.ttf"),
  ]);
  const regularB64 = arrayBufferToBase64(regularBuf);
  const boldB64 = arrayBufferToBase64(boldBuf);

  doc.addFileToVFS("NotoSansJP-Regular.ttf", regularB64);
  doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
  doc.addFileToVFS("NotoSansJP-Bold.ttf", boldB64);
  doc.addFont("NotoSansJP-Bold.ttf", "NotoSansJP", "bold");

  const FONT = "NotoSansJP";

  const addPage = () => {
    doc.addPage();
    y = 18;
  };
  const checkPage = (need: number) => {
    if (y + need > 280) addPage();
  };

  // --- ヘッダー ---
  doc.setFillColor(250, 250, 248);
  doc.rect(0, 0, W, 52, "F");

  doc.setFont(FONT, "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 85, 61);
  doc.text("Theater Method Lab", W / 2, 16, { align: "center" });

  doc.setFontSize(20);
  doc.setFont(FONT, "bold");
  doc.setTextColor(26, 26, 26);
  doc.text("ワークショッププログラム", W / 2, 28, { align: "center" });

  // タグ行
  const tags = `${people}名  |  ${purpose}  |  ${level}  |  ${duration}分  |  合計 ${totalDuration}分`;
  doc.setFontSize(8);
  doc.setFont(FONT, "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(tags, W / 2, 38, { align: "center" });

  doc.setDrawColor(232, 232, 228);
  doc.line(marginL, 48, W - marginR, 48);
  y = 56;

  // --- 各エクササイズ ---
  for (const item of items) {
    const detail = EXERCISE_HOWTO[item.name];
    const howtoLines = detail ? detail.howto.split("\n") : [];

    // 高さを事前計算（おおよそ）
    doc.setFontSize(8);
    doc.setFont(FONT, "normal");
    const descWrapped = doc.splitTextToSize(item.description, contentW - 14);
    let estimatedHeight = 24 + descWrapped.length * 4;
    if (detail) {
      doc.setFontSize(7.5);
      for (const line of howtoLines) {
        const w = doc.splitTextToSize(line, contentW - 14);
        estimatedHeight += w.length * 4;
      }
      const aimW = doc.splitTextToSize(detail.aim, contentW - 14);
      estimatedHeight += 14 + aimW.length * 4;
    }
    estimatedHeight += 6;

    checkPage(estimatedHeight);

    const rgb = hexToRgb(item.color);

    // フェーズカラーの左バー
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
    doc.roundedRect(marginL, y, 3, Math.min(estimatedHeight, 280 - y), 1.5, 1.5, "F");

    // フェーズラベル + 時間
    doc.setFontSize(7);
    doc.setFont(FONT, "bold");
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    doc.text(item.phase, marginL + 8, y + 4);

    doc.setFont(FONT, "normal");
    doc.setTextColor(150, 150, 150);
    const timeLabel = `${item.startTime}分〜 / ${item.duration}分`;
    doc.text(timeLabel, marginL + 8 + doc.getTextWidth(item.phase) + 4, y + 4);

    // エクササイズ名
    doc.setFontSize(13);
    doc.setFont(FONT, "bold");
    doc.setTextColor(26, 26, 26);
    doc.text(item.name, marginL + 8, y + 12);

    // 説明
    doc.setFontSize(8);
    doc.setFont(FONT, "normal");
    doc.setTextColor(85, 85, 85);
    doc.text(descWrapped, marginL + 8, y + 18);
    let localY = y + 18 + descWrapped.length * 4;

    // やり方・手順
    if (detail) {
      localY += 3;
      doc.setFontSize(7.5);
      doc.setFont(FONT, "bold");
      doc.setTextColor(200, 85, 61);
      doc.text("やり方・手順", marginL + 8, localY);
      localY += 4;

      doc.setFont(FONT, "normal");
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(7.5);
      for (const line of howtoLines) {
        checkPage(5);
        const wrapped = doc.splitTextToSize(line, contentW - 14);
        doc.text(wrapped, marginL + 8, localY);
        localY += wrapped.length * 4;
      }

      // ねらい
      localY += 2;
      doc.setFontSize(7.5);
      doc.setFont(FONT, "bold");
      doc.setTextColor(42, 157, 143);
      doc.text("ねらい・効果", marginL + 8, localY);
      localY += 4;
      doc.setFont(FONT, "normal");
      doc.setTextColor(85, 85, 85);
      const aimLines = doc.splitTextToSize(detail.aim, contentW - 14);
      doc.text(aimLines, marginL + 8, localY);
      localY += aimLines.length * 4;
    }

    y = localY + 10;
  }

  // --- フッター ---
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont(FONT, "normal");
    doc.setTextColor(180, 180, 180);
    doc.text("Powered by Theater Thinking Method", W / 2, 290, { align: "center" });
    doc.text(`${i} / ${pages}`, W - marginR, 290, { align: "right" });
  }

  // スマホ対応: iOS SafariではBlobを直接開く、それ以外はsave()
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    // iOS Safari: Blob URLを新タブで開く（共有ボタンから保存可能）
    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    // iOS Safariではlocation.hrefでblob PDFを表示できる
    window.location.href = blobUrl;
  } else {
    // PC / Android: jsPDF標準のsave()で確実にダウンロード
    doc.save("workshop-curriculum.pdf");
  }
}
