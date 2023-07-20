import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";
import GameScreen from "../screens/GameScreen";
import CreateGameScreen from "../screens/CreateGameScreen";
import JoinGameScreen from "../screens/JoinGameScreen";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" Component={HomeScreen} />
                <Route path="/game/:gameId" Component={GameScreen} />
                <Route path="/game/create" Component={CreateGameScreen} />
                <Route path="/game/join" Component={JoinGameScreen} />
            </Routes>
        </Router>
    );
};