(function () {
  const dataApi = window.GrammarTrainerData;
  const storageApi = window.GrammarTrainerStorage;
  const feedbackApi = window.GrammarTrainerFeedback;
  const uiApi = window.GrammarTrainerUI;

  const elements = uiApi.cacheElements();
  const staticButtons = {
    mixedTrainingButton: document.getElementById("mixedTrainingButton"),
    continueButton: document.getElementById("continueButton"),
    resetAllButton: document.getElementById("resetAllButton"),
    backToDashboardButton: document.getElementById("backToDashboardButton"),
    checkButton: document.getElementById("checkButton"),
    resetButton: document.getElementById("resetButton"),
    retryButton: document.getElementById("retryButton"),
    nextButton: document.getElementById("nextButton"),
    restartLevelButton: document.getElementById("restartLevelButton"),
    completionReviewButton: document.getElementById("completionReviewButton"),
    completionReplayButton: document.getElementById("completionReplayButton"),
    completionMixedButton: document.getElementById("completionMixedButton"),
    completionDashboardButton: document.getElementById("completionDashboardButton")
  };

  let persistedState = storageApi.loadState();
  let currentSession = null;
  let timerHandle = null;

  function findLevel(levelId) {
    return dataApi.levels.find(function (level) {
      return level.id === levelId;
    });
  }

  function flattenLevelTasks(level) {
    const list = [];

    level.modules.forEach(function (module) {
      module.tasks.forEach(function (task) {
        list.push({
          levelId: level.id,
          levelTitle: level.title,
          moduleId: module.id,
          moduleTitle: module.title,
          task: task
        });
      });
    });

    return list;
  }

  function flattenAllTasks() {
    return dataApi.levels.reduce(function (all, level) {
      return all.concat(flattenLevelTasks(level));
    }, []);
  }

  function buildSessionTasks(mode, levelId) {
    if (mode === "mixed") {
      return feedbackApi.shuffle(flattenAllTasks());
    }

    const level = findLevel(levelId);
    const baseTasks = flattenLevelTasks(level);

    if (mode === "review") {
      const levelState = persistedState.levels[levelId];
      const wrongSet = new Set(levelState ? levelState.wrongTaskIds : []);
      return baseTasks.filter(function (entry) {
        return wrongSet.has(entry.task.id);
      });
    }

    return baseTasks;
  }

  function makeAnswerState(taskType) {
    if (taskType === "choice") {
      return { choiceId: null };
    }

    if (taskType === "text") {
      return { text: "" };
    }

    if (taskType === "drag") {
      return { dragMap: {}, selectedOptionId: null };
    }

    if (taskType === "diagnosis") {
      return { categoryId: null, correctionId: null };
    }

    return {};
  }

  function prepareTaskView(task) {
    const cloned = JSON.parse(JSON.stringify(task));

    if (cloned.options) {
      cloned.options = feedbackApi.shuffle(cloned.options);
    }

    if (cloned.categoryOptions) {
      cloned.categoryOptions = feedbackApi.shuffle(cloned.categoryOptions);
    }

    if (cloned.correctionOptions) {
      cloned.correctionOptions = feedbackApi.shuffle(cloned.correctionOptions);
    }

    return cloned;
  }

  function currentEntry() {
    return currentSession ? currentSession.tasks[currentSession.index] : null;
  }

  function currentLevelId() {
    const entry = currentEntry();
    return entry ? entry.levelId : null;
  }

  function currentLevel() {
    const entry = currentEntry();
    return entry ? findLevel(entry.levelId) : null;
  }

  function currentTask() {
    const entry = currentEntry();
    return entry ? entry.task : null;
  }

  function modeLabel(mode) {
    if (mode === "review") {
      return "Wiederholungsmodus";
    }

    if (mode === "mixed") {
      return "Gemischtes Training";
    }

    return "Levelmodus";
  }

  function commitTaskTime() {
    if (!currentSession || !currentSession.taskStartedAt) {
      return;
    }

    const seconds = Math.round((Date.now() - currentSession.taskStartedAt) / 1000);
    if (seconds > 0) {
      const entry = currentEntry();
      persistedState = storageApi.addLevelSeconds(persistedState, entry.levelId, seconds);
      storageApi.saveState(persistedState);
      currentSession.committedSeconds += seconds;
    }

    currentSession.taskStartedAt = Date.now();
  }

  function startTimer() {
    stopTimer();
    timerHandle = window.setInterval(function () {
      if (!currentSession) {
        return;
      }

      const running = Math.max(0, Math.round((Date.now() - currentSession.taskStartedAt) / 1000));
      elements.sessionTimer.textContent = feedbackApi.formatDuration(
        currentSession.committedSeconds + running
      );
    }, 1000);
  }

  function stopTimer() {
    if (timerHandle) {
      clearInterval(timerHandle);
      timerHandle = null;
    }
  }

  function renderDashboard() {
    const overall = storageApi.getOverallProgress(persistedState);
    const activeLevels = dataApi.levels.filter(function (level) {
      return storageApi.getLevelProgress(persistedState, level.id).completed > 0;
    }).length;

    uiApi.renderMetrics(elements.overviewMetrics, [
      { label: "Bearbeitet", value: overall.completed + " / " + overall.total },
      { label: "Sicher gelöst", value: String(overall.solved) },
      { label: "Offen zur Wiederholung", value: String(overall.wrong) },
      { label: "Lernzeit", value: feedbackApi.formatDuration(overall.seconds) },
      { label: "Aktive Levels", value: String(activeLevels) }
    ]);

    const percent = overall.total === 0 ? 0 : Math.round((overall.completed / overall.total) * 100);
    elements.overallProgressBar.style.width = percent + "%";
    elements.overallProgressText.textContent = overall.completed + " / " + overall.total + " Aufgaben";
    uiApi.renderLevelGrid(elements.levelGrid, dataApi.levels, persistedState, storageApi, feedbackApi);
    uiApi.setView(elements, "dashboard");
  }

  function renderSessionChrome() {
    const entry = currentEntry();
    const task = currentTask();
    const level = currentLevel();
    const levelProgress = storageApi.getLevelProgress(persistedState, entry.levelId);
    const taskLabel = dataApi.taskTypeLabels[task.type];
    const modeText = modeLabel(currentSession.mode);
    const sessionProgress = currentSession.index + 1;
    const levelPercent = levelProgress.total === 0 ? 0 : Math.round((levelProgress.completed / levelProgress.total) * 100);

    elements.sessionModeBadge.textContent = modeText;
    elements.sessionTypeBadge.textContent = taskLabel;
    elements.sessionLevelName.textContent = level.title;
    elements.sessionModuleName.textContent = entry.moduleTitle;
    elements.sessionTaskType.textContent = taskLabel;
    elements.sessionWrongCount.textContent = String(currentSession.failedTaskIds.length);
    elements.sessionProgressText.textContent = sessionProgress + " / " + currentSession.tasks.length;
    elements.sessionProgressBar.style.width =
      Math.round((sessionProgress / currentSession.tasks.length) * 100) + "%";
    elements.levelProgressText.textContent = levelPercent + "%";
    elements.levelProgressBar.style.width = levelPercent + "%";
    elements.taskEyebrow.textContent = level.title + " · " + entry.moduleTitle;
    elements.attemptBadge.textContent = "Versuch " + Math.min(currentSession.attempts + 1, 3) + " von 3";
    uiApi.renderModuleOverview(elements.moduleOverview, level, entry.moduleId);
  }

  function feedbackPayloadForStatus(kind) {
    const task = currentTask();

    if (kind === "correct") {
      return {
        status: "correct",
        title: "Richtig.",
        message: "Die Lösung passt zu Satzbau und Grammatik.",
        badge: "gelöst",
        showSolution: false
      };
    }

    if (kind === "wrong-1") {
      return {
        status: "wrong",
        title: "Falsch.",
        message: "",
        badge: "",
        showSolution: false
      };
    }

    if (kind === "wrong-2") {
      return {
        status: "hint",
        title: "Falsch. Schaue das genauer an.",
        message: "",
        badge: "",
        hint: task.hint,
        showSolution: false
      };
    }

    return {
      status: "solution",
      title: "Modellantwort und Auflösung",
      message: "Nach dem dritten Fehlversuch wird die Lösung mit Erklärung sichtbar.",
      badge: "3. Fehlversuch",
      showSolution: true
    };
  }

  function syncTextInput() {
    const task = currentTask();
    if (!task || task.type !== "text") {
      return;
    }

    const input = document.getElementById("freeInputField");
    if (input) {
      currentSession.answerState.text = input.value;
    }
  }

  function updateButtons() {
    const taskId = currentTask() ? currentTask().id : null;
    const canAdvance =
      currentSession && (currentSession.resolved || currentSession.recordedTaskIds.includes(taskId));
    staticButtons.nextButton.disabled = !canAdvance;
    staticButtons.checkButton.disabled = Boolean(currentSession && currentSession.resolved);
  }

  function renderCurrentTask() {
    const entry = currentEntry();
    const task = currentTask();
    const viewTask = currentSession.viewTask;

    renderSessionChrome();
    elements.taskTitle.textContent = task.title;
    elements.taskPrompt.textContent = task.prompt;
    elements.taskContext.hidden = true;
    elements.taskContext.textContent = "";

    uiApi.renderTaskWorkspace(elements.taskWorkspace, task, currentSession.answerState, viewTask);
    uiApi.renderFeedback(elements.feedbackPanel, task, currentSession.feedbackPayload);
    updateButtons();
    bindTaskInteractions();
    elements.sessionTimer.textContent = feedbackApi.formatDuration(currentSession.committedSeconds);
  }

  function bindTaskInteractions() {
    const task = currentTask();

    if (task.type === "choice") {
      Array.from(elements.taskWorkspace.querySelectorAll("[data-choice-id]")).forEach(function (button) {
        button.addEventListener("click", function () {
          currentSession.answerState.choiceId = button.getAttribute("data-choice-id");
          renderCurrentTask();
        });
      });
    }

    if (task.type === "text") {
      const input = document.getElementById("freeInputField");
      if (input) {
        input.addEventListener("input", function () {
          currentSession.answerState.text = input.value;
        });
      }
    }

    if (task.type === "drag") {
      Array.from(elements.taskWorkspace.querySelectorAll("[data-option-id]")).forEach(function (button) {
        button.addEventListener("click", function () {
          currentSession.answerState.selectedOptionId = button.getAttribute("data-option-id");
          renderCurrentTask();
        });

        button.addEventListener("dragstart", function (event) {
          button.classList.add("is-dragging");
          currentSession.answerState.selectedOptionId = button.getAttribute("data-option-id");
          event.dataTransfer.setData("text/plain", currentSession.answerState.selectedOptionId);
        });

        button.addEventListener("dragend", function () {
          button.classList.remove("is-dragging");
        });
      });

      Array.from(elements.taskWorkspace.querySelectorAll("[data-slot-target]")).forEach(function (slot) {
        slot.addEventListener("click", function () {
          const selectedOptionId = currentSession.answerState.selectedOptionId;
          if (!selectedOptionId) {
            return;
          }
          currentSession.answerState.dragMap[slot.getAttribute("data-slot-target")] = selectedOptionId;
          currentSession.answerState.selectedOptionId = null;
          renderCurrentTask();
        });

        slot.addEventListener("dragover", function (event) {
          event.preventDefault();
          slot.parentElement.classList.add("active-drop");
        });

        slot.addEventListener("dragleave", function () {
          slot.parentElement.classList.remove("active-drop");
        });

        slot.addEventListener("drop", function (event) {
          event.preventDefault();
          const optionId = event.dataTransfer.getData("text/plain") || currentSession.answerState.selectedOptionId;
          if (optionId) {
            currentSession.answerState.dragMap[slot.getAttribute("data-slot-target")] = optionId;
            currentSession.answerState.selectedOptionId = null;
            renderCurrentTask();
          }
        });
      });

      Array.from(elements.taskWorkspace.querySelectorAll("[data-clear-slot]")).forEach(function (button) {
        button.addEventListener("click", function () {
          const slotId = button.getAttribute("data-clear-slot");
          delete currentSession.answerState.dragMap[slotId];
          renderCurrentTask();
        });
      });
    }

    if (task.type === "diagnosis") {
      Array.from(elements.taskWorkspace.querySelectorAll("[data-category-id]")).forEach(function (button) {
        button.addEventListener("click", function () {
          currentSession.answerState.categoryId = button.getAttribute("data-category-id");
          renderCurrentTask();
        });
      });

      Array.from(elements.taskWorkspace.querySelectorAll("[data-correction-id]")).forEach(function (button) {
        button.addEventListener("click", function () {
          currentSession.answerState.correctionId = button.getAttribute("data-correction-id");
          renderCurrentTask();
        });
      });
    }
  }

  function recordTaskResult(outcome) {
    const entry = currentEntry();
    const task = currentTask();

    if (currentSession.recordedTaskIds.includes(task.id)) {
      return;
    }

    if (outcome === "solved") {
      persistedState = storageApi.recordSolved(
        persistedState,
        entry.levelId,
        task.id,
        currentSession.attempts
      );
    } else {
      persistedState = storageApi.recordFailed(persistedState, entry.levelId, task.id);
      if (!currentSession.failedTaskIds.includes(task.id)) {
        currentSession.failedTaskIds.push(task.id);
      }
    }

    storageApi.saveState(persistedState);
    currentSession.recordedTaskIds.push(task.id);
    currentSession.results.push({
      taskId: task.id,
      levelId: entry.levelId,
      outcome: outcome,
      attempts: currentSession.attempts
    });
  }

  function evaluateCurrentTask() {
    const task = currentTask();
    syncTextInput();
    const result = feedbackApi.evaluateTask(task, currentSession.answerState);

    if (!result.complete) {
      currentSession.feedbackPayload = {
        status: "hint",
        title: "Antwort unvollständig.",
        message: "Bitte fülle alle nötigen Felder aus, bevor du prüfst.",
        badge: "",
        showSolution: false
      };
      renderCurrentTask();
      return;
    }

    currentSession.attempts += 1;

    if (result.correct) {
      currentSession.resolved = true;
      currentSession.feedbackPayload = feedbackPayloadForStatus("correct");
      recordTaskResult("solved");
      renderCurrentTask();
      return;
    }

    if (currentSession.attempts === 1) {
      currentSession.feedbackPayload = feedbackPayloadForStatus("wrong-1");
      renderCurrentTask();
      return;
    }

    if (currentSession.attempts === 2) {
      currentSession.feedbackPayload = feedbackPayloadForStatus("wrong-2");
      renderCurrentTask();
      return;
    }

    currentSession.resolved = true;
    currentSession.feedbackPayload = feedbackPayloadForStatus("wrong-3");
    recordTaskResult("failed");
    renderCurrentTask();
  }

  function resetCurrentAttempt(reshuffle) {
    const task = currentTask();
    currentSession.answerState = makeAnswerState(task.type);
    currentSession.feedbackPayload = null;
    currentSession.resolved = false;
    currentSession.attempts = 0;
    if (reshuffle) {
      currentSession.viewTask = prepareTaskView(task);
    }
    renderCurrentTask();
  }

  function showCompletion() {
    stopTimer();
    commitTaskTime();

    const failed = currentSession.results.filter(function (item) {
      return item.outcome === "failed";
    }).length;
    const solved = currentSession.results.filter(function (item) {
      return item.outcome === "solved";
    }).length;
    const title =
      currentSession.mode === "mixed"
        ? "Gemischtes Training abgeschlossen"
        : currentSession.mode === "review"
          ? "Wiederholungsrunde abgeschlossen"
          : currentLevel().title + " abgeschlossen";

    const lead =
      currentSession.mode === "level"
        ? "Das Level ist vollständig bearbeitet. Du kannst offene Fehler gezielt wiederholen oder direkt in den Trainingsmodus wechseln."
        : currentSession.mode === "review"
          ? "Die Wiederholungsrunde ist beendet. Prüfe nun, ob noch offene Aufgaben im Level verbleiben."
          : "Die gemischte Trainingsrunde ist beendet. Die Ergebnisse wurden auf die jeweiligen Levels verteilt gespeichert.";

    uiApi.renderCompletion(elements, {
      title: title,
      lead: lead,
      reviewAvailable:
        currentSession.mode !== "mixed" && storageApi.getLevelProgress(persistedState, currentLevelId()).wrong > 0,
      metrics: [
        { label: "Bearbeitete Aufgaben", value: String(currentSession.results.length) },
        { label: "Direkt oder nach Korrektur gelöst", value: String(solved) },
        { label: "Zur Wiederholung offen", value: String(failed) },
        { label: "Sitzungszeit", value: feedbackApi.formatDuration(currentSession.committedSeconds) }
      ]
    });

    uiApi.setView(elements, "completion");
    renderDashboard();
    uiApi.setView(elements, "completion");
  }

  function nextTask() {
    commitTaskTime();
    currentSession.index += 1;

    if (currentSession.index >= currentSession.tasks.length) {
      showCompletion();
      return;
    }

    const task = currentTask();
    currentSession.answerState = makeAnswerState(task.type);
    currentSession.viewTask = prepareTaskView(task);
    currentSession.feedbackPayload = null;
    currentSession.resolved = false;
    currentSession.attempts = 0;
    currentSession.taskStartedAt = Date.now();
    renderCurrentTask();
  }

  function chooseContinuation() {
    if (persistedState.lastSession && persistedState.lastSession.levelId) {
      startSession(persistedState.lastSession.mode, persistedState.lastSession.levelId);
      return;
    }

    const firstLevel = dataApi.levels[0];
    startSession("level", firstLevel.id);
  }

  function startSession(mode, levelId) {
    if (currentSession) {
      commitTaskTime();
      stopTimer();
    }

    const tasks = buildSessionTasks(mode, levelId);

    if (!tasks.length) {
      window.alert("Für diesen Modus sind momentan keine Aufgaben verfügbar.");
      return;
    }

    const firstTask = tasks[0].task;
    currentSession = {
      mode: mode,
      levelId: levelId,
      tasks: tasks,
      index: 0,
      answerState: makeAnswerState(firstTask.type),
      viewTask: prepareTaskView(firstTask),
      feedbackPayload: null,
      resolved: false,
      attempts: 0,
      taskStartedAt: Date.now(),
      committedSeconds: 0,
      failedTaskIds: [],
      recordedTaskIds: [],
      results: []
    };

    persistedState = storageApi.setLastSession(persistedState, { mode: mode, levelId: levelId });
    storageApi.saveState(persistedState);

    uiApi.setView(elements, "session");
    renderCurrentTask();
    startTimer();
  }

  function leaveSession() {
    if (!currentSession) {
      renderDashboard();
      return;
    }

    commitTaskTime();
    stopTimer();
    currentSession = null;
    uiApi.renderFeedback(elements.feedbackPanel, {}, null);
    renderDashboard();
  }

  function bindStaticControls() {
    staticButtons.mixedTrainingButton.addEventListener("click", function () {
      startSession("mixed", "mixed");
    });

    staticButtons.continueButton.addEventListener("click", function () {
      chooseContinuation();
    });

    staticButtons.resetAllButton.addEventListener("click", function () {
      const confirmed = window.confirm("Wirklich alle Fortschritte und Lernzeiten zurücksetzen?");
      if (!confirmed) {
        return;
      }
      persistedState = storageApi.resetAll();
      renderDashboard();
    });

    elements.levelGrid.addEventListener("click", function (event) {
      const button = event.target.closest(".level-action");
      if (!button) {
        return;
      }

      const action = button.getAttribute("data-action");
      const levelId = button.getAttribute("data-level-id");

      if (action === "start") {
        startSession("level", levelId);
        return;
      }

      if (action === "review") {
        startSession("review", levelId);
        return;
      }

      if (action === "restart") {
        const confirmed = window.confirm("Soll dieses Level wirklich vollständig zurückgesetzt werden?");
        if (!confirmed) {
          return;
        }
        persistedState = storageApi.resetLevel(persistedState, levelId);
        storageApi.saveState(persistedState);
        renderDashboard();
      }
    });

    staticButtons.backToDashboardButton.addEventListener("click", function () {
      leaveSession();
    });

    staticButtons.checkButton.addEventListener("click", function () {
      if (!currentSession) {
        return;
      }
      evaluateCurrentTask();
    });

    staticButtons.resetButton.addEventListener("click", function () {
      if (!currentSession) {
        return;
      }
      currentSession.answerState = makeAnswerState(currentTask().type);
      currentSession.feedbackPayload = null;
      renderCurrentTask();
    });

    staticButtons.retryButton.addEventListener("click", function () {
      if (!currentSession) {
        return;
      }
      resetCurrentAttempt(true);
    });

    staticButtons.nextButton.addEventListener("click", function () {
      if (!currentSession || !currentSession.resolved) {
        return;
      }
      nextTask();
    });

    staticButtons.restartLevelButton.addEventListener("click", function () {
      if (!currentSession || currentSession.mode === "mixed") {
        return;
      }
      const levelId = currentLevelId();
      const confirmed = window.confirm("Soll dieses Level wirklich neu gestartet werden?");
      if (!confirmed) {
        return;
      }
      persistedState = storageApi.resetLevel(persistedState, levelId);
      storageApi.saveState(persistedState);
      startSession("level", levelId);
    });

    staticButtons.completionReviewButton.addEventListener("click", function () {
      if (!currentSession || currentSession.mode === "mixed") {
        renderDashboard();
        return;
      }
      startSession("review", currentSession.levelId);
    });

    staticButtons.completionReplayButton.addEventListener("click", function () {
      if (!currentSession || currentSession.mode === "mixed") {
        const firstLevel = dataApi.levels[0];
        startSession("level", firstLevel.id);
        return;
      }
      startSession("level", currentSession.levelId);
    });

    staticButtons.completionMixedButton.addEventListener("click", function () {
      startSession("mixed", "mixed");
    });

    staticButtons.completionDashboardButton.addEventListener("click", function () {
      currentSession = null;
      renderDashboard();
    });
  }

  bindStaticControls();
  renderDashboard();
})();
