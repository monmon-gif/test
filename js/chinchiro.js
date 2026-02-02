const rollBtn = document.getElementById("roll");

const diceEl = document.getElementById("dice");
const rankEl = document.getElementById("rank");
const titleEl = document.getElementById("titleText");
const msgEl = document.getElementById("msg");

const pad2 = (n) => String(n).padStart(2, "0");

rollBtn.onclick = () => {
  rollBtn.disabled = true;
  rollBtn.textContent = "振ってる…";

  // ちょい演出：数回チラつかせる
  let ticks = 0;
  const anim = setInterval(() => {
    ticks++;
    diceEl.textContent = `出目：${rollDice().join("・")}`;
    if (ticks >= 8) {
      clearInterval(anim);

      const { dice, judgeResult, rerolls } = rollUntilResult();
      diceEl.textContent = `${dice.join("・")}${rerolls ? `（振り直し${rerolls}回）` : ""}`;

      rankEl.textContent = judgeResult.rank;
      titleEl.textContent = judgeResult.title;
      msgEl.textContent = judgeResult.message;

      rollBtn.disabled = false;
      rollBtn.innerHTML = `<span class="spark">✨</span> 今日の運試し`;
    }
  }, 80);
};

function rollUntilResult(maxReroll = 30) {
  let rerolls = 0;

  while (rerolls <= maxReroll) {
    const dice = rollDice();
    const judgeResult = judgeLuck(dice);

    if (judgeResult.type !== "no_hand") {
      return { dice, judgeResult, rerolls };
    }
    rerolls++;
  }

  const dice = rollDice();
  return {
    dice,
    judgeResult: {
      type: "forced",
      rank: "🟡 中吉",
      title: "結果が出ない日もある",
      message: "目なしが続いたので強制確定。今日は無理せずコツコツが吉。",
    },
    rerolls,
  };
}

function rollDice() {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1)
    .sort((a, b) => a - b);
}

function judgeLuck(dice) {
  const [a, b, c] = dice;

  if (a === 1 && b === 1 && c === 1) {
    return {
      type: "pinzoro",
      rank: "🌈 大吉",
      title: "ピンゾロ",
      message: "今日は主役。新しいことに手を出すと当たりやすい。",
    };
  }

  if (a === 1 && b === 2 && c === 3) {
    return {
      type: "hifumi",
      rank: "💀 大凶",
      title: "ヒフミ",
      message: "慎重に。大きい決断は先送りが吉。財布と足元に注意。",
    };
  }

  if (a === 4 && b === 5 && c === 6) {
    return {
      type: "shigoro",
      rank: "🔥 吉",
      title: "シゴロ",
      message: "流れが来てる。連絡・提出など“送る系”が吉。",
    };
  }

  if (a === b && b === c) {
    const ranks = {
      2: "🟣 中吉",
      3: "🟠 吉",
      4: "🔴 大吉",
      5: "🔴 大吉",
      6: "🌈 超大吉",
    };
    return {
      type: "zoro",
      rank: ranks[a] ?? "🟠 吉",
      title: `${a}のゾロ目`,
      message: "気分よく進めてOK。やるなら今日。",
    };
  }

  let point = null;
  if (a === b) point = c;
  else if (b === c) point = a;
  else if (a === c) point = b;

  if (point !== null) {
    const map = {
      1: { rank: "🔵 末吉", title: "1の目あり", message: "基礎固めの日。整理・復習が効く。" },
      2: { rank: "🟣 中吉", title: "2の目あり", message: "小さく良いこと。コツコツが吉。" },
      3: { rank: "🟠 吉", title: "3の目あり", message: "動くと運が乗る。散歩や軽い運動が◎。" },
      4: { rank: "🔴 大吉", title: "4の目あり", message: "成果が出やすい。タスク消化が吉。" },
      5: { rank: "🌈 超大吉", title: "5の目あり", message: "勝ち筋あり。挑戦が当たりやすい。" },
      6: { rank: "🌈 超大吉", title: "6の目あり", message: "運が強い。迷ったら“やる”が正解寄り。" },
    };
    return { type: "me_ari", ...map[point] };
  }

  return { type: "no_hand", rank: "🔄", title: "目なし", message: "振り直し" };
}
