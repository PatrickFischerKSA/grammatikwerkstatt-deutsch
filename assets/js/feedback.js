(function () {
  function normalizeText(value) {
    return String(value || "")
      .normalize("NFKC")
      .trim()
      .replace(/[„“”«»]/g, '"')
      .replace(/[‚‘’]/g, "'")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .toLowerCase();
  }

  function shuffle(items) {
    const list = items.slice();
    for (let index = list.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const current = list[index];
      list[index] = list[randomIndex];
      list[randomIndex] = current;
    }
    return list;
  }

  function formatDuration(totalSeconds) {
    const safeSeconds = Math.max(0, Math.round(Number(totalSeconds) || 0));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    if (hours > 0) {
      return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    }

    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function collectAcceptedAnswers(task) {
    const answers = []
      .concat(task.expectedAnswers || [])
      .concat(task.acceptedAnswers || [])
      .filter(Boolean);
    return answers.map(normalizeText);
  }

  function evaluateChoice(task, answerState) {
    return answerState.choiceId === task.correctOptionId;
  }

  function evaluateText(task, answerState) {
    const accepted = collectAcceptedAnswers(task);
    return accepted.includes(normalizeText(answerState.text));
  }

  function evaluateDrag(task, answerState) {
    const slotIds = task.slots.map(function (slot) {
      return slot.id;
    });

    return slotIds.every(function (slotId) {
      return answerState.dragMap[slotId] === task.correctMap[slotId];
    });
  }

  function evaluateDiagnosis(task, answerState) {
    return (
      answerState.categoryId === task.correctCategoryId &&
      answerState.correctionId === task.correctCorrectionId
    );
  }

  function isComplete(task, answerState) {
    if (!answerState) {
      return false;
    }

    if (task.type === "choice") {
      return Boolean(answerState.choiceId);
    }

    if (task.type === "text") {
      return normalizeText(answerState.text).length > 0;
    }

    if (task.type === "drag") {
      return task.slots.every(function (slot) {
        return Boolean(answerState.dragMap[slot.id]);
      });
    }

    if (task.type === "diagnosis") {
      return Boolean(answerState.categoryId && answerState.correctionId);
    }

    return false;
  }

  function evaluateTask(task, answerState) {
    if (!isComplete(task, answerState)) {
      return { complete: false, correct: false };
    }

    if (task.type === "choice") {
      return { complete: true, correct: evaluateChoice(task, answerState) };
    }

    if (task.type === "text") {
      return { complete: true, correct: evaluateText(task, answerState) };
    }

    if (task.type === "drag") {
      return { complete: true, correct: evaluateDrag(task, answerState) };
    }

    if (task.type === "diagnosis") {
      return { complete: true, correct: evaluateDiagnosis(task, answerState) };
    }

    return { complete: false, correct: false };
  }

  function getLegend() {
    return [
      { label: "Bezugswort", role: "reference" },
      { label: "Pronomen / Anschluss", role: "pronoun" },
      { label: "Verbform", role: "verb" },
      { label: "Problemstelle", role: "error" },
      { label: "Regelhinweis", role: "rule" }
    ];
  }

  window.GrammarTrainerFeedback = {
    normalizeText: normalizeText,
    shuffle: shuffle,
    formatDuration: formatDuration,
    evaluateTask: evaluateTask,
    isComplete: isComplete,
    getLegend: getLegend
  };
})();
