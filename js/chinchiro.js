const rollBtn = document.getElementById("roll");

const diceEl = document.getElementById("dice");
const rankEl = document.getElementById("rank");
const titleEl = document.getElementById("titleText");
const msgEl = document.getElementById("msg");

rollBtn.onclick = () => {
  rollBtn.disabled = true;
  rollBtn.textContent = "振ってる…";

  // 振ってる演出開始（CSSがあるなら効く）
  diceEl.classList.add("rolling");

  let ticks = 0;
  const anim = setInterval(() => {
    ticks++;

    // 演出中は適当に表示（判定はしない）
    diceEl.textContent = rollDice().join("・");

    if (ticks >= 8) {
      clearInterval(anim);

      // ★確定は1回だけ
      const dice = rollDice().sort((a, b) => a - b);
      const judgeResult = judgeLuck(dice);

      diceEl.textContent = dice.join("・");
      rankEl.textContent = judgeResult.rank;
      titleEl.textContent = judgeResult.title;
      msgEl.textContent = judgeResult.message;

      diceEl.classList.remove("rolling");
      rollBtn.disabled = false;
      rollBtn.innerHTML = `<span class="spark">✨</span> 今日の運試し`;
    }
  }, 80);
};

function rollDice() {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);
}

function judgeLuck(dice) {
  const [a, b, c] = dice;

  // ピンゾロ
  if (a === 1 && b === 1 && c === 1) {
    return {
      type: "pinzoro",
      rank: "🌈 大大大吉🦌",
      title: "ピンゾロ",
      message: "今日は主役。何しても上手くいく。大胆に攻めて",
    };
  }

  // ヒフミ
  if (a === 1 && b === 2 && c === 3) {
    return {
      type: "hifumi",
      rank: "💀 大凶",
      title: "ヒフミ",
      message: "慎重に。大きい決断は先送りが吉。財布と足元に注意。",
    };
  }

  // シゴロ
  if (a === 4 && b === 5 && c === 6) {
    return {
      type: "shigoro",
      rank: "🔥 🌈 超大吉",
      title: "シゴロ",
      message: "君時代代が来てる。積極的に動いて吉。新しいことも◎。",
    };
  }

  // ゾロ目
  if (a === b && b === c) {
    const ranks = {
      2: "🟣 小吉",
      3: "🟠 中吉",
      4: "🔴 吉",
      5: "🔴 吉",
      6: "🌈 大吉",
    };
    return {
      type: "zoro",
      rank: ranks[a] ?? "🟠 吉",
      title: `${a}のゾロ目`,
      message: "気分よく進めてOK。やるなら今日。",
    };
  }

  // 目あり（2個同じ）
  let point = null;
  if (a === b) point = c;
  else if (b === c) point = a;
  else if (a === c) point = b;

  if (point !== null) {
    const map = {
      1: { rank: "🔵 末吉", title: "1の目あり", message: "基礎固めの日。整理・復習が効く。" },
      2: { rank: "🟣 中吉", title: "2の目あり", message: "小さく良いこと。コツコツが吉。" },
      3: { rank: "🟠 吉", title: "3の目あり", message: "動くと運が乗る。散歩や軽い運動が◎。" },
      4: { rank: "🔴 吉", title: "4の目あり", message: "成果が出やすい。タスク消化が吉。" },
      5: { rank: "🌈 大吉", title: "5の目あり", message: "勝ち筋あり。挑戦が当たりやすい。" },
      6: { rank: "🌈 大吉", title: "6の目あり", message: "運が強い。迷ったら“やる”が正解寄り。" },
    };
    return { type: "me_ari", ...map[point] };
  }

  // 役なし（目なし）
  return {
    type: "no_hand",
    rank: "⚪ 役なし",
    title: "目なし",
    message: "今日は無理せず様子見。準備と整理が運を呼ぶ。いつも通りです...",
  };
}