import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";

/**
 * Generates a reasonably-unique id for todos.
 * Uses crypto.randomUUID when available, otherwise falls back to timestamp + random.
 */
function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const STORAGE_KEY = "kavia.todos.v1";

// PUBLIC_INTERFACE
function App() {
  /** Light theme only per instructions. */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  const [todos, setTodos] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Basic shape validation to avoid breaking UI on bad data.
      return parsed
        .filter((t) => t && typeof t === "object")
        .map((t) => ({
          id: typeof t.id === "string" ? t.id : generateId(),
          title: typeof t.title === "string" ? t.title : "",
          completed: Boolean(t.completed),
          createdAt: typeof t.createdAt === "number" ? t.createdAt : Date.now(),
        }))
        .filter((t) => t.title.trim().length > 0);
    } catch {
      return [];
    }
  });

  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // If storage is unavailable (private mode, etc.), app still works in-memory.
    }
  }, [todos]);

  const remainingCount = useMemo(
    () => todos.reduce((acc, t) => acc + (t.completed ? 0 : 1), 0),
    [todos]
  );

  // PUBLIC_INTERFACE
  const addTodo = () => {
    const title = newTitle.trim();
    if (!title) return;

    const todo = {
      id: generateId(),
      title,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [todo, ...prev]);
    setNewTitle("");
    // Keep flow fast for keyboard users.
    inputRef.current?.focus();
  };

  // PUBLIC_INTERFACE
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // PUBLIC_INTERFACE
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // PUBLIC_INTERFACE
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const onNewTitleKeyDown = (e) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <div className="App">
      <div className="page">
        <main className="card" aria-label="Todo application">
          <header className="header">
            <div>
              <h1 className="title">Todo</h1>
              <p className="subtitle">
                Keep it simple. Stay focused.{" "}
                <span className="badge" aria-label={`${remainingCount} remaining`}>
                  {remainingCount} remaining
                </span>
              </p>
            </div>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={clearCompleted}
              disabled={!todos.some((t) => t.completed)}
              aria-disabled={!todos.some((t) => t.completed)}
              title="Remove all completed todos"
            >
              Clear completed
            </button>
          </header>

          <section className="composer" aria-label="Add a new todo">
            <label className="sr-only" htmlFor="new-todo">
              New todo
            </label>
            <input
              id="new-todo"
              ref={inputRef}
              className="input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={onNewTitleKeyDown}
              placeholder="Add a todo…"
              autoComplete="off"
            />
            <button className="btn btn-primary" type="button" onClick={addTodo}>
              Add
            </button>
          </section>

          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />

          <footer className="footer">
            <span className="footerText">
              Tip: Press <kbd>Enter</kbd> to add.
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
