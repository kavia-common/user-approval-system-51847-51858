import React from "react";

/**
 * @param {{todo: {id: string, title: string, completed: boolean}, onToggle: (id: string) => void, onDelete: (id: string) => void}} props
 */
function TodoItem({ todo, onToggle, onDelete }) {
  const checkboxId = `todo-${todo.id}`;

  return (
    <div className={`item ${todo.completed ? "itemCompleted" : ""}`}>
      <div className="itemLeft">
        <input
          id={checkboxId}
          className="checkbox"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        />
        <label className="itemTitle" htmlFor={checkboxId}>
          {todo.title}
        </label>
      </div>

      <button
        className="iconBtn"
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete todo: ${todo.title}`}
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}

export default TodoItem;
