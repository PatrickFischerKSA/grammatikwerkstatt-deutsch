(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function metricCard(label, value) {
    return (
      '<article class="metric-card">' +
      "<span>" +
      escapeHtml(label) +
      "</span>" +
      "<strong>" +
      escapeHtml(value) +
      "</strong>" +
      "</article>"
    );
  }

  function renderMetrics(container, items) {
    container.innerHTML = items
      .map(function (item) {
        return metricCard(item.label, item.value);
      })
      .join("");
  }

  function renderLevelGrid(container, levels, state, storageApi, feedbackApi) {
    container.innerHTML = levels
      .map(function (level) {
        const progress = storageApi.getLevelProgress(state, level.id);
        const donePercent = progress.total === 0 ? 0 : Math.round((progress.completed / progress.total) * 100);
        const reviewDisabled = progress.wrong === 0 ? "disabled" : "";

        return (
          '<article class="level-card">' +
          '<div class="level-head">' +
          "<div>" +
          "<p class=\"section-label\">Level " +
          escapeHtml(level.rank) +
          "</p>" +
          "<h3>" +
          escapeHtml(level.title) +
          "</h3>" +
          "<p>" +
          escapeHtml(level.subtitle) +
          "</p>" +
          "</div>" +
          '<div class="level-rank">' +
          escapeHtml(level.rank) +
          "</div>" +
          "</div>" +
          "<p>" +
          escapeHtml(level.description) +
          "</p>" +
          '<div class="level-modules">' +
          level.modules
            .map(function (module) {
              return '<span class="module-chip">' + escapeHtml(module.title) + "</span>";
            })
            .join("") +
          "</div>" +
          '<div class="level-footer">' +
          '<div class="level-stats">' +
          "<span>" +
          escapeHtml(progress.completed + " / " + progress.total + " bearbeitet") +
          "</span>" +
          "<span>" +
          escapeHtml(progress.wrong + " offen") +
          "</span>" +
          "<span>" +
          escapeHtml(feedbackApi.formatDuration(progress.seconds) + " Lernzeit") +
          "</span>" +
          "</div>" +
          '<div class="meter-block">' +
          '<div class="meter-head"><span>Fortschritt</span><strong>' +
          escapeHtml(donePercent + "%") +
          "</strong></div>" +
          '<div class="meter-track"><div class="meter-fill" style="width:' +
          donePercent +
          '%"></div></div></div>' +
          '<div class="control-row">' +
          '<button class="button button-primary level-action" data-action="start" data-level-id="' +
          escapeHtml(level.id) +
          '" type="button">Level starten</button>' +
          '<button class="button button-secondary level-action" data-action="review" data-level-id="' +
          escapeHtml(level.id) +
          '" type="button" ' +
          reviewDisabled +
          ">Falsch gelöste Aufgaben</button>" +
          '<button class="button button-ghost level-action" data-action="restart" data-level-id="' +
          escapeHtml(level.id) +
          '" type="button">Level neu starten</button>' +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  function setView(elements, viewName) {
    elements.dashboardView.hidden = viewName !== "dashboard";
    elements.sessionView.hidden = viewName !== "session";
    elements.levelCompleteView.hidden = viewName !== "completion";
  }

  function renderModuleOverview(container, level, activeModuleId) {
    container.innerHTML = level.modules
      .map(function (module) {
        const extraClass = module.id === activeModuleId ? " badge badge-warning" : " module-chip";
        return '<span class="' + extraClass.trim() + '">' + escapeHtml(module.title) + "</span>";
      })
      .join("");
  }

  function renderChoiceTask(task, answerState) {
    return (
      '<div class="choice-grid">' +
      task.options
        .map(function (option) {
          const selected = answerState.choiceId === option.id ? " selected" : "";
          return (
            '<button class="choice-card' +
            selected +
            '" data-choice-id="' +
            escapeHtml(option.id) +
            '" type="button">' +
            "<strong>" +
            escapeHtml(option.label) +
            "</strong>" +
            (option.detail ? "<span>" + escapeHtml(option.detail) + "</span>" : "") +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderTextTask(task, answerState) {
    const value = answerState.text || "";
    return (
      '<div class="input-stack">' +
      '<label class="field-label" for="freeInputField">' +
      escapeHtml(task.inputLabel || "Antwort") +
      "</label>" +
      (task.multiline
        ? '<textarea id="freeInputField" class="text-area" spellcheck="false" placeholder="' +
          escapeHtml(task.placeholder || "Antwort eingeben") +
          '">' +
          escapeHtml(value) +
          "</textarea>"
        : '<input id="freeInputField" class="text-field" type="text" spellcheck="false" autocomplete="off" placeholder="' +
          escapeHtml(task.placeholder || "Antwort eingeben") +
          '" value="' +
          escapeHtml(value) +
          '">') +
      "</div>"
    );
  }

  function renderDragTask(task, answerState) {
    const assignedIds = Object.keys(answerState.dragMap).map(function (slotId) {
      return answerState.dragMap[slotId];
    });

    return (
      '<div class="drag-slots">' +
      task.slots
        .map(function (slot) {
          const optionId = answerState.dragMap[slot.id];
          const option = task.options.find(function (item) {
            return item.id === optionId;
          });

          return (
            '<div class="slot-card" data-slot-id="' +
            escapeHtml(slot.id) +
            '">' +
            '<span class="slot-label">' +
            escapeHtml(slot.label) +
            "</span>" +
            '<div class="slot-value" data-slot-target="' +
            escapeHtml(slot.id) +
            '">' +
            (option
              ? '<span class="slot-chip inline-token">' +
                escapeHtml(option.label) +
                "</span>" +
                '<button class="button button-ghost" data-clear-slot="' +
                escapeHtml(slot.id) +
                '" type="button">Lösen</button>'
              : '<span class="slot-empty">Element hier ablegen</span>') +
            "</div>" +
            "</div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="drag-options">' +
      task.options
        .filter(function (option) {
          return !assignedIds.includes(option.id);
        })
        .map(function (option) {
          const selected = answerState.selectedOptionId === option.id ? " selected" : "";
          return (
            '<button class="option-card' +
            selected +
            '" data-option-id="' +
            escapeHtml(option.id) +
            '" draggable="true" type="button">' +
            "<strong>" +
            escapeHtml(option.label) +
            "</strong>" +
            (option.detail ? "<span>" + escapeHtml(option.detail) + "</span>" : "") +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderDiagnosisTask(task, answerState) {
    return (
      '<div class="diagnosis-grid">' +
      '<div class="diagnosis-card-group">' +
      '<p class="field-label">1. Fehlerart bestimmen</p>' +
      '<div class="choice-grid">' +
      task.categoryOptions
        .map(function (option) {
          const selected = answerState.categoryId === option.id ? " selected" : "";
          return (
            '<button class="diagnosis-card choice-card' +
            selected +
            '" data-category-id="' +
            escapeHtml(option.id) +
            '" type="button"><strong>' +
            escapeHtml(option.label) +
            "</strong></button>"
          );
        })
        .join("") +
      "</div>" +
      "</div>" +
      '<div class="diagnosis-card-group">' +
      '<p class="field-label">2. Passende Korrektur wählen</p>' +
      '<div class="choice-grid">' +
      task.correctionOptions
        .map(function (option) {
          const selected = answerState.correctionId === option.id ? " selected" : "";
          return (
            '<button class="diagnosis-card choice-card' +
            selected +
            '" data-correction-id="' +
            escapeHtml(option.id) +
            '" type="button"><strong>' +
            escapeHtml(option.label) +
            "</strong></button>"
          );
        })
        .join("") +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderTaskWorkspace(container, task, answerState, shuffledTask) {
    let markup = '<article class="task-sentence">' + escapeHtml(task.context || "") + "</article>";
    const renderTask = shuffledTask || task;

    if (task.type === "choice") {
      markup += renderChoiceTask(renderTask, answerState);
    }

    if (task.type === "text") {
      markup += renderTextTask(task, answerState);
    }

    if (task.type === "drag") {
      markup += renderDragTask(renderTask, answerState);
    }

    if (task.type === "diagnosis") {
      markup += renderDiagnosisTask(renderTask, answerState);
    }

    container.innerHTML = markup;
  }

  function renderFeedback(panel, task, statusPayload) {
    if (!statusPayload) {
      panel.hidden = true;
      panel.innerHTML = "";
      panel.className = "feedback-panel";
      return;
    }

    const statusClass = "status-" + statusPayload.status;
    let markup =
      '<div class="feedback-head">' +
      "<h3 class=\"feedback-title\">" +
      escapeHtml(statusPayload.title) +
      "</h3>" +
      (statusPayload.badge
        ? '<span class="badge badge-outline">' + escapeHtml(statusPayload.badge) + "</span>"
        : "") +
      "</div>" +
      (statusPayload.message
        ? '<p class="feedback-copy">' + escapeHtml(statusPayload.message) + "</p>"
        : "");

    if (statusPayload.hint) {
      markup +=
        '<div class="feedback-hint"><strong>Hinweis:</strong> ' +
        escapeHtml(statusPayload.hint) +
        "</div>";
    }

    if (statusPayload.showSolution) {
      const legend = window.GrammarTrainerFeedback.getLegend();
      markup +=
        '<div class="solution-grid">' +
        '<div class="solution-block"><h3>Modellantwort</h3><p class="feedback-copy">' +
        escapeHtml(task.solution) +
        "</p></div>" +
        '<div class="solution-block"><h3>Erklärung</h3><p class="feedback-copy">' +
        escapeHtml(task.explanation) +
        "</p></div>" +
        '<div class="solution-block"><h3>Visuelle Auflösung</h3>' +
        '<div class="legend-row">' +
        legend
          .map(function (item) {
            return (
              '<span class="legend-chip token-' +
              escapeHtml(item.role) +
              '">' +
              escapeHtml(item.label) +
              "</span>"
            );
          })
          .join("") +
        "</div>" +
        '<div class="visual-board">' +
        '<div class="visual-line">' +
        (task.visual && task.visual.chips
          ? task.visual.chips
              .map(function (item) {
                return (
                  '<span class="inline-token token-' +
                  escapeHtml(item.role) +
                  '">' +
                  escapeHtml(item.text) +
                  "</span>"
                );
              })
              .join("")
          : "") +
        "</div>" +
        '<div class="visual-links">' +
        (task.visual && task.visual.links
          ? task.visual.links
              .map(function (link) {
                return '<span class="visual-link inline-token">' + escapeHtml(link) + "</span>";
              })
              .join("")
          : "") +
        "</div></div></div></div>";
    }

    panel.hidden = false;
    panel.className = "feedback-panel " + statusClass;
    panel.innerHTML = markup;
  }

  function renderCompletion(elements, payload) {
    elements.completionTitle.textContent = payload.title;
    elements.completionLead.textContent = payload.lead;
    renderMetrics(elements.completionMetrics, payload.metrics);
    elements.completionReviewButton.disabled = !payload.reviewAvailable;
  }

  function cacheElements() {
    return {
      dashboardView: document.getElementById("dashboardView"),
      sessionView: document.getElementById("sessionView"),
      levelCompleteView: document.getElementById("levelCompleteView"),
      overviewMetrics: document.getElementById("overviewMetrics"),
      overallProgressBar: document.getElementById("overallProgressBar"),
      overallProgressText: document.getElementById("overallProgressText"),
      levelGrid: document.getElementById("levelGrid"),
      sessionModeBadge: document.getElementById("sessionModeBadge"),
      sessionTypeBadge: document.getElementById("sessionTypeBadge"),
      sessionLevelName: document.getElementById("sessionLevelName"),
      sessionModuleName: document.getElementById("sessionModuleName"),
      sessionTaskType: document.getElementById("sessionTaskType"),
      sessionTimer: document.getElementById("sessionTimer"),
      sessionWrongCount: document.getElementById("sessionWrongCount"),
      sessionProgressText: document.getElementById("sessionProgressText"),
      sessionProgressBar: document.getElementById("sessionProgressBar"),
      levelProgressText: document.getElementById("levelProgressText"),
      levelProgressBar: document.getElementById("levelProgressBar"),
      moduleOverview: document.getElementById("moduleOverview"),
      taskEyebrow: document.getElementById("taskEyebrow"),
      taskTitle: document.getElementById("taskTitle"),
      taskPrompt: document.getElementById("taskPrompt"),
      taskContext: document.getElementById("taskContext"),
      taskWorkspace: document.getElementById("taskWorkspace"),
      feedbackPanel: document.getElementById("feedbackPanel"),
      attemptBadge: document.getElementById("attemptBadge"),
      completionTitle: document.getElementById("completionTitle"),
      completionLead: document.getElementById("completionLead"),
      completionMetrics: document.getElementById("completionMetrics"),
      completionReviewButton: document.getElementById("completionReviewButton")
    };
  }

  window.GrammarTrainerUI = {
    cacheElements: cacheElements,
    renderMetrics: renderMetrics,
    renderLevelGrid: renderLevelGrid,
    renderModuleOverview: renderModuleOverview,
    renderTaskWorkspace: renderTaskWorkspace,
    renderFeedback: renderFeedback,
    renderCompletion: renderCompletion,
    setView: setView
  };
})();
