import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import CarShop from "./CarShop"; // Import the new CarShop component
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
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Home" />
        <Tab label="Todo List" />
        <Tab label="Car Shop" /> {/* New tab for Car Shop */}
      </Tabs>
      <Box sx={{ padding: 2 }}>
        {activeTab === 0 && (
          <Typography variant="h4" component="div">
            Welcome to Home!
          </Typography>
        )}
        {activeTab === 1 && <TodoList todos={todos} setTodos={setTodos} />}
        {activeTab === 2 && <CarShop />} {/* Render CarShop component */}
      </Box>
    </Box>
  );
}

export default App;