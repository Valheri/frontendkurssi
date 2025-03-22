import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import TodoList from "./TodoList";

type Todo = {
  description: string;
  priority: string;
  date: string;
};

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box  sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Home" />
        <Tab label="Todo List" />
      </Tabs>
      <Box sx={{ padding: 2 }}>
        {activeTab === 0 && (
          <Typography variant="h4" component="div">
            Welcome to the Home Page!
          </Typography>
        )}
        {activeTab === 1 && <TodoList todos={todos} setTodos={setTodos} />}
      </Box>
    </Box>
  );
}

export default App;