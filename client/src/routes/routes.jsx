import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";
import GameScreen from "../screens/GameScreen";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" Component={HomeScreen} />
                <Route path="/game/:gameId" Component={GameScreen} />
            </Routes>
        </Router>
    );
};