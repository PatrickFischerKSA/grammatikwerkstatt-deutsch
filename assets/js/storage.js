(function () {
  const STORAGE_KEY = "grammatikwerkstatt-deutsch-state-v1";

  function getCatalog() {
    const levels = window.GrammarTrainerData.levels;
    const tasksById = {};
    const levelsById = {};

    levels.forEach(function (level) {
      levelsById[level.id] = level;
      level.modules.forEach(function (module) {
        module.tasks.forEach(function (task) {
          tasksById[task.id] = {
            task: task,
            levelId: level.id,
            moduleId: module.id
          };
        });
      });
    });

    return { tasksById: tasksById, levelsById: levelsById };
  }

  function createLevelState(level) {
    return {
      totalSeconds: 0,
      completedTaskIds: [],
      wrongTaskIds: [],
      taskStats: {},
      completedAtLeastOnce: false,
      lastPlayedAt: null
    };
  }

  function createDefaultState() {
    const state = {
      version: 1,
      lastSession: null,
      levels: {}
    };

    window.GrammarTrainerData.levels.forEach(function (level) {
      state.levels[level.id] = createLevelState(level);
    });

    return state;
  }

  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function ensureStateShape(state) {
    const safe = state && typeof state === "object" ? cloneState(state) : createDefaultState();

    if (!safe.levels || typeof safe.levels !== "object") {
      safe.levels = {};
    }

    window.GrammarTrainerData.levels.forEach(function (level) {
      if (!safe.levels[level.id]) {
        safe.levels[level.id] = createLevelState(level);
      }

      const levelState = safe.levels[level.id];
      levelState.totalSeconds = Number(levelState.totalSeconds) || 0;
      levelState.completedTaskIds = Array.isArray(levelState.completedTaskIds) ? levelState.completedTaskIds : [];
      levelState.wrongTaskIds = Array.isArray(levelState.wrongTaskIds) ? levelState.wrongTaskIds : [];
      levelState.taskStats = levelState.taskStats && typeof levelState.taskStats === "object" ? levelState.taskStats : {};
      levelState.completedAtLeastOnce = Boolean(levelState.completedAtLeastOnce);
      levelState.lastPlayedAt = levelState.lastPlayedAt || null;
    });

    return safe;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }
      return ensureStateShape(JSON.parse(raw));
    } catch (error) {
      return createDefaultState();
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ensureStateShape(state)));
  }

  function getLevelState(state, levelId) {
    const safe = ensureStateShape(state);
    if (!safe.levels[levelId]) {
      safe.levels[levelId] = createLevelState({ id: levelId });
    }
    return safe.levels[levelId];
  }

  function upsertTaskStat(levelState, taskId) {
    if (!levelState.taskStats[taskId]) {
      levelState.taskStats[taskId] = {
        solvedCount: 0,
        failedCount: 0,
        bestAttempts: null,
        lastOutcome: "unseen",
        lastPlayedAt: null
      };
    }
    return levelState.taskStats[taskId];
  }

  function addUnique(list, value) {
    if (!list.includes(value)) {
      list.push(value);
    }
  }

  function removeValue(list, value) {
    const index = list.indexOf(value);
    if (index >= 0) {
      list.splice(index, 1);
    }
  }

  function recordSolved(state, levelId, taskId, attemptsUsed) {
    const safe = ensureStateShape(state);
    const levelState = getLevelState(safe, levelId);
    const stat = upsertTaskStat(levelState, taskId);

    addUnique(levelState.completedTaskIds, taskId);
    removeValue(levelState.wrongTaskIds, taskId);

    stat.solvedCount += 1;
    stat.lastOutcome = "solved";
    stat.lastPlayedAt = new Date().toISOString();
    if (typeof attemptsUsed === "number") {
      stat.bestAttempts =
        stat.bestAttempts === null ? attemptsUsed : Math.min(stat.bestAttempts, attemptsUsed);
    }

    levelState.completedAtLeastOnce = true;
    levelState.lastPlayedAt = stat.lastPlayedAt;

    return safe;
  }

  function recordFailed(state, levelId, taskId) {
    const safe = ensureStateShape(state);
    const levelState = getLevelState(safe, levelId);
    const stat = upsertTaskStat(levelState, taskId);

    addUnique(levelState.completedTaskIds, taskId);
    addUnique(levelState.wrongTaskIds, taskId);

    stat.failedCount += 1;
    stat.lastOutcome = "failed";
    stat.lastPlayedAt = new Date().toISOString();

    levelState.completedAtLeastOnce = true;
    levelState.lastPlayedAt = stat.lastPlayedAt;

    return safe;
  }

  function addLevelSeconds(state, levelId, seconds) {
    const safe = ensureStateShape(state);
    const levelState = getLevelState(safe, levelId);
    const safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
    levelState.totalSeconds += safeSeconds;
    return safe;
  }

  function setLastSession(state, sessionData) {
    const safe = ensureStateShape(state);
    safe.lastSession = sessionData || null;
    return safe;
  }

  function resetLevel(state, levelId) {
    const safe = ensureStateShape(state);
    safe.levels[levelId] = createLevelState({ id: levelId });
    return safe;
  }

  function resetAll() {
    const state = createDefaultState();
    saveState(state);
    return state;
  }

  function getLevelProgress(state, levelId) {
    const catalog = getCatalog();
    const level = catalog.levelsById[levelId];
    const total = level
      ? level.modules.reduce(function (sum, module) {
          return sum + module.tasks.length;
        }, 0)
      : 0;
    const levelState = getLevelState(state, levelId);

    return {
      total: total,
      completed: levelState.completedTaskIds.length,
      wrong: levelState.wrongTaskIds.length,
      solved: levelState.completedTaskIds.length - levelState.wrongTaskIds.length,
      seconds: levelState.totalSeconds
    };
  }

  function getOverallProgress(state) {
    const safe = ensureStateShape(state);
    const totals = {
      total: window.GrammarTrainerData.totalTasks,
      completed: 0,
      wrong: 0,
      solved: 0,
      seconds: 0
    };

    Object.keys(safe.levels).forEach(function (levelId) {
      const progress = getLevelProgress(safe, levelId);
      totals.completed += progress.completed;
      totals.wrong += progress.wrong;
      totals.solved += progress.solved;
      totals.seconds += progress.seconds;
    });

    return totals;
  }

  window.GrammarTrainerStorage = {
    getCatalog: getCatalog,
    loadState: loadState,
    saveState: saveState,
    recordSolved: recordSolved,
    recordFailed: recordFailed,
    addLevelSeconds: addLevelSeconds,
    resetLevel: resetLevel,
    resetAll: resetAll,
    setLastSession: setLastSession,
    getLevelProgress: getLevelProgress,
    getOverallProgress: getOverallProgress
  };
})();
